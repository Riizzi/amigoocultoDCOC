import {
  body,
  checkPin,
  db,
  hashPin,
  HttpError,
  isPid,
  json,
  makeToken,
  pinVersion,
  route,
} from './_lib.js';

const MAX_TRIES = 5;
const LOCK_MINUTES = 10;

/** POST /api/pin  { id, pin, mode: 'create' | 'login' } -> { token, participantId } */
export const POST = route(async (req) => {
  const { id, pin, mode } = await body<{ id: unknown; pin: unknown; mode: unknown }>(req);
  if (!isPid(id)) throw new HttpError(400, 'Participante inválido.');
  if (typeof pin !== 'string' || !/^\d{4}$/.test(pin))
    throw new HttpError(400, 'O PIN precisa ter 4 números.');

  if (mode === 'create') {
    const hash = hashPin(pin);
    const { rowCount } = await db.query(
      'UPDATE participants SET pin_hash = $2, fail_count = 0, locked_until = NULL WHERE id = $1 AND pin_hash IS NULL',
      [id, hash],
    );
    if (!rowCount) throw new HttpError(409, 'Este nome já tem PIN. Digite o PIN para entrar.');
    return json({ token: makeToken('user', `${id}:${pinVersion(hash)}`, 24 * 60), participantId: id });
  }

  if (mode !== 'login') throw new HttpError(400, 'Requisição inválida.');

  const { rows } = await db.query<{ pin_hash: string | null; locked_until: Date | null }>(
    'SELECT pin_hash, locked_until FROM participants WHERE id = $1',
    [id],
  );
  const row = rows[0];
  if (!row?.pin_hash) throw new HttpError(409, 'Este nome ainda não tem PIN. Volte e crie um.');
  if (row.locked_until && row.locked_until > new Date()) {
    const min = Math.ceil((row.locked_until.getTime() - Date.now()) / 60_000);
    throw new HttpError(429, `Muitas tentativas erradas. Tente de novo em ${min} min.`);
  }

  if (!checkPin(pin, row.pin_hash)) {
    await db.query(
      `UPDATE participants SET
         fail_count = CASE WHEN fail_count + 1 >= $2 THEN 0 ELSE fail_count + 1 END,
         locked_until = CASE WHEN fail_count + 1 >= $2 THEN now() + make_interval(mins => $3) END
       WHERE id = $1`,
      [id, MAX_TRIES, LOCK_MINUTES],
    );
    throw new HttpError(401, 'PIN incorreto. Tente de novo.');
  }

  await db.query('UPDATE participants SET fail_count = 0, locked_until = NULL WHERE id = $1', [id]);
  return json({
    token: makeToken('user', `${id}:${pinVersion(row.pin_hash)}`, 24 * 60),
    participantId: id,
  });
});
