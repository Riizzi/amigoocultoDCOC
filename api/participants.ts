import { db, json, PEOPLE, route } from './_lib.js';

/** GET /api/participants: nomes, quem já tem PIN e quem já sorteou (nunca os pares). */
export const GET = route(async () => {
  const { rows } = await db.query<{ id: string; has_pin: boolean; drawn: boolean }>(
    'SELECT id, pin_hash IS NOT NULL AS has_pin, drawn FROM participants',
  );
  const byId = new Map(rows.map((r) => [r.id, r]));
  return json(
    PEOPLE.map((p) => ({
      id: p.id,
      name: p.name,
      hasPin: Boolean(byId.get(p.id)?.has_pin),
      hasDrawn: Boolean(byId.get(p.id)?.drawn),
    })),
  );
});
