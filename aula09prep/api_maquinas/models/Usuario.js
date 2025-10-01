
// Importa o mongoose para definição de schema e modelo
const mongoose = require("mongoose");

// Cria a estrutura (schema) para o documento de usuário
const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },  // Campo "nome", obrigatório e do tipo String
  email: { type: String, required: true }  // Campo "email", obrigatório e do tipo String
});

// Exporta o modelo "Usuario", que será usado nas rotas CRUD
module.exports = mongoose.model("Usuario", UsuarioSchema);