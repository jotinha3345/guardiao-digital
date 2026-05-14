const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

async function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Token nao informado." });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.status(401).json({ message: "Usuario nao encontrado." });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Sessao invalida ou expirada." });
  }
}

module.exports = auth;
