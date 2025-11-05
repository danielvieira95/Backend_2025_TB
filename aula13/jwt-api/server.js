// arquivo principal da nossa api

require("dotenv").config(); // biblioteca para pegar as variaveis do arquivo .env
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors =  require("cors");
const {connectDB} = require("./db");

const app = express(); 
const auth = require("./middleware/auth"); 
// middlewares globais
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// rotas

app.get("/",(req,res)=>res.json({status:"ok"}));
app.use("/auth",require("./routes/auth"));
app.use("/orders",require("./routes/orders"))

// inicia o servidor
const PORT = process.env.PORT || 3000;
connectDB(process.env.MONGO_URI).then(()=>{app.listen(PORT,()=>console.log(`API rodando em http://localhost:${PORT}`));
}).catch((err)=>{
    console.error("Erro ao conectar ao MongoDB",err);
    process.exit(1);
})