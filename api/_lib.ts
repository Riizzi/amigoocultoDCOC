/**
 * Base compartilhada das funções /api (Vercel). Arquivos com "_" não viram rota.
 *
 * Variáveis de ambiente:
 * - DATABASE_URL    (criada pela integração Neon na Vercel)
 * - ADMIN_PASSWORD  (opcional; padrão "admin")
 * - SESSION_SECRET  (opcional; se faltar, é derivada da DATABASE_URL)
 */
import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import pg from 'pg';

export const PEOPLE = [
  { id: 'bruno', name: 'Bruno' },
  { id: 'daiane', name: 'Daiane' },
  { id: 'diego', name: 'Diego' },
  { id: 'isabela', name: 'Isabela' },
  { id: 'joao', name: 'João' },
  { id: 'livia', name: 'Lívia' },
  { id: 'marcia', name: 'Márcia' },
] as const;
export type Pid = (typeof PEOPLE)[number]['id'];
export const isPid = (v: unknown): v is Pid => PEOPLE.some((p) => p.id === v);

/* ---------- respostas ---------- */

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

/** Envolve um handler: garante o banco pronto e transforma erros em JSON. */
export function route(fn: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    try {
      await ready();
      return await fn(req);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.message }, e.status);
      console.error(e);
      return json({ error: 'Erro no servidor. Tente de novo em instantes.' }, 500);
    }
  };
}

export async function body<T>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new HttpError(400, 'Requisição inválida.');
  }
}

/* ---------- banco ---------- */

const url = process.env.DATABASE_URL;
export const db = new pg.Pool({ connectionString: url, max: 3 });

let readyPromise: Promise<void> | null = null;
function ready() {
  if (!url) throw new HttpError(500, 'Banco de dados não configurado (DATABASE_URL).');
  readyPromise ??= migrate().catch((e) => {
    readyPromise = null;
    throw e;
  });
  return readyPromise;
}

async function migrate() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS participants (
      id text PRIMARY KEY,
      pin_hash text,
      drawn boolean NOT NULL DEFAULT false,
      target text,
      fail_count int NOT NULL DEFAULT 0,
      locked_until timestamptz
    );
    CREATE TABLE IF NOT EXISTS gifts (
      id uuid PRIMARY KEY,
      owner_id text NOT NULL REFERENCES participants(id),
      name text NOT NULL,
      description text NOT NULL DEFAULT '',
      price numeric(8,2),
      link text NOT NULL DEFAULT '',
      created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS gifts_owner ON gifts(owner_id);
    ALTER TABLE gifts ADD COLUMN IF NOT EXISTS position int NOT NULL DEFAULT 0;
    CREATE TABLE IF NOT EXISTS meta (key text PRIMARY KEY, value text NOT NULL);
  `);
  const ids = PEOPLE.map((p) => p.id);
  await db.query(
    `INSERT INTO participants (id) SELECT unnest($1::text[]) ON CONFLICT DO NOTHING`,
    [ids],
  );
  await assignIfMissing(false);
}

/** Permutação uniforme em que ninguém tira a si mesmo (pares recíprocos permitidos). */
export function derangement(ids: string[]): Map<string, string> {
  for (;;) {
    const s = [...ids];
    for (let i = s.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [s[i], s[j]] = [s[j], s[i]];
    }
    if (s.every((t, i) => t !== ids[i])) return new Map(ids.map((id, i) => [id, s[i]]));
  }
}

/** Gera o sorteio secreto. force=true refaz e zera quem já sorteou. */
export async function assignIfMissing(force: boolean) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(1112026)');
    const { rows } = await client.query<{ n: string }>(
      'SELECT count(*) AS n FROM participants WHERE target IS NULL',
    );
    if (force || Number(rows[0].n) > 0) {
      const ids = PEOPLE.map((p) => p.id as string);
      const pairs = derangement(ids);
      await client.query(
        `UPDATE participants p SET target = v.t, drawn = false
         FROM unnest($1::text[], $2::text[]) AS v(id, t) WHERE p.id = v.id`,
        [ids, ids.map((id) => pairs.get(id))],
      );
      await client.query(
        `INSERT INTO meta (key, value) VALUES ('draw_generated_at', $1)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
        [new Date().toISOString()],
      );
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

/* ---------- PIN ---------- */

export function hashPin(pin: string) {
  const salt = randomBytes(16);
  const key = scryptSync(pin, salt, 32);
  return `scrypt$${salt.toString('base64')}$${key.toString('base64')}`;
}

export function checkPin(pin: string, stored: string) {
  const [, salt, key] = stored.split('$');
  const got = scryptSync(pin, Buffer.from(salt, 'base64'), 32);
  return timingSafeEqual(got, Buffer.from(key, 'base64'));
}

/* ---------- sessões (token assinado) ---------- */

const secret =
  process.env.SESSION_SECRET ||
  createHash('sha256').update(`amigo-oculto-dcoc:${url ?? ''}`).digest('hex');

const b64 = (s: string) => Buffer.from(s).toString('base64url');
const sign = (s: string) => createHmac('sha256', secret).update(s).digest('base64url');
/** Versão do PIN dentro do token: zerar o PIN derruba as sessões antigas. */
export const pinVersion = (pinHash: string) =>
  createHash('sha256').update(pinHash).digest('hex').slice(0, 10);

export function makeToken(kind: 'user' | 'admin', sub: string, ttlHours: number) {
  const payload = b64(JSON.stringify({ k: kind, s: sub, e: Date.now() + ttlHours * 3_600_000 }));
  return `${payload}.${sign(payload)}`;
}

function readToken(req: Request, kind: 'user' | 'admin') {
  const raw = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  const [payload, sig] = raw.split('.');
  if (!payload || !sig) return null;
  const expected = sign(payload);
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected)))
    return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as {
      k: string;
      s: string;
      e: number;
    };
    return data.k === kind && data.e > Date.now() ? data.s : null;
  } catch {
    return null;
  }
}

const EXPIRED = 'Sessão expirada. Entre de novo com seu PIN.';

/** Devolve o id do participante logado ou lança 401. */
export async function requireUser(req: Request): Promise<Pid> {
  const sub = readToken(req, 'user');
  const [id, pv] = (sub ?? '').split(':');
  if (!isPid(id)) throw new HttpError(401, EXPIRED);
  const { rows } = await db.query<{ pin_hash: string | null }>(
    'SELECT pin_hash FROM participants WHERE id = $1',
    [id],
  );
  const hash = rows[0]?.pin_hash;
  if (!hash || pinVersion(hash) !== pv) throw new HttpError(401, EXPIRED);
  return id;
}

export function requireAdmin(req: Request) {
  if (readToken(req, 'admin') !== 'admin') throw new HttpError(401, 'Entre de novo na administração.');
}

export const adminPassword = () => process.env.ADMIN_PASSWORD || 'admin';
