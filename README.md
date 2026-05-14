# GUARDIÃO DIGITAL

Sistema full stack para apoiar comunidades na identificacao, denuncia e educacao contra golpes digitais.

## Stack

- Frontend: React, Vite, TailwindCSS, React Router, Axios, Lucide React
- Backend: Node.js, Express, JWT, Multer
- Banco: PostgreSQL
- ORM: Prisma

## Como executar

1. Crie um banco PostgreSQL chamado `guardiao_digital`.
2. Ajuste `backend/.env` se seu usuario, senha ou porta do PostgreSQL forem diferentes.
3. Instale dependencias:

```bash
cd backend
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:3333`

## Admin inicial

- E-mail: `admin@guardiao.digital`
- Senha: `admin123`

## Rotas principais

- `/auth/register`, `/auth/login`, `/auth/me`
- `/denuncias/create`, `/denuncias/list`, `/denuncias/search`, `/denuncias/:id`
- `/admin/login`, `/admin/denuncias`, `/admin/aprovar`, `/admin/rejeitar`
- `/material/list`, `/material/:id`
- `/quiz/list`, `/quiz/submit`
