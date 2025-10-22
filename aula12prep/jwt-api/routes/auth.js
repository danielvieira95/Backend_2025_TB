const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Schemas de validação
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

function signToken(user) {
  // sub = subject (id do usuário)
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email já cadastrado" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });

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
    return res.status(500).json({ error: "Erro ao registrar" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });

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
    return res.status(500).json({ error: "Erro no login" });
  }
});

// GET /auth/me (protegida)
router.get("/me", auth, async (req, res) => {
  // req.user foi preenchido pelo middleware auth
  return res.json({ user: req.user });
});

module.exports = router;
