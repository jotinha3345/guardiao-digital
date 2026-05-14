const { Router } = require("express");
const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");
const adminAuth = require("../middlewares/adminAuth");
const { signAdmin } = require("../utils/tokens");

const router = Router();

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return res.status(401).json({ message: "Credenciais admin invalidas." });

  const valid = await bcrypt.compare(senha, admin.senha);
  if (!valid) return res.status(401).json({ message: "Credenciais admin invalidas." });

  return res.json({ token: signAdmin(admin), admin: { id: admin.id, nome: admin.nome, email: admin.email } });
});

router.get("/dashboard", adminAuth, async (_req, res) => {
  const [total, pendentes, aprovadas, cidades, tipos] = await Promise.all([
    prisma.denuncia.count(),
    prisma.denuncia.count({ where: { status: "pendente" } }),
    prisma.denuncia.count({ where: { status: "aprovado" } }),
    prisma.denuncia.groupBy({ by: ["cidade"], _count: { cidade: true }, orderBy: { _count: { cidade: "desc" } }, take: 8 }),
    prisma.denuncia.groupBy({ by: ["tipoGolpe"], _count: { tipoGolpe: true }, orderBy: { _count: { tipoGolpe: "desc" } }, take: 8 }),
  ]);
  return res.json({ total, pendentes, aprovadas, cidadesAfetadas: cidades.length, cidades, tipos });
});

router.get("/denuncias", adminAuth, async (_req, res) => {
  const denuncias = await prisma.denuncia.findMany({ orderBy: { createdAt: "desc" }, include: { usuario: { select: { nome: true, email: true } } } });
  return res.json(denuncias);
});

router.patch("/denuncias/:id", adminAuth, async (req, res) => {
  const allowed = ["tipoGolpe", "descricao", "numeroSuspeito", "linkSuspeito", "nomeSuspeito", "cidade"];
  const data = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const denuncia = await prisma.denuncia.update({ where: { id: req.params.id }, data });
  return res.json(denuncia);
});

router.post("/aprovar", adminAuth, async (req, res) => {
  const denuncia = await prisma.denuncia.update({ where: { id: req.body.id }, data: { status: "aprovado" } });
  return res.json(denuncia);
});

router.post("/rejeitar", adminAuth, async (req, res) => {
  const denuncia = await prisma.denuncia.update({ where: { id: req.body.id }, data: { status: "rejeitado" } });
  return res.json(denuncia);
});

module.exports = router;
