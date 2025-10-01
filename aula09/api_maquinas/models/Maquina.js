 // importa biblioteca do mongoose
 const mongoose = require("mongoose");

 // Cria a estrutura (schema) para o documento da maquina
 const MaquinaSchema = new mongoose.Schema({
    nome:{type: String, required: true}, // Nome da maquina
    tipo:{type: String,required: true}, // Tipo ex impressora, rotativa, etc
    status:{type: String, required: true}, // status ativa, inativa, manutenção
    ultimaManutencao:{type: Date,required: true}, // Ultima manutenção
    proximaManutencao:{type: Date, required: true} // proxima manutenção

 })

 // Exporta o modelo Maquina
 module.exports = mongoose.model("Maquina",MaquinaSchema);