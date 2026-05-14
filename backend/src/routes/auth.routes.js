const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const prisma = require("../config/prisma");
const auth = require("../middlewares/auth");
const { signUser } = require("../utils/tokens");

const router = Router();

const registerSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
  cidade: z.string().min(2),
  telefone: z.string().optional().nullable(),
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Dados invalidos.", errors: parsed.error.flatten() });

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return res.status(409).json({ message: "E-mail ja cadastrado." });

  const senha = await bcrypt.hash(parsed.data.senha, 10);
  const user = await prisma.user.create({ data: { ...parsed.data, senha } });
  const token = signUser(user);

  return res.status(201).json({ token, user: { id: user.id, nome: user.nome, email: user.email, cidade: user.cidade } });
});

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Credenciais invalidas." });

  const valid = await bcrypt.compare(senha, user.senha);
  if (!valid) return res.status(401).json({ message: "Credenciais invalidas." });

  return res.json({ token: signUser(user), user: { id: user.id, nome: user.nome, email: user.email, cidade: user.cidade } });
});

router.get("/me", auth, (req, res) => {
  const { id, nome, email, cidade, telefone } = req.user;
  return res.json({ id, nome, email, cidade, telefone });
});

router.post("/recover", (_req, res) => {
  return res.json({ message: "Se o e-mail existir, enviaremos instrucoes de recuperacao. Mock academico." });
});

module.exports = router;
