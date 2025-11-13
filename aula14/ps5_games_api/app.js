// codigo para criar a api

const express = require('express');
const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const gameRoutes = require('./routes/games');
const path = require('path')

const app = express();
mongoose.connect('urlmongo',{
    useNewUrlParser:true,useUnifiedTopology:true
}).then(()=>console.log('Mongodb conectado')).catch(err=>console.error('Erro ao conectar no mongo',err));

app.use(bodyParse.json());
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use('/api/games',gameRoutes);
const port = 3000;
app.listen(port,()=>{
    console.log(`Servidor rodando na porta ${port}`)
});


