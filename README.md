# Amigo oculto DCOC

App do amigo oculto da equipe DCOC (troca em 11/12, às 17h, no Barzinho da CAMG).
Cada pessoa entra pelo próprio nome com um PIN de 4 números, sorteia o amigo oculto e cadastra sugestões de presente de até R$ 50.

*Secret Santa web app for a 7-person team: per-person PIN login, a server-side draw where nobody gets themselves and nobody is drawn twice, and gift wish lists. React + TypeScript (Vite) with Vercel Functions and Postgres (Neon).*

## Como funciona

- **Sorteio:** o servidor gera os pares uma única vez, em segredo. Ninguém tira a si mesmo e cada pessoa é tirada por uma única outra (pares recíprocos podem acontecer). Ao tocar em "Sortear", a pessoa só revela o par dela. Os pares nunca saem do servidor para quem não é o dono.
- **Ordem de uso:** "Minha lista" e "Ver listas" só liberam depois do sorteio.
- **PIN:** guardado com hash (scrypt). Depois de 5 erros seguidos, o nome fica bloqueado por 10 minutos.
- **Admin:** abra o site com `#admin` no fim do endereço. Ali dá para zerar o PIN de alguém (a sessão antiga cai) e refazer o sorteio. O painel não mostra os pares.

## Estrutura

```
api/            funções da Vercel (participants, pin, draw, gifts, admin) + _lib.ts (banco, PIN, sessões)
src/            app React
  api/          contrato (types.ts), cliente real (http.ts) e simulado (mock.ts)
  screens/      Home, PIN, Perfil (Sortear, Minha lista, Ver listas), Admin
  components/   etiquetas, ícones, enfeites, neve
  patterns.css  estampas dos cartões (gerado por scripts/patterns.py)
```

O banco cria as tabelas sozinho no primeiro acesso. Não precisa rodar SQL.

## Publicar na Vercel

1. Na Vercel, **Add New → Project** e importe este repositório. O preset **Vite** é detectado sozinho; não mude nada.
2. Antes ou depois do primeiro deploy, vá em **Storage → Create Database → Neon** (plano gratuito) e conecte ao projeto. Isso cria a variável `DATABASE_URL`.
3. (Opcional) Em **Settings → Environment Variables**, crie `ADMIN_PASSWORD` para trocar a senha do admin (padrão: `admin`).
4. Faça **Redeploy** para o deploy enxergar as variáveis.

## Rodar no computador

```bash
npm install
npm run dev            # app com dados simulados no navegador (sem banco)
npm run build:preview  # gera dist-preview/index.html, um arquivo único para preview
npm run typecheck      # confere os tipos do app e das funções
```

Para testar com o banco real, use `npx vercel dev` com a `DATABASE_URL` no `.env`.
