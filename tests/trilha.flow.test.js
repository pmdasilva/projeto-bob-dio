/**
 * trilha.flow.test.js
 * Testes de FLUXO para o slash command /trilha
 * Cobre: busca bem-sucedida, busca case-insensitive, busca parcial,
 *        tecnologia não encontrada, integridade de dados no output,
 *        todas as 30 trilhas do JSON
 */

const {
  loadTrilhas,
  findTrilha,
  listTecnologias,
  validateTrilhaOutput,
} = require('./helpers/trilhasHelper');

const { buildTrilhaOutput } = require('./helpers/outputBuilder');

// ─── Fixtures ────────────────────────────────────────────────────────────────
const TRILHAS = loadTrilhas();

let passed = 0;
let failed = 0;
const results = [];

function assert(description, condition, detail = '') {
  if (condition) {
    passed++;
    results.push({ status: 'PASS', suite: 'flow:/trilha', description });
  } else {
    failed++;
    results.push({ status: 'FAIL', suite: 'flow:/trilha', description, detail });
  }
}

function assertContains(description, haystack, needle) {
  const ok = typeof haystack === 'string' && haystack.includes(needle);
  assert(description, ok, ok ? '' : `"${needle}" não encontrado no output`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// FLUXO 1 — Trilha encontrada com busca exata
// ═══════════════════════════════════════════════════════════════════════════════
;['Java', 'Python', 'React', 'Angular', 'Node.js', 'AWS'].forEach((tech) => {
  const trilha = findTrilha(TRILHAS, tech);
  assert(`/trilha ${tech}: trilha encontrada no JSON`, trilha !== null);

  if (trilha) {
    const output = buildTrilhaOutput(trilha);
    const { valid, missing } = validateTrilhaOutput(output);
    assert(
      `/trilha ${tech}: output contém todas as seções obrigatórias`,
      valid,
      missing.join(', ')
    );
    assertContains(`/trilha ${tech}: output menciona a tecnologia`, output, trilha.tecnologia);
    assertContains(`/trilha ${tech}: output menciona o nível`, output, trilha.nivel);
    assertContains(`/trilha ${tech}: output contém XP total`, output, String(trilha.xp_total));
    assertContains(`/trilha ${tech}: output contém quantidade de módulos`, output, String(trilha.numero_de_modulos));

    // Badges
    trilha.badges_disponiveis.forEach((badge) => {
      assertContains(`/trilha ${tech}: badge "${badge}" presente no output`, output, badge);
    });

    // Lives
    trilha.lives_ao_vivo.forEach((live) => {
      assertContains(`/trilha ${tech}: live "${live.titulo}" presente no output`, output, live.titulo);
    });

    // Número de linhas de módulos na tabela
    const moduleRows = output
      .split('\n')
      .filter((l) => l.startsWith('| ') && !l.startsWith('| #') && !l.startsWith('|---'));
    assert(
      `/trilha ${tech}: tabela tem exatamente ${trilha.numero_de_modulos} módulos`,
      moduleRows.length === trilha.numero_de_modulos,
      `esperado=${trilha.numero_de_modulos}, encontrado=${moduleRows.length}`
    );
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// FLUXO 2 — Busca case-insensitive
// ═══════════════════════════════════════════════════════════════════════════════
const variacoesCaseJava = ['java', 'JAVA', 'jAvA', 'Java'];
variacoesCaseJava.forEach((variacao) => {
  assert(`/trilha case-insensitive: "${variacao}" encontra Java`, findTrilha(TRILHAS, variacao) !== null);
});

const variacoesCasePython = ['python', 'PYTHON', 'pYtHoN'];
variacoesCasePython.forEach((variacao) => {
  assert(`/trilha case-insensitive: "${variacao}" encontra Python`, findTrilha(TRILHAS, variacao) !== null);
});

// ═══════════════════════════════════════════════════════════════════════════════
// FLUXO 3 — Busca parcial
// ═══════════════════════════════════════════════════════════════════════════════
const buscasParciais = [
  { termo: 'node',     esperada: 'Node.js' },
  { termo: 'machine',  esperada: 'Python / Machine Learning' },
  { termo: 'docker',   esperada: 'DevOps / Containers' },
  { termo: 'flutter',  esperada: 'Flutter / Dart' },
  { termo: 'kotlin',   esperada: 'Kotlin / Android' },
  { termo: 'azure',    esperada: 'Microsoft Azure' },
  { termo: 'spark',    esperada: 'Python / Spark / Hadoop' },
  { termo: 'sql',      esperada: 'SQL / Banco de Dados' },
];

buscasParciais.forEach(({ termo, esperada }) => {
  const trilha = findTrilha(TRILHAS, termo);
  assert(
    `/trilha busca parcial: "${termo}" encontra trilha de "${esperada}"`,
    trilha !== null && trilha.tecnologia === esperada,
    trilha ? `encontrou: ${trilha.tecnologia}` : 'não encontrou nada'
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// FLUXO 4 — Tecnologia não encontrada: lista as disponíveis
// ═══════════════════════════════════════════════════════════════════════════════
const tecnologiasInexistentes = ['COBOL', 'Pascal', 'TecnologiaFake999', 'XYZ'];
tecnologiasInexistentes.forEach((tech) => {
  const trilha = findTrilha(TRILHAS, tech);
  assert(`/trilha "${tech}": retorna null (não encontrada)`, trilha === null);
});

// Quando não encontra, o fluxo deve listar as disponíveis
const tecnologias = listTecnologias(TRILHAS);
assert('/trilha not-found: listTecnologias retorna array não vazio', tecnologias.length > 0);
assert('/trilha not-found: listTecnologias tem 30 entradas', tecnologias.length === 30);

// ═══════════════════════════════════════════════════════════════════════════════
// FLUXO 5 — Integridade do output para TODAS as 30 trilhas
// ═══════════════════════════════════════════════════════════════════════════════
TRILHAS.forEach((trilha) => {
  const output = buildTrilhaOutput(trilha);
  const { valid, missing } = validateTrilhaOutput(output);
  assert(
    `/trilha ALL: trilha id=${trilha.id} "${trilha.nome}" output válido`,
    valid,
    missing.join(', ')
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// FLUXO 6 — Promoção ativa vs inativa
// ═══════════════════════════════════════════════════════════════════════════════
const trilhaComPromo = TRILHAS.find((t) => t.promocoes.desconto !== '0%' && t.promocoes.desconto !== null);
const trilhaSemPromo = TRILHAS.find((t) => t.promocoes.desconto === '0%' || t.promocoes.validade === null);

if (trilhaComPromo) {
  const output = buildTrilhaOutput(trilhaComPromo);
  assertContains(
    `/trilha promoção: trilha "${trilhaComPromo.nome}" mostra desconto ${trilhaComPromo.promocoes.desconto}`,
    output,
    trilhaComPromo.promocoes.desconto
  );
}

if (trilhaSemPromo) {
  const output = buildTrilhaOutput(trilhaSemPromo);
  assertContains(
    `/trilha sem promoção: trilha "${trilhaSemPromo.nome}" mostra aviso de sem promoção`,
    output,
    'Nenhuma promoção ativa no momento.'
  );
}

// ─── Exporta resultados ───────────────────────────────────────────────────────
module.exports = { results, passed, failed };
