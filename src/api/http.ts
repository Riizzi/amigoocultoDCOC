import { ApiError, type Api, type Gift, type Participant, type ParticipantId, type Session } from './types';

async function call<T>(path: string, init: RequestInit & { token?: string } = {}): Promise<T> {
  const { token, ...rest } = init;
  let res: Response;
  try {
    res = await fetch(`/api/${path}`, {
      ...rest,
      cache: 'no-store',
      headers: {
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    throw new ApiError('Sem conexão. Verifique a internet e tente de novo.');
  }
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new ApiError(data.error ?? 'Erro no servidor. Tente de novo.');
  return data as T;
}

const post = (body: unknown, token?: string): RequestInit & { token?: string } => ({
  method: 'POST',
  body: JSON.stringify(body),
  token,
});

export const httpApi: Api = {
  listParticipants: () => call<Participant[]>('participants'),

  createPin: (id, pin) => call<Session>('pin', post({ id, pin, mode: 'create' })),
  login: (id, pin) => call<Session>('pin', post({ id, pin, mode: 'login' })),

  getMyDraw: async (s) =>
    (await call<{ target: ParticipantId | null }>('draw', { token: s.token })).target,
  draw: async (s) => (await call<{ target: ParticipantId }>('draw', post({}, s.token))).target,

  listGifts: (s, ownerId) =>
    call<Gift[]>(`gifts?owner=${encodeURIComponent(ownerId)}`, { token: s.token }),
  saveGift: (s, gift) => call<Gift>('gifts', post(gift, s.token)),
  deleteGift: async (s, id) => {
    await call(`gifts?id=${encodeURIComponent(id)}`, { method: 'DELETE', token: s.token });
  },

  adminLogin: async (password) =>
    (await call<{ token: string }>('admin', post({ action: 'login', password }))).token,
  adminResetPin: async (token, id) => {
    await call('admin', post({ action: 'resetPin', id }, token));
  },
  adminResetDraw: async (token) => {
    await call('admin', post({ action: 'resetDraw' }, token));
  },
  adminStatus: (token) => call<{ generatedAt: string | null }>('admin', post({ action: 'status' }, token)),
};

