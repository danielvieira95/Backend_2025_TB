// exemplo herança

class Animal{
    constructor(){
        this.nome=null;
        this.idade = null;

   }
   // Metodo da classe base
   fazerSom(){
    console.log(`${this.nome} faz um som`)
   }
}

// Cria classe filha
class Cachorro extends Animal{
    constructor(){
        super();
        this.raca = null;

    }
    // polimorfismo
    fazerSom(){
        console.log(`${this.nome} um ${this.raca} late`);

    }
    //  exibe info
    exibeinfo(){
        console.log(`Nome: ${this.nome}, Idade: ${this.idade}, Raça: ${this.raca}`)
    }
}

// Cria a classe animal
class Gato extends Animal{
    constructor(nome){
        super(nome); // herda o parametro nome da classe animal

    }

    fazerSom(){
        console.log(`${this.nome} mia Miau !`)
    }

}

// classe  Tigre
class Tigre extends Animal{
    constructor(){
        super();
        this.cor=null;

    }

    fazerSom(){
        console.log(`Tigre ${this.nome} Aaar !`);
    }

    //  exibe info
    exibeinfo(){
        console.log(`Nome: ${this.nome}, Idade: ${this.idade}, Cor: ${this.cor}`)
    }
}
// instancia o objeto Rocky da classe cachorro
Rocky = new Cachorro();
Rocky.nome="Rocky";
Rocky.idade=3;
Rocky.raca="Amstaff";
Rocky.exibeinfo();
Rocky.fazerSom();

// Instancia o objeto Garfield da classe Gato
Garfield = new Gato();
Garfield.nome="Garfield";
Garfield.idade=3;
Garfield.fazerSom()

// Instancia o Tigre
Memphis = new Tigre();
Memphis.nome='Memphis';
Memphis.idade=30;
Memphis.cor='Branco';
Memphis.exibeinfo();
