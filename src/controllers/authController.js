const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Gera um token JWT para o usuário
const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Registrar novo usuário
// @route   POST /api/auth/registro
// @access  Público
const registro = async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;

    // Verificar se e-mail já está em uso
    const usuarioExiste = await User.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Este e-mail já está cadastrado.',
      });
    }

    const usuario = await User.create({ nome, email, senha });
    const token = gerarToken(usuario._id);

    res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário criado com sucesso!',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login de usuário
// @route   POST /api/auth/login
// @access  Público
const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    // Validação dos campos obrigatórios
    if (!email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Por favor, informe e-mail e senha.',
      });
    }

    // Buscar usuário incluindo o campo senha (que é select: false)
    const usuario = await User.findOne({ email }).select('+senha');
    if (!usuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'E-mail ou senha incorretos.',
      });
    }

    // Comparar senha digitada com a hash salva
    const senhaCorreta = await usuario.compararSenha(senha);
    if (!senhaCorreta) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'E-mail ou senha incorretos.',
      });
    }

    const token = gerarToken(usuario._id);

    res.status(200).json({
      sucesso: true,
      mensagem: 'Login realizado com sucesso!',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Retornar dados do usuário logado
// @route   GET /api/auth/eu
// @access  Privado
const meuPerfil = async (req, res, next) => {
  try {
    const usuario = await User.findById(req.usuario._id);
    res.status(200).json({
      sucesso: true,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        criadoEm: usuario.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registro, login, meuPerfil };
