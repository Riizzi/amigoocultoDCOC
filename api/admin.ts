import { createHash, timingSafeEqual } from 'node:crypto';
import {
  adminPassword,
  assignIfMissing,
  body,
  db,
  HttpError,
  isPid,
  json,
  makeToken,
  requireAdmin,
  route,
} from './_lib.js';

const digest = (s: string) => createHash('sha256').update(s).digest();

/**
 * POST /api/admin
 *   { action: 'login', password }      -> { token }
 *   { action: 'resetPin', id }         (com token)
 *   { action: 'resetDraw' }            (com token)
 *   { action: 'status' }               (com token) -> { generatedAt }
 */
export const POST = route(async (req) => {
  const b = await body<{ action?: string; password?: unknown; id?: unknown }>(req);

  if (b.action === 'login') {
    const ok =
      typeof b.password === 'string' &&
      timingSafeEqual(digest(b.password), digest(adminPassword()));
    if (!ok) throw new HttpError(401, 'Senha de administração incorreta.');
    return json({ token: makeToken('admin', 'admin', 12) });
  }

  requireAdmin(req);

  if (b.action === 'resetPin') {
    if (!isPid(b.id)) throw new HttpError(400, 'Participante inválido.');
    await db.query(
      'UPDATE participants SET pin_hash = NULL, fail_count = 0, locked_until = NULL WHERE id = $1',
      [b.id],
    );
    return json({ ok: true });
  }

  if (b.action === 'resetDraw') {
    await assignIfMissing(true);
    return json({ ok: true });
  }

  if (b.action === 'status') {
    const { rows } = await db.query<{ value: string }>(
      "SELECT value FROM meta WHERE key = 'draw_generated_at'",
    );
    return json({ generatedAt: rows[0]?.value ?? null });
  }

  throw new HttpError(400, 'Ação desconhecida.');
});
