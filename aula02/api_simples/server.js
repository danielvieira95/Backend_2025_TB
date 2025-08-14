// cria variavel para armazenar o express
const express = require('express');

// cria uma instancia do express
const app = express();

// Define a porta que vai rodar a api
const porta = 3000;
//Lista os dados para armazenar os dados cadastrados

// Middleware para processar a resposta no formato json
app.use(express.json);

// cria a rota na raiz da api

app.get('/',(req,res)=>{
    res.send('Api funcionando');
});

// Inicia o servidor e a porta

app.listen(porta,()=>{
    console.log(`Api executando na porta ${porta}`);
})