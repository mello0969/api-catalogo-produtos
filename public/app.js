// ── CONFIG ──
const API = window.location.origin + '/api';

// ── TOKEN HELPERS ──
function getToken()    { return localStorage.getItem('token'); }
function getUserName() { return localStorage.getItem('userName'); }
function isLoggedIn()  { return !!getToken(); }

function setSession(token, nome) {
  localStorage.setItem('token', token);
  localStorage.setItem('userName', nome);
}

function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
}

// ── TOAST ──
function showToast(msg, type = 'success') {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = (type === 'success' ? '✅ ' : '❌ ') + msg;
  t.className = `toast ${type} show`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3500);
}

// ── NAV STATE ──
function atualizarNav() {
  const logado = isLoggedIn();
  const nome = getUserName();

  const btnEntrar     = document.getElementById('btn-entrar');
  const btnCriarConta = document.getElementById('btn-criar-conta');
  const btnSair       = document.getElementById('btn-sair');
  const navProdutos   = document.getElementById('nav-produtos');
  const userDisplay   = document.getElementById('user-display');
  const userNameNav   = document.getElementById('user-name-nav');

  if (btnEntrar)     btnEntrar.style.display     = logado ? 'none' : '';
  if (btnCriarConta) btnCriarConta.style.display = logado ? 'none' : '';
  if (btnSair)       btnSair.style.display       = logado ? '' : 'none';
  if (navProdutos)   navProdutos.style.display   = logado ? '' : 'none';
  if (userDisplay)   userDisplay.style.display   = logado ? 'flex' : 'none';
  if (userNameNav && nome) userNameNav.textContent = nome;
}

function sair() {
  clearSession();
  showToast('Você saiu da conta.');
  setTimeout(() => window.location.href = 'index.html', 800);
}

// ── STATUS BAR ──
async function verificarStatus() {
  const dot  = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  if (!dot || !text) return;
  try {
    const res = await fetch(`${API}/produtos?limite=1`);
    if (res.ok) {
      dot.style.background = 'var(--success)';
      text.textContent = 'API Online · ' + window.location.hostname;
    } else throw new Error();
  } catch {
    dot.style.background = 'var(--danger)';
    text.textContent = 'API Offline';
  }
}

// ── INIT (chamado em cada página) ──
document.addEventListener('DOMContentLoaded', () => {
  atualizarNav();
  verificarStatus();
});
