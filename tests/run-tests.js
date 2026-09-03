/**
 * run-tests.js
 * Runner principal da suite de testes dos slash commands DIO.
 *
 * Executa em ordem:
 *   1. helpers.test.js       — testes unitários das funções puras
 *   2. trilha.flow.test.js   — testes de fluxo do /trilha
 *   3. desafio.flow.test.js  — testes de fluxo do /desafio
 *   4. certificado.flow.test.js — testes de fluxo do /certificado
 *
 * Grava o relatório completo em test-results.txt na raiz do projeto.
 */

const fs   = require('fs');
const path = require('path');

// ─── Executa cada suite isoladamente ─────────────────────────────────────────
const suites = [
  { name: 'Unitários — helpers',        file: './helpers.test.js' },
  { name: 'Fluxo — /trilha',            file: './trilha.flow.test.js' },
  { name: 'Fluxo — /desafio',           file: './desafio.flow.test.js' },
  { name: 'Fluxo — /certificado',       file: './certificado.flow.test.js' },
];

const allResults   = [];
let   totalPassed  = 0;
let   totalFailed  = 0;
const suiteReports = [];

for (const suite of suites) {
  let mod;
  try {
    mod = require(suite.file);
  } catch (e) {
    suiteReports.push({
      name:    suite.name,
      passed:  0,
      failed:  1,
      results: [{ status: 'FAIL', suite: suite.name, description: `Erro ao carregar ${suite.file}`, detail: e.message }],
    });
    totalFailed++;
    continue;
  }

  const { results = [], passed = 0, failed = 0 } = mod;
  totalPassed += passed;
  totalFailed += failed;
  allResults.push(...results);
  suiteReports.push({ name: suite.name, passed, failed, results });
}

const total    = totalPassed + totalFailed;
const coverage = total > 0 ? ((totalPassed / total) * 100).toFixed(2) : '0.00';
const meta     = `${coverage}%`;
const passed70 = parseFloat(coverage) >= 70;

// ─── Monta o relatório em texto ───────────────────────────────────────────────
const SEP  = '═'.repeat(80);
const sep  = '─'.repeat(80);
const now  = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

const lines = [];

lines.push(SEP);
lines.push('  DIO — RELATÓRIO DE TESTES DOS SLASH COMMANDS');
lines.push(`  Gerado em: ${now}`);
lines.push(SEP);
lines.push('');
lines.push('  COMANDOS TESTADOS:');
lines.push('    /trilha      — Consulta de trilha de estudos');
lines.push('    /desafio     — Geração de desafio de código aleatório');
lines.push('    /certificado — Emissão de certificado fictício em Markdown');
lines.push('');
lines.push(SEP);
lines.push('');

// ─── Detalhe por suite ───────────────────────────────────────────────────────
suiteReports.forEach((sr) => {
  const suiteTotal    = sr.passed + sr.failed;
  const suiteCoverage = suiteTotal > 0 ? ((sr.passed / suiteTotal) * 100).toFixed(1) : '0.0';

  lines.push(`  SUITE: ${sr.name}`);
  lines.push(`  Aprovados: ${sr.passed}  |  Reprovados: ${sr.failed}  |  Total: ${suiteTotal}  |  Cobertura: ${suiteCoverage}%`);
  lines.push(sep);

  sr.results.forEach((r) => {
    const icon   = r.status === 'PASS' ? '✔' : '✘';
    const prefix = r.status === 'PASS' ? '  ' : '  ';
    lines.push(`  ${icon} [${r.status}] ${r.description}`);
    if (r.detail) {
      lines.push(`       └─ Detalhe: ${r.detail}`);
    }
  });

  lines.push('');
});

// ─── Resumo executivo ────────────────────────────────────────────────────────
lines.push(SEP);
lines.push('');
lines.push('  RESUMO EXECUTIVO');
lines.push('');

suiteReports.forEach((sr) => {
  const suiteTotal    = sr.passed + sr.failed;
  const suiteCoverage = suiteTotal > 0 ? ((sr.passed / suiteTotal) * 100).toFixed(1) : '0.0';
  const statusIcon    = sr.failed === 0 ? '✔' : (sr.passed / suiteTotal >= 0.7 ? '⚠' : '✘');
  lines.push(`  ${statusIcon}  ${sr.name.padEnd(38)} ${String(sr.passed).padStart(3)} / ${String(suiteTotal).padStart(3)}  (${suiteCoverage}%)`);
});

lines.push('');
lines.push(sep);
lines.push('');
lines.push(`  TOTAL GERAL`);
lines.push(`  ├─ Testes executados : ${total}`);
lines.push(`  ├─ Aprovados         : ${totalPassed}`);
lines.push(`  ├─ Reprovados        : ${totalFailed}`);
lines.push(`  └─ Cobertura         : ${meta}  ${passed70 ? '✔ META DE 70% ATINGIDA' : '✘ META DE 70% NÃO ATINGIDA'}`);
lines.push('');

if (totalFailed > 0) {
  lines.push(sep);
  lines.push('');
  lines.push('  TESTES REPROVADOS:');
  lines.push('');
  allResults
    .filter((r) => r.status === 'FAIL')
    .forEach((r) => {
      lines.push(`  ✘ [${r.suite}] ${r.description}`);
      if (r.detail) lines.push(`       └─ ${r.detail}`);
    });
  lines.push('');
}

lines.push(SEP);
lines.push('  Arquivo gerado automaticamente pelo runner de testes DIO.');
lines.push('  Para re-executar: node tests/run-tests.js');
lines.push(SEP);
lines.push('');

const report = lines.join('\n');

// ─── Saída no console ────────────────────────────────────────────────────────
console.log(report);

// ─── Grava em test-results.txt na raiz ───────────────────────────────────────
const outPath = path.resolve(__dirname, '..', 'test-results.txt');
fs.writeFileSync(outPath, report, 'utf-8');
console.log(`\nRelatório gravado em: ${outPath}`);

// ─── Exit code ───────────────────────────────────────────────────────────────
process.exit(passed70 ? 0 : 1);
