/**
 * certificado.flow.test.js
 * Testes de FLUXO para o slash command /certificado
 * Cobre: código de verificação correto, nome em maiúsculo,
 *        dados reais do JSON, trilha não encontrada,
 *        data de conclusão, badges, múltiplos alunos
 */

const {
  loadTrilhas,
  findTrilha,
  gerarCodigoVerificacao,
  formatarDataCertificado,
  validateCertificadoOutput,
} = require('./helpers/trilhasHelper');

const { buildCertificadoOutput } = require('./helpers/outputBuilder');

// ─── Fixtures ────────────────────────────────────────────────────────────────
const TRILHAS    = loadTrilhas();
const DATA_FIXA  = new Date(2025, 0, 15); // 15 de janeiro de 2025

let passed = 0;
let failed = 0;
const results = [];

function assert(description, condition, detail = '') {
  if (condition) {
    passed++;
    results.push({ status: 'PASS', suite: 'flow:/certificado', description });
  } else {
    failed++;
    results.push({ status: 'FAIL', suite: 'flow:/certificado', description, detail });
  }
}

function assertContains(description, haystack, needle) {
  const ok = typeof haystack === 'string' && haystack.includes(needle);
  assert(description, ok, ok ? '' : `"${needle}" não encontrado no output`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// FLUXO 1 — Certificado gerado para aluno e trilha válidos
// ═══════════════════════════════════════════════════════════════════════════════
const casosCertificado = [
  { nome: 'Ana Lima',     tech: 'Java',    idEsperado: 1  },
  { nome: 'Carlos Souza', tech: 'Python',  idEsperado: 2  },
  { nome: 'Maria Santos', tech: 'React',   idEsperado: 4  },
  { nome: 'Joao Pedro',   tech: 'AWS',     idEsperado: 7  },
  { nome: 'Beatriz',      tech: 'Angular', idEsperado: 3  },
];

casosCertificado.forEach(({ nome, tech, idEsperado }) => {
  const trilha = findTrilha(TRILHAS, tech);
  assert(`/certificado ${nome}/${tech}: trilha encontrada`, trilha !== null);

  if (trilha) {
    const output = buildCertificadoOutput(trilha, nome, DATA_FIXA);

    // Estrutura obrigatória
    const { valid, missing } = validateCertificadoOutput(output);
    assert(
      `/certificado ${nome}/${tech}: output contém todas as seções obrigatórias`,
      valid,
      missing.join(', ')
    );

    // Nome em maiúsculo
    assertContains(
      `/certificado ${nome}/${tech}: nome em maiúsculo`,
      output,
      nome.toUpperCase()
    );

    // Dados reais da trilha
    assertContains(`/certificado ${nome}/${tech}: nome da trilha`, output, trilha.nome);
    assertContains(`/certificado ${nome}/${tech}: tecnologia`,     output, trilha.tecnologia);
    assertContains(`/certificado ${nome}/${tech}: nível`,          output, trilha.nivel);
    assertContains(`/certificado ${nome}/${tech}: XP conquistado`, output, String(trilha.xp_total));
    assertContains(
      `/certificado ${nome}/${tech}: módulos concluídos`,
      output,
      `${trilha.numero_de_modulos} de ${trilha.numero_de_modulos}`
    );

    // Código de verificação
    const codigoEsperado = gerarCodigoVerificacao(idEsperado, nome, 2025);
    assertContains(
      `/certificado ${nome}/${tech}: código de verificação "${codigoEsperado}"`,
      output,
      codigoEsperado
    );

    // Data de conclusão
    assertContains(
      `/certificado ${nome}/${tech}: data de conclusão`,
      output,
      formatarDataCertificado(DATA_FIXA)
    );

    // Badges
    trilha.badges_disponiveis.forEach((badge) => {
      assertContains(`/certificado ${nome}/${tech}: badge "${badge}"`, output, badge);
    });

    // Mensagem de parabéns
    assertContains(`/certificado ${nome}/${tech}: mensagem de parabéns`,  output, `Parabéns, ${nome}!`);
    assertContains(`/certificado ${nome}/${tech}: hashtag #DIO`,          output, '#DIO');
    assertContains(`/certificado ${nome}/${tech}: hashtag #DevEmCrescimento`, output, '#DevEmCrescimento');
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// FLUXO 2 — Código de verificação: formato e unicidade
// ═══════════════════════════════════════════════════════════════════════════════

// Formato DIO-XXXX-XXX-AAAA
const codigoRegex = /^DIO-\d{4}-[A-Z]+-\d{4}$/;
TRILHAS.slice(0, 10).forEach((trilha) => {
  const codigo = gerarCodigoVerificacao(trilha.id, 'Teste User', 2025);
  assert(
    `/certificado código: trilha id=${trilha.id} segue formato DIO-XXXX-XXX-AAAA`,
    codigoRegex.test(codigo),
    `gerado: "${codigo}"`
  );
});

// Unicidade: ids diferentes → códigos diferentes
const codA = gerarCodigoVerificacao(1,  'Ana Lima', 2025);
const codB = gerarCodigoVerificacao(2,  'Ana Lima', 2025);
const codC = gerarCodigoVerificacao(1,  'Carlos',   2025);
assert('/certificado código: ids diferentes → códigos diferentes', codA !== codB);
assert('/certificado código: nomes diferentes → códigos diferentes', codA !== codC);

// ═══════════════════════════════════════════════════════════════════════════════
// FLUXO 3 — Trilha não encontrada
// ═══════════════════════════════════════════════════════════════════════════════
const trilhaInexistente = findTrilha(TRILHAS, 'TecnologiaFake999');
assert('/certificado trilha inexistente: findTrilha retorna null', trilhaInexistente === null);

// O fluxo de /certificado não deve gerar certificado se trilha === null
// Verificamos que buildCertificadoOutput lança erro quando trilha é null
let lancouErro = false;
try {
  buildCertificadoOutput(null, 'Aluno Teste', DATA_FIXA);
} catch (e) {
  lancouErro = true;
}
assert('/certificado trilha null: buildCertificadoOutput lança erro', lancouErro);

// ═══════════════════════════════════════════════════════════════════════════════
// FLUXO 4 — Nome em maiúsculo (variações)
// ═══════════════════════════════════════════════════════════════════════════════
const trilhaJava = findTrilha(TRILHAS, 'Java');
const nomesVariados = [
  'ana lima',
  'ANA LIMA',
  'Ana Lima',
  'aNA lIMA',
  'Leonardo da Silva Ferreira',
];

nomesVariados.forEach((nome) => {
  const output = buildCertificadoOutput(trilhaJava, nome, DATA_FIXA);
  assertContains(
    `/certificado maiúsculo: "${nome}" → "${nome.toUpperCase()}"`,
    output,
    nome.toUpperCase()
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// FLUXO 5 — Integridade para todas as 30 trilhas
// ═══════════════════════════════════════════════════════════════════════════════
TRILHAS.forEach((trilha) => {
  const output = buildCertificadoOutput(trilha, 'Aluno DIO', DATA_FIXA);
  const { valid, missing } = validateCertificadoOutput(output);
  assert(
    `/certificado ALL: trilha id=${trilha.id} "${trilha.nome}" output válido`,
    valid,
    missing.join(', ')
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// FLUXO 6 — DIO branding sempre presente
// ═══════════════════════════════════════════════════════════════════════════════
const outputBranding = buildCertificadoOutput(findTrilha(TRILHAS, 'React'), 'Test User', DATA_FIXA);
assertContains('/certificado branding: título CERTIFICADO DE CONCLUSÃO', outputBranding, 'CERTIFICADO DE CONCLUSÃO');
assertContains('/certificado branding: Digital Innovation One',          outputBranding, 'Digital Innovation One');
assertContains('/certificado branding: — DIO presente',                  outputBranding, 'DIO');

// ─── Exporta resultados ───────────────────────────────────────────────────────
module.exports = { results, passed, failed };
