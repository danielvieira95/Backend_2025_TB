// Permitindo que o usuario digite informações

// cria uma variavel chamada readline
let readline = require('readline');
// Cria a interface de leitura
const rl = readline.createInterface({
    // pega a variavel de process para entrada stdin
    input:process.stdin,
    // pega a variavel de saida stdout
    output:process.stdout
});

// pergunta ao usuario
rl.question('Digite algo: ', (answer)=>{
    console.log(`Voce digitou ${answer}`);
    rl.close();
});
//console.log(readline);