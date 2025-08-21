 // Codigo api simples aula 20/08/2025

 // 1 importa o Express

 const express = require('express');

 // 2 Cria uma instancia do Express

 const app = express();

 // 3 Define a porta onde a API ira rodar
 const port = 3001;
 // Adiciona uma lista para armazenar  os dados de forma temporaria
 let dados =[];
 // 4 Middleware para permitir que o servidor lide com requisições no formato JSON
 app.use(express.json());
 // 5 Criação da rota get na raiz(/) que responde com uma mensagem simples
 // req - requisição
 // res de resposta 
 app.get('/',(req,res)=>{
    res.send('Api funcionando');
    
 });

 // cria uma segunda rota 
 app.get('/disciplina',(req,res)=>{
    
    res.send('Desenvolvimento Backend 2025 - Aula 03')
 });


 // rota post chamada data

 app.post('/data',(req,res)=>{
    const {nome,idade} = req.body;
    res.send(`Nome: ${nome},Idade ${idade}`);
    if(!nome || !idade){
        return res.status(400).json({error:'Informe nome e idade'})
    }
    const novo = {nome,idade};
    dados.push(novo);
    res.status(201).json({message:'Dados salvos com sucesso !',data:novo})
 });

 // Rota get para exibir os dados

 app.get('/data',(req,res)=>{
    res.json(dados);
 })
// 6 Inicia o servidor e define que ele deve rodar na porta especificada 3000
// app.listen inicia o servidor na porta desejada  declarada anteriormente
app.listen(port,()=>{
    console.log(`Servidor rodando na porta ${port}`);
})
