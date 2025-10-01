const mongoose = require("mongoose");

// Cria a estrutura (schema) para o documento de máquina
const MaquinaSchema = new mongoose.Schema({
  nome: { type: String, required: true },             // Nome da máquina
  tipo: { type: String, required: true },             // Tipo (ex.: impressora, torno, etc.)
  status: { type: String, required: true },           // Status (ex.: ativa, inativa, manutenção)
  ultimaManutencao: { type: Date, required: true },   // Última manutenção feita
  proximaManutencao: { type: Date, required: true }   // Próxima manutenção agendada
});

// Exporta o modelo "Maquina"
module.exports = mongoose.model("Maquina", MaquinaSchema);