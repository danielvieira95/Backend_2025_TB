// Exemplo 9 Armazenando informaçoes digitadas pelo usuario

let readline = require('readline'); // biblioteca que permite armazenar informações digitadas pelo usuario
// Cria uma interface de leitura
const rl = readline.createInterface({
    input:process.stdin, //process.stdin gerencia processo de entrada do node
    output:process.stdout // process.stdout gerencia processo de saida do node
});

// Pergunta ao usuario
rl.question('Digite algo: ',(answer)=>{
    // Resposta do usuario
    console.log(`Voce digitou ${answer}`);
    rl.close(); // fecha a caixa de pergunta
});

console.log(readline);