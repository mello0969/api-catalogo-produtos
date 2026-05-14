require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const path = require('path');
const connectDB = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

// Conectar ao banco de dados
connectDB();

const app = express();

// ==============================================
// MIDDLEWARES DE SEGURANÇA
// ==============================================

// Helmet configurado para permitir scripts inline do frontend
app.use(helmet({
  contentSecurityPolicy: false,
}));

// CORS: permite requisições de outras origens
app.use(cors());

// Parsear JSON no body das requisições
app.use(express.json());

// Servir arquivos estáticos da pasta public (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// express-mongo-sanitize: remove caracteres perigosos do input
app.use(mongoSanitize());

// ==============================================
// ROTAS
// ==============================================
app.use('/api/auth', authRoutes);
app.use('/api/produtos', productRoutes);

// Rota raiz → serve o frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota não encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: `Rota ${req.originalUrl} não encontrada.`,
  });
});

// ==============================================
// HANDLER DE ERROS GLOBAL
// ==============================================
app.use(errorHandler);

// ==============================================
// INICIAR SERVIDOR
// ==============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV || 'development'}`);
});
