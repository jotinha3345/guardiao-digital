const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const denunciaRoutes = require("./routes/denuncias.routes");
const adminRoutes = require("./routes/admin.routes");
const materialRoutes = require("./routes/material.routes");
const quizRoutes = require("./routes/quiz.routes");

const app = express();
const frontendDist = path.resolve(__dirname, "../../frontend/dist");

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/health", (_req, res) => res.json({ ok: true, app: "Guardiao Digital API" }));
app.use("/auth", authRoutes);
app.use("/denuncias", denunciaRoutes);
app.use("/admin", adminRoutes);
app.use("/material", materialRoutes);
app.use("/quiz", quizRoutes);

app.use(express.static(frontendDist));
app.use((req, res, next) => {
  if (req.path.startsWith("/auth") || req.path.startsWith("/denuncias") || req.path.startsWith("/admin") || req.path.startsWith("/material") || req.path.startsWith("/quiz")) return next();
  if (!require("fs").existsSync(path.join(frontendDist, "index.html"))) return next();
  return res.sendFile(path.join(frontendDist, "index.html"));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(500).json({ message: err.message || "Erro interno do servidor." });
});

module.exports = app;
