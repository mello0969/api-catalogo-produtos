// Middleware de tratamento global de erros
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let mensagem = err.message || 'Erro interno do servidor';

  // Erro de ID inválido no MongoDB (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    mensagem = `ID inválido: ${err.value}`;
  }

  // Erro de campo duplicado (unique: true no schema)
  if (err.code === 11000) {
    statusCode = 400;
    const campo = Object.keys(err.keyValue)[0];
    mensagem = `Já existe um registro com este ${campo}. Por favor, use outro valor.`;
  }

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    mensagem = Object.values(err.errors)
      .map((val) => val.message)
      .join('. ');
  }

  res.status(statusCode).json({
    sucesso: false,
    mensagem,
  });
};

module.exports = errorHandler;
