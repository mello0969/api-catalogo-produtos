const express = require('express');
const router = express.Router();
const {
  listarProdutos,
  buscarProduto,
  criarProduto,
  atualizarProduto,
  deletarProduto,
} = require('../controllers/productController');
const { proteger } = require('../middlewares/auth');

// Rotas públicas (qualquer um pode ver os produtos)
router.get('/', listarProdutos);
router.get('/:id', buscarProduto);

// Rotas protegidas (precisa estar logado)
router.post('/', proteger, criarProduto);
router.put('/:id', proteger, atualizarProduto);
router.delete('/:id', proteger, deletarProduto);

module.exports = router;
