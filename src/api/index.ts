import { httpApi } from './http';
import { mockApi } from './mock';
import type { Api } from './types';

// "npm run dev" e o preview usam dados simulados (modo mock); o deploy usa as funções /api.
export const api: Api = import.meta.env.MODE === 'mock' ? mockApi : httpApi;
export * from './types';
