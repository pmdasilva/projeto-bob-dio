/**
 * app.js — Lógica principal do front-end DIO Trilhas
 * Depende de: api.js (loadTrilhas)
 */

/* ──────────────────────────────────────────────
   STATE
────────────────────────────────────────────── */
let TRILHAS = [];
let filtroNivel = 'all';
let termoBusca = '';

/* ──────────────────────────────────────────────
   INIT
────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  TRILHAS = await loadTrilhas();
  populateSelects();
  renderTrilhasGrid();
  bindNav();
  bindFilters();
  bindSearch();
  bindBackBtn();
  bindDesafio();
  bindCertificado();
});

/* ──────────────────────────────────────────────
   NAV
────────────────────────────────────────────── */
function bindNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setView(btn.dataset.view);
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function setView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + name).classList.add('active');
}

/* ──────────────────────────────────────────────
   SELECTS (Desafio + Certificado)
────────────────────────────────────────────── */
function populateSelects() {
  const selects = ['desafio-tecnologia', 'cert-tecnologia'];
  selects.forEach(id => {
    const sel = document.getElementById(id);
    TRILHAS.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.tecnologia;
      opt.textContent = t.tecnologia + ' — ' + t.nome;
      sel.appendChild(opt);
    });
  });
}

/* ──────────────────────────────────────────────
   FILTERS & SEARCH
────────────────────────────────────────────── */
function bindFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filtroNivel = btn.dataset.nivel;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTrilhasGrid();
    });
  });
}

function bindSearch() {
  document.getElementById('search-input').addEventListener('input', e => {
    termoBusca = e.target.value.trim().toLowerCase();
    renderTrilhasGrid();
  });
}

/* ──────────────────────────────────────────────
   TRILHAS GRID
────────────────────────────────────────────── */
function renderTrilhasGrid() {
  const grid = document.getElementById('trilhas-grid');
  grid.innerHTML = '';

  const filtered = TRILHAS.filter(t => {
    const matchNivel = filtroNivel === 'all' || t.nivel === filtroNivel;
    const matchBusca = !termoBusca
      || t.nome.toLowerCase().includes(termoBusca)
      || t.tecnologia.toLowerCase().includes(termoBusca);
    return matchNivel && matchBusca;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <span class="icon">🔍</span>
        Nenhuma trilha encontrada para "<strong>${escHtml(termoBusca)}</strong>"
      </div>`;
    return;
  }

  filtered.forEach(t => {
    const card = document.createElement('div');
    card.className = 'trilha-card';
    card.dataset.id = t.id;

    const temPromo = t.promocoes && t.promocoes.desconto && t.promocoes.desconto !== '0%';
    const promoTag = temPromo
      ? `<span class="promo-tag">🔥 ${t.promocoes.desconto} OFF</span>`
      : '';

    card.innerHTML = `
      <div class="card-header">
        <div class="card-title">${escHtml(t.nome)}</div>
        <span class="badge-nivel nivel-${t.nivel}">${t.nivel}</span>
      </div>
      <div class="card-tech">🔧 ${escHtml(t.tecnologia)}</div>
      <div class="card-stats">
        <div>📦 <span>${t.numero_de_modulos}</span> módulos</div>
        <div>⭐ <span>${t.xp_total.toLocaleString('pt-BR')}</span> XP</div>
      </div>
      ${promoTag}
    `;

    card.addEventListener('click', () => showDetalhe(t));
    grid.appendChild(card);
  });
}

/* ──────────────────────────────────────────────
   DETALHE TRILHA
────────────────────────────────────────────── */
function showDetalhe(t) {
  const content = document.getElementById('detalhe-content');
  const temPromo = t.promocoes && t.promocoes.desconto && t.promocoes.desconto !== '0%';

  const badges = t.badges_disponiveis
    .map(b => `<span class="badge-item">🏅 ${escHtml(b)}</span>`)
    .join('');

  const lives = t.lives_ao_vivo
    .map(l => `
      <div class="live-item">
        <div class="live-titulo">🎙️ ${escHtml(l.titulo)}</div>
        <div class="live-meta">📅 ${formatData(l.data)} às ${l.horario} · 👤 ${escHtml(l.instrutor)}</div>
      </div>`)
    .join('');

  const promoSection = temPromo ? `
    <div class="promo-box">
      <h3>🔥 Promoção Ativa</h3>
      <div class="promo-desconto">${t.promocoes.desconto} OFF</div>
      <p style="margin-top:6px;font-size:.9rem;">${escHtml(t.promocoes.descricao)}</p>
      <p style="margin-top:4px;font-size:.8rem;color:var(--muted);">Válido até ${formatData(t.promocoes.validade)}</p>
    </div>` : '';

  content.innerHTML = `
    <div class="detalhe-header">
      <div class="detalhe-titulo">
        <h2>${escHtml(t.nome)}</h2>
        <p>${escHtml(t.tecnologia)} &nbsp;·&nbsp;
          <span class="badge-nivel nivel-${t.nivel}" style="display:inline;padding:2px 10px;">${t.nivel}</span>
        </p>
      </div>
    </div>

    <div class="stat-row">
      <div class="stat-box"><div class="num">${t.numero_de_modulos}</div><div class="lbl">Módulos</div></div>
      <div class="stat-box"><div class="num">${t.xp_total.toLocaleString('pt-BR')}</div><div class="lbl">XP Total</div></div>
      <div class="stat-box"><div class="num">${t.badges_disponiveis.length}</div><div class="lbl">Badges</div></div>
      <div class="stat-box"><div class="num">${t.lives_ao_vivo.length}</div><div class="lbl">Lives</div></div>
    </div>

    ${promoSection}

    <div class="detalhe-grid">
      <div class="detalhe-section">
        <h3>🏅 Badges Conquistáveis</h3>
        <div class="badges-list">${badges}</div>
      </div>
      <div class="detalhe-section">
        <h3>🎙️ Próximas Lives</h3>
        <div class="lives-list">${lives}</div>
      </div>
    </div>
  `;

  setView('detalhe');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function bindBackBtn() {
  document.getElementById('back-to-trilhas').addEventListener('click', () => {
    setView('trilhas');
    // mantém o nav-btn correto ativo
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.view === 'trilhas');
    });
  });
}

/* ──────────────────────────────────────────────
   DESAFIO
────────────────────────────────────────────── */
function bindDesafio() {
  document.getElementById('btn-gerar-desafio').addEventListener('click', () => {
    const tecSel  = document.getElementById('desafio-tecnologia').value;
    const catSel  = document.getElementById('desafio-categoria').value;
    const output  = document.getElementById('desafio-output');

    const trilha = TRILHAS.find(t => t.tecnologia === tecSel) || null;
    const nivel  = trilha ? trilha.nivel : 'Intermediário';

    const categorias = [
      'Algoritmos e Lógica', 'Estruturas de Dados', 'Manipulação de Strings',
      'Operações com Arrays/Listas', 'Orientação a Objetos', 'Consumo de API / HTTP',
      'Banco de Dados / Queries', 'Testes Unitários', 'Refatoração de Código', 'Mini Projeto Prático'
    ];
    const categoria = catSel || categorias[Math.floor(Math.random() * categorias.length)];

    const cfg = {
      'Básico':        { xp: 500,  tempo: '30 min' },
      'Intermediário': { xp: 1500, tempo: '1h' },
      'Avançado':      { xp: 3000, tempo: '2h' }
    }[nivel] || { xp: 1500, tempo: '1h' };

    const desafio = gerarDesafioTexto(tecSel, nivel, categoria, cfg);
    output.textContent = desafio;
    output.classList.remove('hidden');
    output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

function gerarDesafioTexto(tec, nivel, categoria, cfg) {
  const exemplos = {
    'Algoritmos e Lógica':       `Implemente uma função que receba um array de inteiros e retorne o segundo maior valor único.\nEx: [3,1,4,1,5,9,2,6] → 6`,
    'Estruturas de Dados':       `Implemente uma pilha (Stack) usando apenas arrays nativos de ${tec}.\nOperações: push, pop, peek, isEmpty.`,
    'Manipulação de Strings':    `Escreva uma função que verifique se uma string é palíndromo, ignorando espaços e maiúsculas.\nEx: "A man a plan a canal Panama" → true`,
    'Operações com Arrays/Listas':`Dado um array de números, retorne um novo array apenas com os valores únicos, sem usar Set.\nEx: [1,2,2,3,3,4] → [1,2,3,4]`,
    'Orientação a Objetos':      `Crie uma classe Animal com atributos nome e som.\nSubclasses Cachorro e Gato devem sobrescrever o método falar().`,
    'Consumo de API / HTTP':     `Faça uma requisição GET para https://jsonplaceholder.typicode.com/users e\nexiba nome e email de cada usuário no console.`,
    'Banco de Dados / Queries':  `Escreva uma query SQL que retorne os 5 clientes com maior valor total de compras,\njuntando as tabelas clientes e pedidos.`,
    'Testes Unitários':          `Escreva testes unitários para uma função soma(a, b) cobrindo:\n- valores positivos, negativos, zero, floats e strings inválidas.`,
    'Refatoração de Código':     `Refatore o código abaixo eliminando duplicação e aplicando DRY:\n\nif (tipo === "A") { calcular(x); salvar(x); }\nif (tipo === "B") { calcular(x); salvar(x); }`,
    'Mini Projeto Prático':      `Crie um CRUD em memória para gerenciar uma lista de tarefas (to-do list).\nOperações: criar, listar, concluir, remover.`
  };

  const enunciado = exemplos[categoria] || `Resolva um problema de ${categoria} usando ${tec}.`;

  return [
    `╔══════════════════════════════════════════╗`,
    `  ⚔️  DESAFIO DE CÓDIGO — ${tec}`,
    `╚══════════════════════════════════════════╝`,
    ``,
    `📋 Categoria : ${categoria}`,
    `🎯 Nível     : ${nivel}`,
    `⭐ XP        : ${cfg.xp.toLocaleString('pt-BR')} XP`,
    `⏱️  Tempo     : ${cfg.tempo}`,
    ``,
    `─────────────────────────────────────────────`,
    `📝 ENUNCIADO`,
    `─────────────────────────────────────────────`,
    ``,
    enunciado,
    ``,
    `─────────────────────────────────────────────`,
    `💡 DICAS`,
    `─────────────────────────────────────────────`,
    ``,
    `  1. Comece pelos casos mais simples (happy path).`,
    `  2. Trate os casos extremos: array vazio, null, zero.`,
    `  3. Escreva um teste antes de implementar (TDD).`,
    ``,
    `─────────────────────────────────────────────`,
    `✅ Critérios de Aceite`,
    `─────────────────────────────────────────────`,
    ``,
    `  • Todos os casos de teste passam`,
    `  • Sem uso de bibliotecas externas`,
    `  • Código limpo e comentado`,
    ``,
  ].join('\n');
}

/* ──────────────────────────────────────────────
   CERTIFICADO
────────────────────────────────────────────── */
function bindCertificado() {
  document.getElementById('btn-gerar-cert').addEventListener('click', () => {
    const nome   = document.getElementById('cert-nome').value.trim();
    const tecSel = document.getElementById('cert-tecnologia').value;
    const output = document.getElementById('cert-output');

    if (!nome) {
      alert('Por favor, insira seu nome completo.');
      return;
    }

    const trilha = TRILHAS.find(t => t.tecnologia === tecSel);
    if (!trilha) return;

    const cert = gerarCertificadoTexto(nome, trilha);
    output.textContent = cert;
    output.classList.remove('hidden');
    output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

function gerarCertificadoTexto(nome, trilha) {
  const ano    = new Date().getFullYear();
  const id     = String(trilha.id).padStart(4, '0');
  const sigla  = removerAcentos(nome).substring(0, 3).toUpperCase();
  const codigo = `DIO-${id}-${sigla}-${ano}`;
  const data   = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const badges = trilha.badges_disponiveis.map(b => `   🏅 ${b}`).join('\n');

  return [
    `╔══════════════════════════════════════════════════════╗`,
    `   🏆  CERTIFICADO DE CONCLUSÃO`,
    `   Digital Innovation One — DIO`,
    `╚══════════════════════════════════════════════════════╝`,
    ``,
    `  Certificamos que`,
    ``,
    `       ${nome.toUpperCase()}`,
    ``,
    `  concluiu com êxito a trilha de aprendizado:`,
    ``,
    `       📚 ${trilha.nome}`,
    `       🔧 Tecnologia : ${trilha.tecnologia}`,
    `       🎯 Nível      : ${trilha.nivel}`,
    `       📦 Módulos    : ${trilha.numero_de_modulos}`,
    `       ⭐ XP Total   : ${trilha.xp_total.toLocaleString('pt-BR')} XP`,
    ``,
    `─────────────────────────────────────────────────────────`,
    `  🏅 Badges Conquistadas`,
    ``,
    badges,
    ``,
    `─────────────────────────────────────────────────────────`,
    `  📅 Emitido em : ${data}`,
    `  🔑 Código     : ${codigo}`,
    ``,
    `  Verifique em: https://www.dio.me/certificate/${codigo}`,
    ``,
    `╔══════════════════════════════════════════════════════╗`,
    `   Feito com 🤖 IBM Bob AI  ·  #DIO #BobAI`,
    `╚══════════════════════════════════════════════════════╝`,
  ].join('\n');
}

/* ──────────────────────────────────────────────
   UTILS
────────────────────────────────────────────── */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatData(dateStr) {
  if (!dateStr) return '–';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function removerAcentos(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
