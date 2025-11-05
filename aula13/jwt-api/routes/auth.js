const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

/* ===========================
   Schemas de validação (com trim/normalize)
=========================== */
const registerSchema = z.object({
  name: z.string().min(2).trim(),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6)
});

/* ===========================
   Função para gerar token
=========================== */
function signToken(user) {
  if (!process.env.JWT_SECRETS) {
    throw new Error("JWT_SECRET não definido nas variáveis de ambiente");
  }
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, name: user.name },
    process.env.JWT_SECRETS,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

/* ===========================
   POST /auth/register
=========================== */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: "Email já cadastrado" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      passwordHash
    });

    const token = signToken(user);

    return res.status(201).json({
      message: "Usuário registrado com sucesso",
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    if (err?.issues) {
      return res.status(400).json({ error: "Dados inválidos", details: err.issues });
    }
    return res.status(500).json({ error: "Erro ao registrar", details: err.message });
  }
});

/* ===========================
   POST /auth/login
=========================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Se no schema do User o passwordHash tiver select:false, isto garante o campo:
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = signToken(user);

    return res.json({
      message: "Login realizado",
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    if (err?.issues) {
      return res.status(400).json({ error: "Dados inválidos", details: err.issues });
    }
    return res.status(500).json({ error: "Erro no login", details: err.message });
  }
});

/* ===========================
   GET /auth/me (rota protegida)
=========================== */
router.get("/me", auth, async (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
