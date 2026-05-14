const Product = require('../models/Product');

// @desc    Listar todos os produtos (com filtros e paginação)
// @route   GET /api/produtos
// @access  Público
const listarProdutos = async (req, res, next) => {
  try {
    const { categoria, busca, ativo, pagina = 1, limite = 10 } = req.query;

    // Construir objeto de filtros dinamicamente
    const filtros = {};

    if (categoria) filtros.categoria = new RegExp(categoria, 'i');
    if (ativo !== undefined) filtros.ativo = ativo === 'true';

    // Busca textual por nome ou descrição
    if (busca) {
      filtros.$text = { $search: busca };
    }

    const skip = (Number(pagina) - 1) * Number(limite);

    const [produtos, total] = await Promise.all([
      Product.find(filtros)
        .populate('criadoPor', 'nome email')
        .skip(skip)
        .limit(Number(limite))
        .sort({ createdAt: -1 }),
      Product.countDocuments(filtros),
    ]);

    res.status(200).json({
      sucesso: true,
      total,
      pagina: Number(pagina),
      totalPaginas: Math.ceil(total / Number(limite)),
      produtos,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Buscar um produto pelo ID
// @route   GET /api/produtos/:id
// @access  Público
const buscarProduto = async (req, res, next) => {
  try {
    const produto = await Product.findById(req.params.id).populate(
      'criadoPor',
      'nome email'
    );

    if (!produto) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Produto não encontrado.',
      });
    }

    res.status(200).json({ sucesso: true, produto });
  } catch (error) {
    next(error);
  }
};

// @desc    Criar novo produto
// @route   POST /api/produtos
// @access  Privado
const criarProduto = async (req, res, next) => {
  try {
    const { nome, descricao, preco, categoria, estoque, atributos } = req.body;

    const produto = await Product.create({
      nome,
      descricao,
      preco,
      categoria,
      estoque,
      atributos,
      criadoPor: req.usuario._id,
    });

    res.status(201).json({
      sucesso: true,
      mensagem: 'Produto criado com sucesso!',
      produto,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Atualizar produto
// @route   PUT /api/produtos/:id
// @access  Privado
const atualizarProduto = async (req, res, next) => {
  try {
    let produto = await Product.findById(req.params.id);

    if (!produto) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Produto não encontrado.',
      });
    }

    // Verifica se o usuário é dono do produto ou é admin
    if (
      produto.criadoPor.toString() !== req.usuario._id.toString() &&
      req.usuario.role !== 'admin'
    ) {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Você não tem permissão para editar este produto.',
      });
    }

    produto = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,          // retorna o documento atualizado
      runValidators: true, // executa as validações do schema
    });

    res.status(200).json({
      sucesso: true,
      mensagem: 'Produto atualizado com sucesso!',
      produto,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deletar produto
// @route   DELETE /api/produtos/:id
// @access  Privado
const deletarProduto = async (req, res, next) => {
  try {
    const produto = await Product.findById(req.params.id);

    if (!produto) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Produto não encontrado.',
      });
    }

    // Verifica se o usuário é dono do produto ou é admin
    if (
      produto.criadoPor.toString() !== req.usuario._id.toString() &&
      req.usuario.role !== 'admin'
    ) {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Você não tem permissão para deletar este produto.',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      sucesso: true,
      mensagem: 'Produto deletado com sucesso.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarProdutos,
  buscarProduto,
  criarProduto,
  atualizarProduto,
  deletarProduto,
};
