const { Router } = require("express");
const { z } = require("zod");
const prisma = require("../config/prisma");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");

const router = Router();

const denunciaSchema = z.object({
  tipoGolpe: z.string().min(2),
  descricao: z.string().min(20),
  numeroSuspeito: z.string().optional().nullable(),
  linkSuspeito: z.string().optional().nullable(),
  nomeSuspeito: z.string().optional().nullable(),
});

function riskLevel(count) {
  if (count >= 10) return "alto risco";
  if (count >= 3) return "atencao";
  return "baixo risco";
}

router.post("/create", auth, upload.single("imagem"), async (req, res) => {
  const parsed = denunciaSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Dados invalidos.", errors: parsed.error.flatten() });

  const denuncia = await prisma.denuncia.create({
    data: {
      ...parsed.data,
      imagem: req.file ? `/uploads/${req.file.filename}` : null,
      cidade: req.user.cidade,
      usuarioId: req.user.id,
    },
  });

  return res.status(201).json(denuncia);
});

router.get("/list", async (_req, res) => {
  const denuncias = await prisma.denuncia.findMany({
    where: { status: "aprovado" },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, tipoGolpe: true, descricao: true, cidade: true, createdAt: true, numeroSuspeito: true, linkSuspeito: true, nomeSuspeito: true },
  });
  return res.json(denuncias);
});

router.get("/search", async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json({ query: q, total: 0, nivelRisco: "baixo risco", resultados: [] });

  const resultados = await prisma.denuncia.findMany({
    where: {
      status: "aprovado",
      OR: [
        { numeroSuspeito: { contains: q, mode: "insensitive" } },
        { linkSuspeito: { contains: q, mode: "insensitive" } },
        { nomeSuspeito: { contains: q, mode: "insensitive" } },
        { descricao: { contains: q, mode: "insensitive" } },
        { tipoGolpe: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return res.json({ query: q, total: resultados.length, nivelRisco: riskLevel(resultados.length), resultados });
});

router.get("/stats", async (_req, res) => {
  const [total, pendentes, aprovadas, recentes, tipos] = await Promise.all([
    prisma.denuncia.count(),
    prisma.denuncia.count({ where: { status: "pendente" } }),
    prisma.denuncia.count({ where: { status: "aprovado" } }),
    prisma.denuncia.findMany({ where: { status: "aprovado" }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.denuncia.groupBy({ by: ["tipoGolpe"], _count: { tipoGolpe: true }, orderBy: { _count: { tipoGolpe: "desc" } }, take: 5 }),
  ]);
  return res.json({ total, pendentes, aprovadas, recentes, tipos });
});

router.get("/:id", async (req, res) => {
  const denuncia = await prisma.denuncia.findUnique({ where: { id: req.params.id } });
  if (!denuncia || denuncia.status !== "aprovado") return res.status(404).json({ message: "Denuncia nao encontrada." });
  return res.json(denuncia);
});

module.exports = router;
