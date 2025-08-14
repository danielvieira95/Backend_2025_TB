 // Exemplo 2 capturando dados digitados pelo usuario

 const readline = require('readline'); // cria constante para armazenar a biblioteca  readline
 // Cria a interface para permitir  que usuario digite informações
 const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
 });

 // Pergunta o primeiro valor

 rl.question('Digite o primeiro valor: ',(valor1)=>{
    rl.question('Digite o segundo valor:', (valor2)=>{
        console.log('Primeiro valor:',valor1);
        console.log('Segundo valor:',valor2);
        console.log(valor1+valor2);
        console.log(Number(valor1)+Number(valor2)); // Com number converte para numero
       rl.close(); // fecha a interface de input de dados
    });

 });