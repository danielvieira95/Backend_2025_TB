 // Codigo api simples aula 20/08/2025

 // 1 importa o Express

 const express = require('express');

 // 2 Cria uma instancia do Express

 const app = express();

 // 3 Define a porta onde a API ira rodar
 const port = 3000;

 // 4 Middleware para permitir que o servidor lide com requisições no formato JSON
 app.use(express.json());
 // 5 Criação da rota get na raiz(/) que responde com uma mensagem simples
 // req - requisição
 // res de resposta 
 app.get('/',(req,res)=>{
    res.send('Api funcionando');
 });


// 6 Inicia o servidor e define que ele deve rodar na porta especificada 3000
// app.listen inicia o servidor na porta desejada  declarada anteriormente
app.listen(port,()=>{
    console.log(`Servidor rodando na porta ${port}`);
})
