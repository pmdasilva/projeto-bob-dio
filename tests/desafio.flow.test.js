/**
 * desafio.flow.test.js
 * Testes de FLUXO para o slash command /desafio
 * Cobre: geração com trilha conhecida, tecnologia desconhecida,
 *        validação de todas as seções obrigatórias, calibragem de nível,
 *        categorias válidas, formato de XP e tempo estimado
 */

const {
  loadTrilhas,
  findTrilha,
  validateDesafioOutput,
} = require('./helpers/trilhasHelper');

const { buildDesafioOutput } = require('./helpers/outputBuilder');

// ─── Fixtures ────────────────────────────────────────────────────────────────
const TRILHAS = loadTrilhas();

let passed = 0;
let failed = 0;
const results = [];

function assert(description, condition, detail = '') {
  if (condition) {
    passed++;
    results.push({ status: 'PASS', suite: 'flow:/desafio', description });
  } else {
    failed++;
    results.push({ status: 'FAIL', suite: 'flow:/desafio', description, detail });
  }
}

function assertContains(description, haystack, needle) {
  const ok = typeof haystack === 'string' && haystack.includes(needle);
  assert(description, ok, ok ? '' : `"${needle}" não encontrado no output`);
}

// ─── Categorias válidas (conforme .bob/commands/desafio.md) ──────────────────
const CATEGORIAS_VALIDAS = [
  'Algoritmos e Lógica',
  'Estruturas de Dados',
  'Manipulação de Strings',
  'Operações com Arrays/Listas',
  'Orientação a Objetos',
  'Consumo de API / HTTP',
  'Banco de Dados / Queries',
  'Testes Unitários',
  'Refatoração de Código',
  'Mini Projeto Prático',
];

// ═══════════════════════════════════════════════════════════════════════════════
// FLUXO 1 — Desafio para tecnologia conhecida
// ═══════════════════════════════════════════════════════════════════════════════
const casosConhecidos = [
  { tech: 'Java',    nivelEsperado: 'Intermediário', xpEsperado: 1500, tempoEsperado: '1h' },
  { tech: 'Python',  nivelEsperado: 'Básico',        xpEsperado: 500,  tempoEsperado: '30 min' },
  { tech: 'React',   nivelEsperado: 'Intermediário', xpEsperado: 1500, tempoEsperado: '1h' },
  { tech: 'Rust',    nivelEsperado: 'Avançado',      xpEsperado: 3000, tempoEsperado: '2h' },
  { tech: 'AWS',     nivelEsperado: 'Básico',        xpEsperado: 500,  tempoEsperado: '30 min' },
];

casosConhecidos.forEach(({ tech, nivelEsperado, xpEsperado, tempoEsperado }) => {
  const trilha = findTrilha(TRILHAS, tech);
  const categoria = CATEGORIAS_VALIDAS[0]; // Algoritmos e Lógica
  const output = buildDesafioOutput(trilha, tech, categoria);

  const { valid, missing } = validateDesafioOutput(output);
  assert(
    `/desafio ${tech}: output contém todas as seções obrigatórias`,
    valid,
    missing.join(', ')
  );

  assertContains(`/desafio ${tech}: menciona a tecnologia no título`, output, tech);
  assertContains(`/desafio ${tech}: nível correto "${nivelEsperado}"`,  output, nivelEsperado);
  assertContains(`/desafio ${tech}: XP correto "${xpEsperado}"`,        output, String(xpEsperado));
  assertContains(`/desafio ${tech}: tempo correto "${tempoEsperado}"`,  output, tempoEsperado);
  assertContains(`/desafio ${tech}: categoria "${categoria}" presente`, output, categoria);
});

// ═══════════════════════════════════════════════════════════════════════════════
// FLUXO 2 — Desafio para tecnologia NÃO cadastrada no JSON
// ═══════════════════════════════════════════════════════════════════════════════
const techDesconhecidas = ['COBOL', 'Pascal', 'Assembly', 'FORTRAN'];

techDesconhecidas.forEach((tech) => {
  const trilha = findTrilha(TRILHAS, tech); // deve ser null
  assert(`/desafio ${tech}: trilha não encontrada no JSON (null)`, trilha === null);

  // Mesmo sem trilha, o desafio deve ser gerado com nível Intermediário
  const output = buildDesafioOutput(null, tech, 'Estruturas de Dados');
  const { valid, missing } = validateDesafioOutput(output);
  assert(
    `/desafio ${tech} (desconhecido): output ainda contém seções obrigatórias`,
    valid,
    missing.join(', ')
  );
  assertContains(`/desafio ${tech} (desconhecido): nível padrão "Intermediário"`, output, 'Intermediário');
  assertContains(`/desafio ${tech} (desconhecido): XP padrão "1500"`, output, '1500');
});

// ═══════════════════════════════════════════════════════════════════════════════
// FLUXO 3 — Todas as categorias válidas geram output correto
// ═══════════════════════════════════════════════════════════════════════════════
const trilhaPython = findTrilha(TRILHAS, 'Python');

CATEGORIAS_VALIDAS.forEach((categoria) => {
  const output = buildDesafioOutput(trilhaPython, 'Python', categoria);
  assertContains(
    `/desafio Python: categoria "${categoria}" aparece no output`,
    output,
    categoria
  );
  const { valid } = validateDesafioOutput(output);
  assert(
    `/desafio Python: categoria "${categoria}" gera output válido`,
    valid
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// FLUXO 4 — Casos de teste obrigatórios no output
// ═══════════════════════════════════════════════════════════════════════════════
const trilhaJava = findTrilha(TRILHAS, 'Java');
const outputJava = buildDesafioOutput(trilhaJava, 'Java', 'Algoritmos e Lógica');

assertContains('/desafio Java: tabela de casos de teste presente', outputJava, '## 🧪 Casos de Teste');
assertContains('/desafio Java: tabela tem pelo menos 3 linhas (| 1 |)', outputJava, '| 1 |');
assertContains('/desafio Java: tabela tem linha 2 (| 2 |)', outputJava, '| 2 |');
assertContains('/desafio Java: tabela tem linha 3 (| 3 |)', outputJava, '| 3 |');

// ═══════════════════════════════════════════════════════════════════════════════
// FLUXO 5 — Calibragem de XP por nível
// ═══════════════════════════════════════════════════════════════════════════════
const nivelXpMap = [
  { nivel: 'Básico',        xp: 500 },
  { nivel: 'Intermediário', xp: 1500 },
  { nivel: 'Avançado',      xp: 3000 },
];

nivelXpMap.forEach(({ nivel, xp }) => {
  const trilhaMock = { nivel };
  const output = buildDesafioOutput(trilhaMock, 'TestTech', 'Mini Projeto Prático');
  assertContains(
    `/desafio XP calibrado: nível "${nivel}" gera XP=${xp}`,
    output,
    String(xp)
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// FLUXO 6 — Output contém dicas e orientação final
// ═══════════════════════════════════════════════════════════════════════════════
const outputReact = buildDesafioOutput(findTrilha(TRILHAS, 'React'), 'React', 'Consumo de API / HTTP');

assertContains('/desafio React: seção de dicas presente', outputReact, '## 💡 Dicas');
assertContains('/desafio React: orientação de /certificado no rodapé', outputReact, '/certificado');
assertContains('/desafio React: orientação de revisão no rodapé', outputReact, 'Cole sua solução no chat para revisão');

// ─── Exporta resultados ───────────────────────────────────────────────────────
module.exports = { results, passed, failed };
