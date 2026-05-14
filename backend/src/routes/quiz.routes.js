const { Router } = require("express");
const prisma = require("../config/prisma");
const auth = require("../middlewares/auth");

const router = Router();

function getNivel(score, total) {
  const pct = total ? score / total : 0;
  if (pct >= 0.8) return "especialista digital";
  if (pct >= 0.5) return "atento";
  return "iniciante";
}

async function gradeQuiz(req, res, usuarioId = null) {
  const respostas = Array.isArray(req.body.respostas) ? req.body.respostas : [];
  const perguntas = await prisma.quizPergunta.findMany();
  let pontuacao = 0;

  const detalhes = perguntas.map((pergunta) => {
    const resposta = respostas.find((item) => item.id === pergunta.id)?.resposta;
    const correta = resposta === pergunta.respostaCorreta;
    if (correta) pontuacao += 1;
    return { id: pergunta.id, pergunta: pergunta.pergunta, resposta, respostaCorreta: pergunta.respostaCorreta, correta, explicacao: pergunta.explicacao };
  });

  const nivel = getNivel(pontuacao, perguntas.length);
  if (usuarioId) await prisma.quizResultado.create({ data: { usuarioId, pontuacao, nivel } });
  return res.json({ pontuacao, total: perguntas.length, nivel, detalhes });
}

router.get("/list", async (_req, res) => {
  const perguntas = await prisma.quizPergunta.findMany({ orderBy: { createdAt: "asc" } });
  return res.json(perguntas.map(({ respostaCorreta, ...pergunta }) => pergunta));
});

router.post("/submit", async (req, res) => {
  return gradeQuiz(req, res);
});

router.post("/submit-auth", auth, async (req, res) => {
  return gradeQuiz(req, res, req.user.id);
});

module.exports = router;
