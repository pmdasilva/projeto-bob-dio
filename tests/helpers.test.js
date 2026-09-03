/**
 * helpers.test.js
 * Testes UNITÁRIOS das funções puras de trilhasHelper.js
 * Cobertura: loadTrilhas, findTrilha, listTecnologias,
 *             gerarCodigoVerificacao, formatarDataCertificado,
 *             validateTrilhaOutput, validateDesafioOutput, validateCertificadoOutput
 */

const {
  loadTrilhas,
  findTrilha,
  listTecnologias,
  gerarCodigoVerificacao,
  formatarDataCertificado,
  validateTrilhaOutput,
  validateDesafioOutput,
  validateCertificadoOutput,
} = require('./helpers/trilhasHelper');

const { buildTrilhaOutput, buildDesafioOutput, buildCertificadoOutput } = require('./helpers/outputBuilder');

// ─── Fixture: trilhas reais do JSON ──────────────────────────────────────────
let TRILHAS;
try {
  TRILHAS = loadTrilhas();
} catch (e) {
  throw new Error(`Falha ao carregar data/trilhas.json: ${e.message}`);
}

// ─── Mini framework de asserções ─────────────────────────────────────────────
let passed = 0;
let failed = 0;
const results = [];

function assert(description, condition, detail = '') {
  if (condition) {
    passed++;
    results.push({ status: 'PASS', suite: 'unit', description });
  } else {
    failed++;
    results.push({ status: 'FAIL', suite: 'unit', description, detail });
  }
}

function assertEqual(description, actual, expected) {
  const ok = actual === expected;
  assert(description, ok, ok ? '' : `esperado="${expected}" recebido="${actual}"`);
}

function assertContains(description, haystack, needle) {
  const ok = typeof haystack === 'string' && haystack.includes(needle);
  assert(description, ok, ok ? '' : `"${needle}" não encontrado`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCO 1 — loadTrilhas
// ═══════════════════════════════════════════════════════════════════════════════
assert('loadTrilhas retorna um array', Array.isArray(TRILHAS));
assert('loadTrilhas retorna 30 trilhas', TRILHAS.length === 30);
assert('Primeira trilha tem campo "id"', TRILHAS[0].hasOwnProperty('id'));
assert('Primeira trilha tem campo "tecnologia"', TRILHAS[0].hasOwnProperty('tecnologia'));
assert('Primeira trilha tem campo "badges_disponiveis"', Array.isArray(TRILHAS[0].badges_disponiveis));
assert('Primeira trilha tem campo "lives_ao_vivo"', Array.isArray(TRILHAS[0].lives_ao_vivo));
assert('Primeira trilha tem campo "promocoes"', TRILHAS[0].hasOwnProperty('promocoes'));

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCO 2 — findTrilha
// ═══════════════════════════════════════════════════════════════════════════════
const trilhaJava   = findTrilha(TRILHAS, 'Java');
const trilhaPython = findTrilha(TRILHAS, 'Python');
const trilhaReact  = findTrilha(TRILHAS, 'React');
const trilhaAWS    = findTrilha(TRILHAS, 'AWS');
const trilhaNull   = findTrilha(TRILHAS, 'TecnologiaInexistente999');

assert('findTrilha encontra Java', trilhaJava !== null);
assert('findTrilha encontra Python', trilhaPython !== null);
assert('findTrilha encontra React', trilhaReact !== null);
assert('findTrilha encontra AWS', trilhaAWS !== null);
assert('findTrilha retorna null para tecnologia inexistente', trilhaNull === null);

// Busca case-insensitive
assert('findTrilha aceita busca em minúsculo "java"',  findTrilha(TRILHAS, 'java') !== null);
assert('findTrilha aceita busca em maiúsculo "JAVA"',  findTrilha(TRILHAS, 'JAVA') !== null);
assert('findTrilha aceita busca mista "jAvA"',         findTrilha(TRILHAS, 'jAvA') !== null);

// Busca parcial
assert('findTrilha aceita busca parcial "node"',       findTrilha(TRILHAS, 'node') !== null);
assert('findTrilha aceita busca parcial "angular"',    findTrilha(TRILHAS, 'angular') !== null);
assert('findTrilha aceita busca parcial "machine"',    findTrilha(TRILHAS, 'machine') !== null);

// Dados da trilha retornada
assertEqual('findTrilha Java retorna id=1', trilhaJava.id, 1);
assertEqual('findTrilha Python retorna nivel=Básico', trilhaPython.nivel, 'Básico');
assertEqual('findTrilha React retorna numero_de_modulos=10', trilhaReact.numero_de_modulos, 10);

// Edge cases
assert('findTrilha com null retorna null', findTrilha(TRILHAS, null) === null);
assert('findTrilha com string vazia retorna null', findTrilha(TRILHAS, '') === null);
assert('findTrilha com número retorna null', findTrilha(TRILHAS, 123) === null);

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCO 3 — listTecnologias
// ═══════════════════════════════════════════════════════════════════════════════
const tecnologias = listTecnologias(TRILHAS);

assert('listTecnologias retorna array', Array.isArray(tecnologias));
assertEqual('listTecnologias retorna 30 itens', tecnologias.length, 30);
assert('listTecnologias contém "Java"', tecnologias.includes('Java'));
assert('listTecnologias contém "Python"', tecnologias.includes('Python'));
assert('listTecnologias contém "AWS"', tecnologias.includes('AWS'));
assert('listTecnologias não inclui campos que não sejam string', tecnologias.every(t => typeof t === 'string'));

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCO 4 — gerarCodigoVerificacao
// ═══════════════════════════════════════════════════════════════════════════════
assertEqual('Código id=1, nome="Ana Lima", ano=2025',      gerarCodigoVerificacao(1, 'Ana Lima', 2025),    'DIO-0001-ANA-2025');
assertEqual('Código id=4, nome="Carlos Souza", ano=2025',  gerarCodigoVerificacao(4, 'Carlos Souza', 2025),'DIO-0004-CAR-2025');
assertEqual('Código id=10, nome="Bob", ano=2024',          gerarCodigoVerificacao(10, 'Bob', 2024),        'DIO-0010-BOB-2024');
assertEqual('Código id=100, nome="Zé", ano=2025',          gerarCodigoVerificacao(100, 'Zé', 2025),        'DIO-0100-ZE-2025');

// Prefixo sempre DIO-
assert('Código sempre começa com DIO-', gerarCodigoVerificacao(1, 'Test', 2025).startsWith('DIO-'));

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCO 5 — formatarDataCertificado
// ═══════════════════════════════════════════════════════════════════════════════
const dataFixa = new Date(2025, 0, 15); // 15 de janeiro de 2025
assertEqual('Formata data como "15 de janeiro de 2025"', formatarDataCertificado(dataFixa), '15 de janeiro de 2025');

const dataJulho = new Date(2025, 6, 4); // 4 de julho de 2025
assertEqual('Formata data como "04 de julho de 2025"', formatarDataCertificado(dataJulho), '04 de julho de 2025');

const dataDez = new Date(2024, 11, 31); // 31 de dezembro de 2024
assertEqual('Formata data como "31 de dezembro de 2024"', formatarDataCertificado(dataDez), '31 de dezembro de 2024');

assert('formatarDataCertificado sem argumento retorna string não vazia', formatarDataCertificado().length > 0);

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCO 6 — validateTrilhaOutput
// ═══════════════════════════════════════════════════════════════════════════════
const outputTrilhaValido = buildTrilhaOutput(trilhaJava);
const resultTrilhaValido = validateTrilhaOutput(outputTrilhaValido);
assert('validateTrilhaOutput aceita output válido', resultTrilhaValido.valid);
assertEqual('validateTrilhaOutput: sem campos faltando', resultTrilhaValido.missing.length, 0);

const resultTrilhaInvalido = validateTrilhaOutput('output sem estrutura');
assert('validateTrilhaOutput rejeita output inválido', !resultTrilhaInvalido.valid);
assert('validateTrilhaOutput reporta campos faltando', resultTrilhaInvalido.missing.length > 0);

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCO 7 — validateDesafioOutput
// ═══════════════════════════════════════════════════════════════════════════════
const outputDesafioValido = buildDesafioOutput(trilhaPython, 'Python', 'Algoritmos e Lógica');
const resultDesafioValido = validateDesafioOutput(outputDesafioValido);
assert('validateDesafioOutput aceita output válido', resultDesafioValido.valid);
assertEqual('validateDesafioOutput: sem campos faltando', resultDesafioValido.missing.length, 0);

const resultDesafioInvalido = validateDesafioOutput('texto sem estrutura');
assert('validateDesafioOutput rejeita output inválido', !resultDesafioInvalido.valid);
assert('validateDesafioOutput reporta campos faltando', resultDesafioInvalido.missing.length > 0);

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCO 8 — validateCertificadoOutput
// ═══════════════════════════════════════════════════════════════════════════════
const outputCertValido = buildCertificadoOutput(trilhaReact, 'Maria Santos', new Date(2025, 0, 15));
const resultCertValido = validateCertificadoOutput(outputCertValido);
assert('validateCertificadoOutput aceita output válido', resultCertValido.valid);
assertEqual('validateCertificadoOutput: sem campos faltando', resultCertValido.missing.length, 0);

const resultCertInvalido = validateCertificadoOutput('texto sem estrutura');
assert('validateCertificadoOutput rejeita output inválido', !resultCertInvalido.valid);
assert('validateCertificadoOutput reporta campos faltando', resultCertInvalido.missing.length > 0);

// ─── Exporta resultados ───────────────────────────────────────────────────────
module.exports = { results, passed, failed };
