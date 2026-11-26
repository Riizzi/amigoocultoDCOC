import { randomUUID } from 'node:crypto';
import { body, db, HttpError, isPid, json, requireUser, route } from './_lib.js';

const MAX_GIFTS = 20;
const UUID = /^[0-9a-f-]{36}$/i;

interface Row {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  price: string | null;
  link: string;
}

const out = (r: Row) => ({
  id: r.id,
  ownerId: r.owner_id,
  name: r.name,
  description: r.description,
  price: r.price === null ? null : Number(r.price),
  link: r.link,
});

/** GET /api/gifts?owner=id */
export const GET = route(async (req) => {
  await requireUser(req);
  const owner = new URL(req.url).searchParams.get('owner');
  if (!isPid(owner)) throw new HttpError(400, 'Participante inválido.');
  const { rows } = await db.query<Row>(
    'SELECT * FROM gifts WHERE owner_id = $1 ORDER BY position, created_at',
    [owner],
  );
  return json(rows.map(out));
});

/** POST /api/gifts  { id?, name, description, price, link }: cria ou edita a própria sugestão. */
export const POST = route(async (req) => {
  const me = await requireUser(req);
  const g = await body<Record<string, unknown>>(req);

  const name = typeof g.name === 'string' ? g.name.trim().slice(0, 80) : '';
  const description = typeof g.description === 'string' ? g.description.trim().slice(0, 280) : '';
  const link = typeof g.link === 'string' ? g.link.trim().slice(0, 500) : '';
  const price = g.price === null || g.price === undefined ? null : Number(g.price);

  if (!name) throw new HttpError(400, 'Dê um nome para a sugestão.');
  if (price !== null && !(Number.isFinite(price) && price >= 0 && price < 100_000))
    throw new HttpError(400, 'Valor inválido.');
  if (link && !/^https?:\/\/\S+$/i.test(link)) throw new HttpError(400, 'Link inválido.');

  if (typeof g.id === 'string') {
    if (!UUID.test(g.id)) throw new HttpError(400, 'Sugestão inválida.');
    const { rows } = await db.query<Row>(
      `UPDATE gifts SET name = $3, description = $4, price = $5, link = $6
       WHERE id = $1 AND owner_id = $2 RETURNING *`,
      [g.id, me, name, description, price, link],
    );
    if (!rows[0]) throw new HttpError(404, 'Sugestão não encontrada.');
    return json(out(rows[0]));
  }

  const { rows: count } = await db.query<{ n: string }>(
    'SELECT count(*) AS n FROM gifts WHERE owner_id = $1',
    [me],
  );
  if (Number(count[0].n) >= MAX_GIFTS)
    throw new HttpError(400, `Limite de ${MAX_GIFTS} sugestões atingido.`);

  // nova sugestão entra no fim da lista (menor preferência)
  const { rows } = await db.query<Row>(
    `INSERT INTO gifts (id, owner_id, name, description, price, link, position)
     VALUES ($1, $2, $3, $4, $5, $6,
       (SELECT coalesce(max(position), 0) + 1 FROM gifts WHERE owner_id = $2))
     RETURNING *`,
    [randomUUID(), me, name, description, price, link],
  );
  return json(out(rows[0]), 201);
});

/** DELETE /api/gifts?id=uuid */
export const DELETE = route(async (req) => {
  const me = await requireUser(req);
  const id = new URL(req.url).searchParams.get('id') ?? '';
  if (!UUID.test(id)) throw new HttpError(400, 'Sugestão inválida.');
  await db.query('DELETE FROM gifts WHERE id = $1 AND owner_id = $2', [id, me]);
  return json({ ok: true });
});

/** PUT /api/gifts  { order: [id, id, ...] }: ordem de preferência da própria lista (1º = preferido). */
export const PUT = route(async (req) => {
  const me = await requireUser(req);
  const { order } = await body<{ order?: unknown }>(req);
  if (!Array.isArray(order) || order.length > MAX_GIFTS || !order.every((id) => typeof id === 'string' && UUID.test(id)))
    throw new HttpError(400, 'Ordem inválida.');
  await db.query(
    `UPDATE gifts g SET position = v.pos
     FROM unnest($2::uuid[]) WITH ORDINALITY AS v(id, pos)
     WHERE g.id = v.id AND g.owner_id = $1`,
    [me, order],
  );
  return json({ ok: true });
});
