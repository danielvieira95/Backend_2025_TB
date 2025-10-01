const express = require("express");
const mongoose = require("mongoose");

const usuarioRoutes = require("./routes/usuario");
const maquinaRoutes = require("./routes/maquina");

const app = express();
const PORT = 4000;

// Middleware para interpretar JSON
app.use(express.json());

// Conecta ao MongoDB
mongoose.connect("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Conectado ao MongoDB"))
.catch(err => console.error("❌ Erro ao conectar:", err));

// Usando as rotas de usuário e máquina
app.use("/api/usuario", usuarioRoutes);
app.use("/api/maquina", maquinaRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
