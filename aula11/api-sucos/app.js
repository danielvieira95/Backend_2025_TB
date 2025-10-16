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
    quantidade INTEGER NOT NULL,
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
    const suco = db.prepare("SELECT * FROM sucos WHERE id = ?").get(info.lastInsertRowid);
    return res.status(201).json(suco);
   }catch(e){
    if(String(e).includes("UNIQUE")){
        return res.status(409).json({erro: "Suco já cadastrado (nome deve ser único)"});
    }
    return res.status(500).json({error: "Erro ao cadastrar suco"})
   }

});


// Rota Get para exibir os sucos cadastrados
app.get("/cadastro-suco",(_req,res) =>{
    const sucos = db.prepare("SELECT * FROM sucos ORDER BY nome").all();
    return res.json(sucos);
})

// Criando rota para os pedidos

// Post cria um pedido (status iniciado)

app.post("/pedidos",(req,res)=>{
    const parse = PedidoCreateSchema.safeParse(req.body);
    if(!parse.success){
        return res.status(400).json({erro: parse.error});
    }

    let {suco_id,sabor,quantidade} = parse.data;

    // Permite criar pelo nome do suco

    if(!suco_id && sabor){
        const suco = db.prepare("SELECT id FROM sucos WHERE LOWER(nome) = LOWER(?)").get(sabor.trim());
        if(!suco){
            return res.status(404).json({erro: "Sabor não encontrado ! Cadastre o suco primeiro !"});
        }
        suco_id = suco.id;
    }

    if(!suco_id){
        return res.status(400).json({erro: "Informe 'suco_id' ou 'sabor' "});
    }

    if(suco_id){
        const sucoExiste = db.prepare("SELECT id FROM sucos WHERE id =?").get(suco_id);
        if(!sucoExiste){
            return res.status(404).json({erro: "Suco não encontrado !"});
        }
   const now = new Date().toISOString(); // cria a data do pedido
   const stmt = db.prepare(`INSERT INTO pedidos(suco_id, quantidade, status,criado_em,atualizado_em) 
    VALUES (?,?,'iniciado',?,?)
    `);

    const info = stmt.run(suco_id,quantidade,now,now);
    const pedido = db.prepare(`
        SELECT p.id, p.quantidade, p.status, p.criado_em, p.atualizado_em,
        s.id AS suco_id, s.nome AS sabor, s.preco FROM pedidos p
        JOIN sucos s ON s.id = p.suco_id
        WHERE p.id =?    
        `).get(info.lastInsertRowid);
        return res.status(201).json((pedido));
    }
});


// PATCH rota para atualizar o pedido - rota de produção
// ordem-producao/:id -> altera o status do pedido (em processamento, pronto, iniciado)
app.patch("/ordem-producao/:id",(req,res)=>{
    const {id} = req.params;
    const parse= PedidosStatusSchema.safeParse(req.body);
    if(!parse.success){
        return res.status(400).json({erro: parse.error});
    }
    const {status } = parse.data;

    const pedido = db.prepare("SELECT * FROM pedidos WHERE id =?").get(id);
    if(!pedido){
        return res.status(404).json({erro: 'Pedido não encontrado !'});
    }

    const now = new Date().toISOString();
    const upd = db.prepare("UPDATE pedidos SET status =?, atualizado_em = ? WHERE id = ?");
    upd.run(status,now,id);


    const atualizado = db.prepare(`
        SELECT p.id, p.quantidade, p.status, p.criado_em, p.atualizado_em,
        s.id AS suco_id, s.nome AS sabor, s.preco
        FROM pedidos p
        JOIN sucos s ON s.id = p.suco_id
        WHERE p.id = ?
        `).get(id);

        return res.json(atualizado);
});


// Rota para listar os pedidos
// GET /listar-pedidos -> por padrão lista os produtos em andamento (status != pronto)

app.get("/listar-pedidos",(req,res)=>{
    const {status} = req.query;

    let rows;

    if(status){
        if(!["iniciado","em_processamento","pronto"].includes(String(status))){
            return res.status(400).json({erro: "status inválido"});
        }
        rows = db.prepare(`
            SELECT p.id, p.quantidade, p.status, p.criado_em, p.atualizado_em,
            s.id AS suco_id, s.nome AS sabor, s.preco
            FROM pedidos p
            JOIN sucos s ON s.id = p.suco_id
            WHERE p.status = ?
            ORDER BY p.criado_em DESC            
            `).all(status);
    }else{
        rows =  db.prepare(`
            SELECT p.id, p.quantidade, p.status, p.criado_em, p.atualizado_em,
            s.id AS suco_id, s.nome AS sabor, s.preco
            FROM pedidos p
            JOIN sucos s ON s.id = p.suco_id
            WHERE p.status != 'pronto'
            ORDER BY p.criado_em DESC            
            `).all();
    }
    return res.json(rows);
})



app.get("/",(_req,res)=> res.send("API Sucos OK !"));

// Start
const PORT = process.env.PORT|| 3000;
app.listen(PORT,()=>{
    console.log(`API rodando em http://localhost:${PORT}`);
});

