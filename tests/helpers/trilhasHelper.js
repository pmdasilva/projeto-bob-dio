/**
 * trilhasHelper.js
 * Funções puras que os slash commands usam internamente.
 * Testadas de forma unitária em helpers.test.js
 */

const fs = require('fs');
const path = require('path');

/**
 * Carrega e parseia o arquivo trilhas.json.
 * @param {string} [filePath] - caminho opcional (facilita testes com mocks)
 * @returns {Array} lista de trilhas
 */
function loadTrilhas(filePath) {
  const target = filePath || path.resolve(__dirname, '../../data/trilhas.json');
  const raw = fs.readFileSync(target, 'utf-8');
  const parsed = JSON.parse(raw);
  return parsed.trilhas;
}

/**
 * Busca uma trilha pelo nome da tecnologia.
 * Aceita correspondência parcial e ignora maiúsculas/minúsculas.
 * @param {Array}  trilhas    - lista de trilhas carregada do JSON
 * @param {string} tecnologia - termo de busca do usuário
 * @returns {Object|null} trilha encontrada ou null
 */
function findTrilha(trilhas, tecnologia) {
  if (!tecnologia || typeof tecnologia !== 'string') return null;
  const termo = tecnologia.trim().toLowerCase();
  return (
    trilhas.find(
      (t) =>
        t.tecnologia.toLowerCase().includes(termo) ||
        t.nome.toLowerCase().includes(termo)
    ) || null
  );
}

/**
 * Lista todas as tecnologias disponíveis no JSON.
 * @param {Array} trilhas
 * @returns {string[]}
 */
function listTecnologias(trilhas) {
  return trilhas.map((t) => t.tecnologia);
}

/**
 * Gera o código de verificação do certificado.
 * Formato: DIO-{id em 4 dígitos}-{3 primeiras letras do nome em maiúsculo}-{ano}
 * @param {number} id   - id da trilha
 * @param {string} nome - nome do aluno
 * @param {number} ano  - ano de conclusão
 * @returns {string}
 */
function gerarCodigoVerificacao(id, nome, ano) {
  const idFormatado = String(id).padStart(4, '0');
  // Remove acentos antes de extrair as iniciais
  const semAcento = nome
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // remove diacríticos
  const iniciais = semAcento
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 3)
    .toUpperCase();
  return `DIO-${idFormatado}-${iniciais}-${ano}`;
}

/**
 * Formata a data no padrão "DD de [mês por extenso] de AAAA".
 * @param {Date} [data] - objeto Date (padrão: hoje)
 * @returns {string}
 */
function formatarDataCertificado(data) {
  const meses = [
    'janeiro','fevereiro','março','abril','maio','junho',
    'julho','agosto','setembro','outubro','novembro','dezembro',
  ];
  const d = data || new Date();
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = meses[d.getMonth()];
  const ano = d.getFullYear();
  return `${dia} de ${mes} de ${ano}`;
}

/**
 * Valida se o output de /trilha contém as seções obrigatórias.
 * @param {string} output
 * @returns {{ valid: boolean, missing: string[] }}
 */
function validateTrilhaOutput(output) {
  const required = [
    '# 🎓 Trilha:',
    '**Tecnologia:**',
    '**Nível:**',
    '**Total de Módulos:**',
    '**XP Total:**',
    '## 📚 Plano de Estudos',
    '## 🏅 Badges Disponíveis',
    '## 📡 Próximas Lives ao Vivo',
    '## 🎁 Promoção Ativa',
  ];
  const missing = required.filter((s) => !output.includes(s));
  return { valid: missing.length === 0, missing };
}

/**
 * Valida se o output de /desafio contém as seções obrigatórias.
 * @param {string} output
 * @returns {{ valid: boolean, missing: string[] }}
 */
function validateDesafioOutput(output) {
  const required = [
    '# ⚔️ Desafio de Código',
    '**Categoria:**',
    '**Dificuldade:**',
    '**XP ao concluir:**',
    '**Tempo estimado:**',
    '## 📋 Enunciado',
    '## 📥 Entrada Esperada',
    '## 📤 Saída Esperada',
    '## 💡 Dicas',
    '## 🧪 Casos de Teste',
  ];
  const missing = required.filter((s) => !output.includes(s));
  return { valid: missing.length === 0, missing };
}

/**
 * Valida se o output de /certificado contém as seções obrigatórias.
 * @param {string} output
 * @returns {{ valid: boolean, missing: string[] }}
 */
function validateCertificadoOutput(output) {
  const required = [
    '# 🏆 CERTIFICADO DE CONCLUSÃO',
    'Digital Innovation One',
    '**Tecnologia:**',
    '**Nível:**',
    '**Módulos Concluídos:**',
    '**XP Conquistado:**',
    '🏅 **Badges Conquistados:**',
    '**Data de Conclusão:**',
    '**Código de Verificação:**',
    'DIO-',
  ];
  const missing = required.filter((s) => !output.includes(s));
  return { valid: missing.length === 0, missing };
}

module.exports = {
  loadTrilhas,
  findTrilha,
  listTecnologias,
  gerarCodigoVerificacao,
  formatarDataCertificado,
  validateTrilhaOutput,
  validateDesafioOutput,
  validateCertificadoOutput,
};
