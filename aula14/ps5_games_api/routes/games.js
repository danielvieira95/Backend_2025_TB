// Código para cadastrar os jogos

const express = require('express'); // Biblioteca para criar o servidor
const mongoose = require('mongoose'); // Biblioteca para acessar o banco de dados
const multer =require('multer'); // biblioteca para criar a estrutura para salvar a foto
const Game = require('../models/Game'); // importa o game do models
const router = express.Router(); // cria a variavel router para gerenciar as rotas

// Configuração do caminho para upload das imagens
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads/');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+'-'+file.originalname); // código para salvar a imagem no caminho desejado uploads

    }
});


const upload = multer({storage:storage});



// Rota para cadastrar um novo jogo


router.post('/',upload.single('image'),async(req,res)=>{
    try{

        const {name,value,year,rating} = req.body;
        const image = req.file.path; // pega o caminho da imagem
        const newGame = new Game({
            name,value,year,rating,image
        });
        await newGame.save();
        console.log(`req: ${req.body}`);
        console.log(`file: ${req.file}`);
        res.status(201).json({message: 'Jogo cadastrado com sucesso'});
    }catch(error){
        res.status(500).json({message:'Erro ao cadastrar o jogo',error})
    }

});

// Rota para listar o jogo

router.get('/',async(req,res)=>{
    try{
        const games = await Game.find();
        res.status(200).json(games);
    }catch(error){
        res.status(500).json({message:'Erro ao buscar os jogos',error});
    }
});

module.exports = router;
