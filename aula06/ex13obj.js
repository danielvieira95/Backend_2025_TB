// Exemplo classe com construtor

class Pessoa{
    // cria construtor
    constructor(nome,idade){
        this.nome=nome;
        this.idade=idade;
    }
saudacao(){
    return `Olá ! Meu nome é ${this.nome}` ;
}
}

// Criar uma instancia da classe pessoa
let pessoa1 = new Pessoa("Rocky",3);
let pessoa2 = new Pessoa("Karina",46);

console.log(pessoa1.nome);
console.log(pessoa1.saudacao());