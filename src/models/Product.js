const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome do produto é obrigatório'],
      trim: true,
      minlength: [2, 'O nome deve ter ao menos 2 caracteres'],
      maxlength: [100, 'O nome não pode ultrapassar 100 caracteres'],
    },
    descricao: {
      type: String,
      required: [true, 'A descrição é obrigatória'],
      trim: true,
    },
    preco: {
      type: Number,
      required: [true, 'O preço é obrigatório'],
      min: [0, 'O preço não pode ser negativo'],
    },
    categoria: {
      type: String,
      required: [true, 'A categoria é obrigatória'],
      trim: true,
    },
    estoque: {
      type: Number,
      required: [true, 'A quantidade em estoque é obrigatória'],
      min: [0, 'O estoque não pode ser negativo'],
      default: 0,
    },
    ativo: {
      type: Boolean,
      default: true,
    },
    // Campo dinâmico: cada categoria pode ter atributos diferentes
    // Ex: { "tamanho": "M", "cor": "Azul" } para roupas
    //     { "voltagem": "110V", "garantia": "1 ano" } para eletrônicos
    atributos: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    criadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Índice de texto para busca por nome e descrição
productSchema.index({ nome: 'text', descricao: 'text' });

module.exports = mongoose.model('Product', productSchema);
