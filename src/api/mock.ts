import { PEOPLE } from '../data';
import {
  ApiError,
  type Api,
  type Gift,
  type ParticipantId,
  type Session,
} from './types';

/**
 * Versão simulada, só para o preview: guarda tudo no navegador.
 * Não é segura (o sorteio fica visível no localStorage) e não é
 * compartilhada entre aparelhos. No deploy, quem responde é o servidor.
 */

interface Db {
  pins: Partial<Record<ParticipantId, string>>;
  assignment: Record<ParticipantId, ParticipantId>;
  drawn: ParticipantId[];
  gifts: Gift[];
}

const KEY = 'amigo-oculto-dcoc:mock';
const ADMIN_PASSWORD = 'admin';
let memory: Db | null = null;

export function derangement(ids: ParticipantId[]): Record<ParticipantId, ParticipantId> {
  // Permutação uniforme por rejeição: a única regra é ninguém tirar a si mesmo.
  // Pares recíprocos (A tira B e B tira A) são permitidos.
  for (;;) {
    const shuffled = [...ids];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    if (shuffled.every((t, i) => t !== ids[i])) {
      return Object.fromEntries(ids.map((id, i) => [id, shuffled[i]])) as Record<
        ParticipantId,
        ParticipantId
      >;
    }
  }
}

function seed(): Db {
  return {
    pins: {},
    assignment: derangement(PEOPLE.map((p) => p.id)),
    drawn: [],
    gifts: [
      {
        id: 'g1',
        ownerId: 'livia',
        name: 'Necessaire de viagem',
        description: 'Tamanho médio, de preferência com divisórias.',
        price: 45,
        link: '',
      },
      {
        id: 'g2',
        ownerId: 'bruno',
        name: 'Garrafa térmica 500 ml',
        description: 'Para levar nas trilhas.',
        price: 39.9,
        link: 'https://www.exemplo.com.br',
      },
    ],
  };
}

function load(): Db {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(KEY);
    memory = raw ? (JSON.parse(raw) as Db) : seed();
  } catch {
    memory = seed();
  }
  return memory;
}

function save(db: Db) {
  memory = db;
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* preview sem storage: segue em memória */
  }
}

const wait = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(v), 180));

function check(s: Session) {
  const db = load();
  if (!db.pins[s.participantId] || s.token !== `mock:${s.participantId}`) {
    throw new ApiError('Sessão expirada. Entre de novo com seu PIN.');
  }
  return db;
}

const validPin = (pin: string) => /^\d{4}$/.test(pin);

export const mockApi: Api = {
  async listParticipants() {
    const db = load();
    return wait(
      PEOPLE.map((p) => ({
        id: p.id,
        name: p.name,
        hasPin: Boolean(db.pins[p.id]),
        hasDrawn: db.drawn.includes(p.id),
      })),
    );
  },

  async createPin(id, pin) {
    const db = load();
    if (db.pins[id]) throw new ApiError('Este nome já tem PIN. Digite o PIN para entrar.');
    if (!validPin(pin)) throw new ApiError('O PIN precisa ter 4 números.');
    db.pins[id] = pin;
    save(db);
    return wait({ token: `mock:${id}`, participantId: id });
  },

  async login(id, pin) {
    const db = load();
    if (db.pins[id] !== pin) throw new ApiError('PIN incorreto. Tente de novo.');
    return wait({ token: `mock:${id}`, participantId: id });
  },

  async getMyDraw(s) {
    const db = check(s);
    return wait(db.drawn.includes(s.participantId) ? db.assignment[s.participantId] : null);
  },

  async draw(s) {
    const db = check(s);
    if (!db.drawn.includes(s.participantId)) db.drawn.push(s.participantId);
    save(db);
    return wait(db.assignment[s.participantId]);
  },

  async listGifts(s, ownerId) {
    return wait(check(s).gifts.filter((g) => g.ownerId === ownerId));
  },

  async saveGift(s, input) {
    const db = check(s);
    if (!input.name.trim()) throw new ApiError('Dê um nome para a sugestão.');
    const gift: Gift = {
      id: input.id ?? crypto.randomUUID(),
      ownerId: s.participantId,
      name: input.name.trim(),
      description: input.description.trim(),
      price: input.price,
      link: input.link.trim(),
    };
    const i = db.gifts.findIndex((g) => g.id === gift.id && g.ownerId === s.participantId);
    if (i >= 0) db.gifts[i] = gift;
    else db.gifts.push(gift);
    save(db);
    return wait(gift);
  },

  async deleteGift(s, giftId) {
    const db = check(s);
    db.gifts = db.gifts.filter((g) => !(g.id === giftId && g.ownerId === s.participantId));
    save(db);
    return wait(undefined);
  },

  async adminLogin(password) {
    if (password !== ADMIN_PASSWORD) throw new ApiError('Senha de administração incorreta.');
    return wait('mock-admin');
  },

  async adminResetPin(token, id) {
    if (token !== 'mock-admin') throw new ApiError('Sem permissão.');
    const db = load();
    delete db.pins[id];
    save(db);
    return wait(undefined);
  },

  async adminResetDraw(token) {
    if (token !== 'mock-admin') throw new ApiError('Sem permissão.');
    const db = load();
    db.assignment = derangement(PEOPLE.map((p) => p.id));
    db.drawn = [];
    save(db);
    return wait(undefined);
  },
};
