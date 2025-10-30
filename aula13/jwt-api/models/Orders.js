// Criar o modelo para processar os pedidos

const { timeStamp } = require("console");
const mongoose = require("mongoose"); // importa a biblioteca para realizar comunicação com o mongo

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref:"User",require:true},
        items:[
            {
                productId:{type: String, required: true},
                qtd:{type: Number,required:true,min:1}
            }
        ],
        notes:{type:String}
    },
    {timestamps:true}
);

module.exports = mongoose.model("Order",orderSchema);