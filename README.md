# GUARDIAO DIGITAL

Aplicacao full stack para apoiar comunidades na identificacao, denuncia e educacao contra golpes digitais.

O projeto foi desenvolvido para uma atividade academica da disciplina Sistemas de Informacao e Sociedade, com foco em impacto social, seguranca da informacao, participacao comunitaria e uso pratico de tecnologia.

## Funcionalidades

- Autenticacao de usuarios com JWT
- Cadastro, login e recuperacao de senha mock
- Dashboard comunitario com estatisticas e alertas
- Fluxo completo de denuncia de golpes com upload de imagem
- Consulta publica por numero, link ou palavra-chave
- Area educacional com materiais preventivos
- Quiz interativo anti-golpe com pontuacao e nivel
- Tela de emergencia para vitimas de golpe
- Painel administrativo para aprovar, rejeitar e visualizar denuncias

## Stack

- Frontend: React, Vite, TailwindCSS, React Router, Axios, Lucide React
- Backend: Node.js, Express, JWT Authentication, Multer
- Banco de dados: PostgreSQL
- ORM: Prisma

## Estrutura

```txt
guardiao-digital/
  frontend/
  backend/
```

## Como Executar

Crie um banco PostgreSQL chamado `guardiao_digital`.

Configure o arquivo `backend/.env` com base em `backend/.env.example`.

Backend:

```bash
cd backend
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

URLs locais:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3333`

## Admin Inicial

```txt
email: admin@guardiao.digital
senha: admin123
```

## Endpoints

- `/auth/register`
- `/auth/login`
- `/auth/me`
- `/denuncias/create`
- `/denuncias/list`
- `/denuncias/search`
- `/denuncias/:id`
- `/admin/login`
- `/admin/denuncias`
- `/admin/aprovar`
- `/admin/rejeitar`
- `/material/list`
- `/material/:id`
- `/quiz/list`
- `/quiz/submit`
