// Codigo API Sucos
// Biblioteca para criar o servidor
const express = require("express");
const Database = require("better-sqlite3") ; // biblioteca para comunicar com o banco de dados
const helmet = require("helmet"); // biblioteca para segurança
const morgan = require("morgan"); // biblioteca para registrar logs
const {z} = require("zod"); // biblioteca para validar dados


const app = express() ; // armazena o servidor em app
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));


// Banco de dados SQLITE
const db = new Database("./sucos.db");

// Criação das tabelas
db.exec(`
    CREATE TABLE IF NOT EXISTS sucos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    preco REAL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS pedidos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    suco_id INTEGER NOT NULL,
    quantidade: INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('iniciado','em_processamento','pronto')),
    criado_em TEXT NOT NULL,
    atualizado_em TEXT NOT NULL,
    FOREIGN KEY (suco_id) REFERENCES sucos(id)
    );`);


// Schemas validação
const SucoCreateSchema = z.object({
    nome: z.string().min(1,"nome é obrigatório"),
    preco: z.number().nonnegative().optional()
});

const PedidoCreateSchema = z.object({
    suco_id: z.number().int().positive().optional(),
    sabor: z.string().min(1).optional(), // permite criar o nome do suco
    quantidade: z.number().int().positive()
});

const PedidosStatusSchema = z.object({
    status: z.enum(["iniciado","em_processamento","pronto"])
});



// Rotas

// Post para cadastrar o sabor do suco /cadastro-suco

app.post("/cadastro-suco",(req,res)=>{
    const parse = SucoCreateSchema.safeParse(req.body);
    if(!parse.success){
        return res.status(400).json({erro: parse.error});
    }
    const {nome,preco=0} = parse.data;

   try{
    const stmt = db.prepare("INSERT INTO sucos (nome,preco) VALUES(?,?)"); // prepara os campos para receber os dados
    const info = stmt.run(nome.trim(),preco);
    const suco =db.prepare("SELECT *FROM sucos WHERE id = ?").get(info.lastInsertRowid);
    return res.status(201).json(suco);
   }catch(e){
    if(String(e).includes("UNIQUE")){
        return res.status(409).json({erro: "Suco já cadastrado (nome deve ser único)"});
    }
    return res.status(500).json({error: "Erro ao cadastrar suco"})
   }

});






