import { db, json, requireUser, route } from './_lib.js';

/** GET /api/draw: quem eu tirei (null se ainda não sorteei). */
export const GET = route(async (req) => {
  const me = await requireUser(req);
  const { rows } = await db.query<{ target: string; drawn: boolean }>(
    'SELECT target, drawn FROM participants WHERE id = $1',
    [me],
  );
  return json({ target: rows[0]?.drawn ? rows[0].target : null });
});

/** POST /api/draw: revela o par já gerado no servidor e marca como sorteado. */
export const POST = route(async (req) => {
  const me = await requireUser(req);
  const { rows } = await db.query<{ target: string }>(
    'UPDATE participants SET drawn = true WHERE id = $1 RETURNING target',
    [me],
  );
  return json({ target: rows[0].target });
});
