const express = require("express");
const mongoose = require("mongoose");
const Maquina = require("./models/Maquina"); // ✅ caminho corrigido

const router = express.Router();

// CREATE → cria nova máquina
router.post("/", async (req, res) => {
  try {
    const { nome, tipo, status, ultimaManutencao, proximaManutencao } = req.body;
    const novaMaquina = await Maquina.create({ nome, tipo, status, ultimaManutencao, proximaManutencao });
    res.status(201).json(novaMaquina);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL → lista todas as máquinas
router.get("/", async (req, res) => {
  try {
    const maquinas = await Maquina.find();
    res.json(maquinas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE → busca máquina pelo ID
router.get("/:id", async (req, res) => {
  try {
    const maquina = await Maquina.findById(req.params.id);
    if (!maquina) return res.status(404).json({ mensagem: "Máquina não encontrada" });
    res.json(maquina);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE → atualiza máquina pelo ID
router.put("/:id", async (req, res) => {
  try {
    const { nome, tipo, status, ultimaManutencao, proximaManutencao } = req.body;
    const maquinaAtualizada = await Maquina.findByIdAndUpdate(
      req.params.id,
      { nome, tipo, status, ultimaManutencao, proximaManutencao },
      { new: true }
    );
    if (!maquinaAtualizada) return res.status(404).json({ mensagem: "Máquina não encontrada" });
    res.json(maquinaAtualizada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE → remove máquina pelo ID
router.delete("/:id", async (req, res) => {
  try {
    const maquinaDeletada = await Maquina.findByIdAndDelete(req.params.id);
    if (!maquinaDeletada) return res.status(404).json({ mensagem: "Máquina não encontrada" });
    res.json({ mensagem: "Máquina deletada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;