const express = require("express");
const { z } = require("zod");
const auth = require("../middleware/auth");
const Order = require("../models/Orders");

const router = express.Router();

// validação do body
const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      qty: z.number().int().min(1)
    })
  ).min(1),
  notes: z.string().max(500).optional()
});

// POST /orders  (PROTEGIDA)
router.post("/", auth, async (req, res) => {
  try {
    const data = createOrderSchema.parse(req.body);

    const order = await Order.create({
      userId: req.user.id, // veio do middleware auth (payload do JWT)
      items: data.items,
      notes: data.notes
    });

    return res.status(201).json({
      message: "Pedido criado",
      order: {
        id: order._id,
        userId: order.userId,
        items: order.items,
        notes: order.notes,
        createdAt: order.createdAt
      }
    });
  } catch (err) {
    if (err?.issues) {
      return res.status(400).json({ error: "Dados inválidos", details: err.issues });
    }
    return res.status(500).json({ error: "Erro ao criar pedido" });
  }
});

module.exports = router;
