const { Router } = require("express");
const prisma = require("../config/prisma");

const router = Router();

router.get("/list", async (_req, res) => {
  const materiais = await prisma.materialEducativo.findMany({ orderBy: { titulo: "asc" } });
  return res.json(materiais);
});

router.get("/:id", async (req, res) => {
  const material = await prisma.materialEducativo.findFirst({ where: { OR: [{ id: req.params.id }, { slug: req.params.id }] } });
  if (!material) return res.status(404).json({ message: "Material nao encontrado." });
  return res.json(material);
});

module.exports = router;
