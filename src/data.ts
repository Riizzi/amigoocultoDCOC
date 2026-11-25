import type { ParticipantId } from './api/types';

export const PEOPLE: { id: ParticipantId; name: string; interest: string }[] = [
  { id: 'bruno', name: 'Bruno', interest: 'trilha' },
  { id: 'daiane', name: 'Daiane', interest: 'desenho' },
  { id: 'diego', name: 'Diego', interest: 'América' },
  { id: 'isabela', name: 'Isabela', interest: 'gatinha' },
  { id: 'joao', name: 'João', interest: 'pato' },
  { id: 'livia', name: 'Lívia', interest: 'globo com avião' },
  { id: 'marcia', name: 'Márcia', interest: 'netas' },
];

export const nameOf = (id: ParticipantId) =>
  PEOPLE.find((p) => p.id === id)?.name ?? id;

export const EVENT = {
  // 11/12/2026, 17h, horário de Brasília
  date: new Date('2026-12-11T17:00:00-03:00'),
  when: 'Sexta, 11 de dezembro, às 17h',
  where: 'Barzinho da CAMG',
  team: 'DCOC',
  priceCap: 50,
};

export const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
