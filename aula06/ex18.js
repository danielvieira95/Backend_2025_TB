const readline = require('readline'); // cria uma constante para armazenar o valor
 // cria a interface para permitir que o usuario digite os valores no terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Pergunta para o primeiro valor
rl.question('Digite o primeiro valor: ', (valor1) => {
    // Pergunta para o segundo valor
    rl.question('Digite o segundo valor: ', (valor2) => {
        // Exibe os valores digitados
        console.log('Primeiro valor:', valor1);
        console.log('Segundo valor:', valor2);
        console.log(valor1 + valor2);
        console.log(Number(valor1)+Number(valor2));

        // Fecha a interface de leitura
        rl.close();
    });
});