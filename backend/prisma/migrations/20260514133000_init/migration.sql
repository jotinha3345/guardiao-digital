CREATE TYPE "DenunciaStatus" AS ENUM ('pendente', 'aprovado', 'rejeitado');

CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "senha" TEXT NOT NULL,
  "cidade" TEXT NOT NULL,
  "telefone" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "admins" (
  "id" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "senha" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "denuncias" (
  "id" TEXT NOT NULL,
  "tipo_golpe" TEXT NOT NULL,
  "descricao" TEXT NOT NULL,
  "numero_suspeito" TEXT,
  "link_suspeito" TEXT,
  "nome_suspeito" TEXT,
  "imagem" TEXT,
  "cidade" TEXT NOT NULL,
  "usuario_id" TEXT NOT NULL,
  "status" "DenunciaStatus" NOT NULL DEFAULT 'pendente',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "denuncias_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "materiais_educativos" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "titulo" TEXT NOT NULL,
  "resumo" TEXT NOT NULL,
  "conteudo" TEXT NOT NULL,
  "categoria" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "materiais_educativos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "quiz_perguntas" (
  "id" TEXT NOT NULL,
  "pergunta" TEXT NOT NULL,
  "resposta_correta" TEXT NOT NULL,
  "explicacao" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "quiz_perguntas_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "quiz_resultados" (
  "id" TEXT NOT NULL,
  "usuario_id" TEXT,
  "pontuacao" INTEGER NOT NULL,
  "nivel" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "quiz_resultados_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");
CREATE UNIQUE INDEX "materiais_educativos_slug_key" ON "materiais_educativos"("slug");
CREATE INDEX "denuncias_status_idx" ON "denuncias"("status");
CREATE INDEX "denuncias_tipo_golpe_idx" ON "denuncias"("tipo_golpe");
CREATE INDEX "denuncias_cidade_idx" ON "denuncias"("cidade");

ALTER TABLE "denuncias" ADD CONSTRAINT "denuncias_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "quiz_resultados" ADD CONSTRAINT "quiz_resultados_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
