const express = require('express');
const router = express.Router();
const { registro, login, meuPerfil } = require('../controllers/authController');
const { proteger } = require('../middlewares/auth');

// POST /api/auth/registro
router.post('/registro', registro);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/eu  (rota protegida — precisa de token)
router.get('/eu', proteger, meuPerfil);

module.exports = router;
