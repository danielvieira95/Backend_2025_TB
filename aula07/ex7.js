 // exemplo 7 capturando informaçoes digitadas pelo usuario

 readline = require('readline'); 
 // cria interface de leitura
 const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
 });

 // Cria array para armazenar o historico das respostas
 let historico=[];
 // função que pergunta em loop
 function perguntar(){
    rl.question('Digite algo ou sair para encerrar)',(resposta)=>{
        if(resposta.toLowerCase()=='sair'){
            console.log('Programa encerrado');
            console.log('Historico de entradas');
            historico.forEach((item,i)=>{
                console.log(`${i+1}: ${item}`);
            });
            rl.close();


        }else{
            historico.push(resposta); // salva a resposta no historico
            console.log(`Você digitou ${resposta}`);
            perguntar(); // reinicia o loop
        }
    })
 }

 // inicia o loop
 perguntar();