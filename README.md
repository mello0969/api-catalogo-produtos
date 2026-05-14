# 🛍️ API Catálogo de Produtos

API REST desenvolvida com **Node.js**, **Express** e **MongoDB (Mongoose)** para gerenciamento de um catálogo de produtos com autenticação JWT.

## 📋 Sumário

- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
- [Endpoints da API](#endpoints-da-api)
- [Fluxo GitFlow](#fluxo-gitflow)

---

## 🛠️ Tecnologias

| Tecnologia             | Uso                                          |
|------------------------|----------------------------------------------|
| Node.js + Express      | Framework HTTP e roteamento                  |
| MongoDB + Mongoose     | Banco de dados NoSQL e modelagem de dados    |
| JWT (jsonwebtoken)     | Autenticação via token                       |
| bcryptjs               | Criptografia de senhas                       |
| express-mongo-sanitize | Proteção contra NoSQL Injection              |
| helmet                 | Headers de segurança HTTP                    |
| cors                   | Cross-Origin Resource Sharing                |
| dotenv                 | Gerenciamento de variáveis de ambiente       |

---

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [MongoDB](https://www.mongodb.com/) local **OU** uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Git](https://git-scm.com/)

---

## 🚀 Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/SEU_USUARIO/api-catalogo-produtos.git
cd api-catalogo-produtos
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

Abra o arquivo `.env` e preencha os valores:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/catalogo_produtos
JWT_SECRET=seu_segredo_jwt_muito_forte_aqui
JWT_EXPIRES_IN=7d
```

> 💡 Para gerar um JWT_SECRET seguro, rode no terminal:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 4. Inicie o servidor

```bash
# Produção
npm start

# Desenvolvimento (com auto-reload)
npm run dev
```

O servidor estará disponível em: `http://localhost:3000`

---

## 📡 Endpoints da API

### 🔐 Autenticação (`/api/auth`)

| Método | Rota            | Descrição                          | Autenticação |
|--------|-----------------|------------------------------------|:------------:|
| POST   | `/api/auth/registro` | Registrar novo usuário         | ❌ Pública   |
| POST   | `/api/auth/login`    | Fazer login e receber token    | ❌ Pública   |
| GET    | `/api/auth/eu`       | Ver dados do usuário logado    | ✅ Privada   |

#### POST `/api/auth/registro`
```json
// Body (JSON)
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "minhasenha123"
}
```

#### POST `/api/auth/login`
```json
// Body (JSON)
{
  "email": "joao@email.com",
  "senha": "minhasenha123"
}
// Resposta: { "token": "eyJhbG..." }
```

---

### 📦 Produtos (`/api/produtos`)

| Método | Rota                | Descrição                         | Autenticação |
|--------|---------------------|-----------------------------------|:------------:|
| GET    | `/api/produtos`     | Listar todos os produtos          | ❌ Pública   |
| GET    | `/api/produtos/:id` | Buscar produto por ID             | ❌ Pública   |
| POST   | `/api/produtos`     | Criar novo produto                | ✅ Privada   |
| PUT    | `/api/produtos/:id` | Atualizar produto                 | ✅ Privada   |
| DELETE | `/api/produtos/:id` | Deletar produto                   | ✅ Privada   |

#### GET `/api/produtos` — Parâmetros de Query

| Parâmetro   | Tipo    | Descrição                              |
|-------------|---------|----------------------------------------|
| `categoria` | String  | Filtrar por categoria                  |
| `busca`     | String  | Busca textual em nome e descrição      |
| `ativo`     | Boolean | Filtrar por status (true/false)        |
| `pagina`    | Number  | Página atual (padrão: 1)               |
| `limite`    | Number  | Itens por página (padrão: 10)          |

**Exemplos:**
```
GET /api/produtos?categoria=eletronicos&pagina=1&limite=5
GET /api/produtos?busca=notebook
```

#### POST `/api/produtos` — Criar Produto
```json
// Header: Authorization: Bearer <token>
// Body (JSON)
{
  "nome": "Notebook Pro",
  "descricao": "Notebook de alta performance para desenvolvedores",
  "preco": 4999.90,
  "categoria": "Eletronicos",
  "estoque": 15,
  "atributos": {
    "processador": "Intel Core i7",
    "ram": "16GB",
    "armazenamento": "512GB SSD",
    "tela": "15.6 polegadas"
  }
}
```

#### PUT `/api/produtos/:id` — Atualizar Produto
```json
// Header: Authorization: Bearer <token>
// Body (JSON) — envie apenas os campos que deseja alterar
{
  "preco": 4599.90,
  "estoque": 20
}
```

---

## 🌿 Fluxo GitFlow

```
main         ─────●────────────────────●──── (produção estável)
               merge ↑               merge ↑
develop      ────●────●────●────●────●────── (integração)
               merge ↑   merge ↑
feature/*    ──────────●──────────●──────── (novas features)
```

### Branches utilizadas

| Branch                        | Descrição                              |
|-------------------------------|----------------------------------------|
| `main`                        | Versão estável, pronta para produção   |
| `develop`                     | Integração das novas funcionalidades   |
| `feature/configuracao-inicial`| Setup do projeto e conexão com MongoDB |
| `feature/autenticacao`        | Registro, login e JWT                  |
| `feature/crud-produtos`       | CRUD completo de produtos              |
| `feature/seguranca`           | Sanitização e proteções               |

### Comandos GitFlow utilizados

```bash
# Criar branch de feature
git checkout develop
git checkout -b feature/autenticacao

# Após finalizar a feature
git add .
git commit -m "feat: implementa registro e login de usuários"
git checkout develop
git merge feature/autenticacao

# Ao finalizar tudo, mergear develop na main
git checkout main
git merge develop
git tag -a v1.0.0 -m "Versão inicial da API"
```

### Padrão de Commits Semânticos

```
feat:     nova funcionalidade
fix:      correção de bug
docs:     alteração na documentação
refactor: refatoração de código
chore:    configuração/setup
```

---

## 🔒 Segurança Implementada

1. **Criptografia de Senhas**: bcryptjs com fator de custo 12
2. **JWT**: Tokens com expiração configurável
3. **NoSQL Injection**: express-mongo-sanitize remove operadores MongoDB do input
4. **Headers HTTP**: helmet configura headers de segurança
5. **Senha protegida**: campo `senha` com `select: false` — nunca retorna nas queries
6. **Validações**: Schema Mongoose com validações obrigatórias em todos os campos

---

## 📁 Estrutura do Projeto (MVC)

```
api-catalogo-produtos/
├── src/
│   ├── config/
│   │   └── database.js          # Conexão com MongoDB
│   ├── controllers/
│   │   ├── authController.js    # Lógica de autenticação
│   │   └── productController.js # Lógica CRUD dos produtos
│   ├── middlewares/
│   │   ├── auth.js              # Middleware JWT (proteger rotas)
│   │   └── errorHandler.js      # Tratamento global de erros
│   ├── models/
│   │   ├── User.js              # Schema e Model de Usuário
│   │   └── Product.js           # Schema e Model de Produto
│   └── routes/
│       ├── authRoutes.js        # Rotas de autenticação
│       └── productRoutes.js     # Rotas de produtos
├── .env.example                 # Variáveis de ambiente (modelo)
├── .gitignore                   # Arquivos ignorados pelo Git
├── package.json                 # Dependências e scripts
├── server.js                    # Ponto de entrada da aplicação
└── README.md                    # Esta documentação
```
