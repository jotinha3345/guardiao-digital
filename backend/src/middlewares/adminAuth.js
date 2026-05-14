const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

async function adminAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Token admin nao informado." });

    const payload = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    const admin = await prisma.admin.findUnique({ where: { id: payload.id } });
    if (!admin) return res.status(401).json({ message: "Administrador nao encontrado." });

    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ message: "Sessao admin invalida ou expirada." });
  }
}

module.exports = adminAuth;
