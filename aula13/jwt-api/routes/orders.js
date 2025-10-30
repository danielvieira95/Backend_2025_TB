 // rota para realizar pedidos

 const express = require("express");
 const {z} = require("zod");
 const auth = require("../middleware/auth");
 const Order = require("../models/Orders");
// importa o método router
 const router = express.Router();

 // Validação do body
 const createOrderSchema = z.object({
    items:z.array(
        z.object({
            productId: z.string().min(1),
            qtd: z.number().int().min(1)
        })
    ).min(1),
    notes: z.string().max(500).optional()
 });


 // Post /orders rota protegida
 router.post("/",auth,async(req,res) =>{
    try{
        const data = createOrderSchema.parse(req.body);
        const order = await Order.create({
            userId: req.user.id, // veio do middleware jwt
            itens: data.items,
            notes: data.notes
        });
        return res.status(201).json({message:"Pedido criado", order:{
            id: order._id,
            userId: order.userId,
            items: order.items,
            notes: order.notes,
            createdAt: order.createdAt
        }});
    }catch(err){
        if(err?.issues){
            return res.status(400).json({error: "Dados inválidos",details: err.issues});
        }
        return res.status(500).json({error: "Erro ao criar o pedido"});
    }
 });

 module.exports = router;