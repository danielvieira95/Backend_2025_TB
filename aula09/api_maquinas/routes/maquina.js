// Cria os metodos http para cadastrar, atualizar, deletar e listar as maquinas cadastradas

// importa as bibliotecas
const express = require("express"); // importa biblioteca express 
const mongoose = require("mongoose"); // importa biblioteca mongoose
const Maquina = require("../models/Maquina"); // importa a maquina da pasta models
const { error } = require("console");

const router = express.Router(); // pega a rota a partir da biblioteca da biblioteca Express

// Cria o método post
router.post("/",async(req,res)=>{
    try{
        const {nome,tipo,status,ultimaManutencao,proximaManutencao}=req.body; // armazena o corpo da requisição
        const novaMaquina = await Maquina.create({nome,tipo,status,ultimaManutencao,proximaManutencao});
        res.status(201).json(novaMaquina);
    }catch(err){
        res.status(400).json({error:err.message});
    }

});

// Cria o método get all - lista todas as máquinas cadastradas

router.get("/",async(req,res)=>{
    try{
        const maquinas= await Maquina.find();
        res.json(maquinas);

    }catch(err){
        res.status(500).json({error:err.message});
    }
});

// Cria o método get one - lista uma máquina especifica pelo id

router.get("/:id",async(req,res)=>{
    try{
        const maquina = await Maquina.findById(req.params.id);
        if(!maquina) return res.status(404).json({mensagem:"Máquina não encontrada"});
        res.json(maquina);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

// Cria o método put para modificar uma máquina existente
router.put("/:id",async(req,res)=>{
    try{
        const {nome,tipo,status,ultimaManutencao,proximaManutencao} = req.body;
        const maquinaAtualizada = await Maquina.findByIdAndUpdate(
            req.params.id,{nome,tipo,status,ultimaManutencao,proximaManutencao},{new:true}
        );
        if(!maquinaAtualizada) return res.status(404).json({message:"Máquina não encontrada"});
        res.json(maquinaAtualizada);
    }catch(err){
        res.status(404).json({error: err.message});
    }
});

// Cria o método delete
router.delete("/:id",async(req,res)=>{
    try{
        const maquinaDeletada = await Maquina.findByIdAndDelete(req.params.id);
        if(!maquinaDeletada) return res.status(404).json({mensagem:"Máquina não encontrada"});
        res.json({mensagem: "Máquina deletada com sucesso"});
    } catch(err){
        res.status(500).json({error:err.message});
    }
});

module.exports = router;