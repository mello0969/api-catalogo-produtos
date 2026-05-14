const jwt = require('jsonwebtoken');
const User = require('../models/User');

const proteger = async (req, res, next) => {
  try {
    // 1. Verificar se o token foi enviado no header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Acesso negado. Faça login para continuar.',
      });
    }

    // 2. Extrair e verificar o token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Verificar se o usuário ainda existe
    const usuario = await User.findById(decoded.id);
    if (!usuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado. Faça login novamente.',
      });
    }

    // 4. Anexar usuário à requisição e seguir em frente
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      sucesso: false,
      mensagem: 'Token inválido ou expirado.',
    });
  }
};

// Middleware para restringir acesso por role (ex: somente admin)
const restringir = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.role)) {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Você não tem permissão para realizar esta ação.',
      });
    }
    next();
  };
};

module.exports = { proteger, restringir };
