export type ParticipantId =
  | 'bruno'
  | 'daiane'
  | 'diego'
  | 'isabela'
  | 'joao'
  | 'livia'
  | 'marcia';

export interface Participant {
  id: ParticipantId;
  name: string;
  hasPin: boolean;
  hasDrawn: boolean;
}

export interface Gift {
  id: string;
  ownerId: ParticipantId;
  name: string;
  description: string;
  /** Valor em reais; null quando a pessoa não informou. */
  price: number | null;
  link: string;
}

export type GiftInput = Omit<Gift, 'id' | 'ownerId'> & { id?: string };

export interface Session {
  token: string;
  participantId: ParticipantId;
}

export class ApiError extends Error {}

/**
 * Contrato único entre telas e dados. O preview usa a versão simulada
 * (mock.ts); no deploy, a versão http.ts fala com as funções /api da Vercel.
 */
export interface Api {
  listParticipants(): Promise<Participant[]>;
  createPin(id: ParticipantId, pin: string): Promise<Session>;
  login(id: ParticipantId, pin: string): Promise<Session>;
  getMyDraw(s: Session): Promise<ParticipantId | null>;
  draw(s: Session): Promise<ParticipantId>;
  listGifts(s: Session, ownerId: ParticipantId): Promise<Gift[]>;
  saveGift(s: Session, gift: GiftInput): Promise<Gift>;
  deleteGift(s: Session, giftId: string): Promise<void>;
  adminLogin(password: string): Promise<string>;
  adminResetPin(adminToken: string, id: ParticipantId): Promise<void>;
  adminResetDraw(adminToken: string): Promise<void>;
}
