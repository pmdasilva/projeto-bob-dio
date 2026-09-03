/**
 * outputBuilder.js
 * Funções que montam o output simulado de cada slash command.
 * Replicam exatamente o template definido nos arquivos .bob/commands/*.md
 * e são usadas pelos testes de fluxo para verificar o resultado completo.
 */

const { gerarCodigoVerificacao, formatarDataCertificado } = require('./trilhasHelper');

/**
 * Constrói o output simulado do comando /trilha.
 * @param {Object} trilha  - objeto de trilha do JSON
 * @returns {string}
 */
function buildTrilhaOutput(trilha) {
  const badges = trilha.badges_disponiveis
    .map((b) => `🥇 ${b}`)
    .join('\n');

  const lives = trilha.lives_ao_vivo
    .map((l) => {
      const [ano, mes, dia] = l.data.split('-');
      return `- **${l.titulo}** — ${dia}/${mes}/${ano} às ${l.horario} com ${l.instrutor}`;
    })
    .join('\n');

  const promo =
    !trilha.promocoes.desconto || trilha.promocoes.desconto === '0%'
      ? 'Nenhuma promoção ativa no momento.'
      : `🏷️ **${trilha.promocoes.desconto} de desconto** — ${trilha.promocoes.descricao} (válido até ${trilha.promocoes.validade})`;

  // Gera linhas da tabela de módulos proporcionalmente ao numero_de_modulos
  const linhasModulos = Array.from({ length: trilha.numero_de_modulos }, (_, i) => {
    const idx = i + 1;
    return `| ${idx} | Módulo ${idx} de ${trilha.tecnologia} | Conteúdo progressivo do módulo ${idx} |`;
  }).join('\n');

  return `# 🎓 Trilha: ${trilha.nome}

**Tecnologia:** ${trilha.tecnologia}
**Nível:** ${trilha.nivel}
**Total de Módulos:** ${trilha.numero_de_modulos}
**XP Total:** ${trilha.xp_total} XP

---

## 📚 Plano de Estudos

| # | Módulo | Descrição |
|---|--------|-----------|
${linhasModulos}

---

## 🏅 Badges Disponíveis

${badges}

---

## 📡 Próximas Lives ao Vivo

${lives}

---

## 🎁 Promoção Ativa

${promo}

---

> ✅ Boa sorte na sua jornada! Ao concluir, use \`/certificado <seu nome> ${trilha.tecnologia}\` para gerar seu certificado.`;
}

/**
 * Constrói o output simulado do comando /desafio.
 * @param {Object} trilha     - objeto de trilha do JSON (pode ser null para tecnologia desconhecida)
 * @param {string} tecnologia - tecnologia informada pelo usuário
 * @param {string} categoria  - categoria sorteada
 * @returns {string}
 */
function buildDesafioOutput(trilha, tecnologia, categoria) {
  const nivel = trilha ? trilha.nivel : 'Intermediário';
  const xpMap = { 'Básico': 500, 'Intermediário': 1500, 'Avançado': 3000 };
  const tempoMap = { 'Básico': '30 min', 'Intermediário': '1h', 'Avançado': '2h' };
  const xp = xpMap[nivel] || 1500;
  const tempo = tempoMap[nivel] || '1h';

  return `# ⚔️ Desafio de Código — ${tecnologia}

**Categoria:** ${categoria}
**Dificuldade:** ${nivel} — baseada no nível da trilha
**XP ao concluir:** ${xp} XP
**Tempo estimado:** ${tempo}

---

## 📋 Enunciado

Implemente uma solução utilizando ${tecnologia} para resolver o problema proposto na categoria **${categoria}**.

A solução deve ser eficiente e seguir as boas práticas da tecnologia. Não utilize bibliotecas externas além das nativas.

---

## 📥 Entrada Esperada

Uma lista de valores ou estrutura de dados relevante ao problema.

**Exemplo:**
\`\`\`
[1, 2, 3, 4, 5]
\`\`\`

## 📤 Saída Esperada

O resultado processado conforme a lógica implementada.

**Exemplo:**
\`\`\`
15
\`\`\`

---

## 💡 Dicas

- Consulte a documentação oficial de ${tecnologia}
- Pense na complexidade do algoritmo antes de implementar
- Escreva testes para os casos de borda

---

## 🧪 Casos de Teste

| # | Entrada | Saída Esperada |
|---|---------|----------------|
| 1 | [1, 2, 3] | 6 |
| 2 | [] | 0 |
| 3 | [-1, -2, -3] | -6 |

---

> 💬 Cole sua solução no chat para revisão! Quando terminar, use \`/certificado <seu nome> ${tecnologia}\` para gerar seu certificado.`;
}

/**
 * Constrói o output simulado do comando /certificado.
 * @param {Object} trilha - objeto de trilha do JSON
 * @param {string} nome   - nome do aluno
 * @param {Date}   [data] - data de conclusão (padrão: hoje)
 * @returns {string}
 */
function buildCertificadoOutput(trilha, nome, data) {
  const ano = (data || new Date()).getFullYear();
  const codigo = gerarCodigoVerificacao(trilha.id, nome, ano);
  const dataFormatada = formatarDataCertificado(data);
  const nomeMaiusculo = nome.toUpperCase();
  const badges = trilha.badges_disponiveis.map((b) => `🥇 ${b}`).join('\n');

  return `---

<div align="center">

# 🏆 CERTIFICADO DE CONCLUSÃO

### *Digital Innovation One — DIO*

---

Este certificado é conferido a

# ${nomeMaiusculo}

por ter concluído com êxito a trilha de estudos

## ${trilha.nome}

**Tecnologia:** ${trilha.tecnologia}
**Nível:** ${trilha.nivel}
**Módulos Concluídos:** ${trilha.numero_de_modulos} de ${trilha.numero_de_modulos}
**XP Conquistado:** ${trilha.xp_total} XP

---

🏅 **Badges Conquistados:**

${badges}

---

📅 **Data de Conclusão:** ${dataFormatada}

🔐 **Código de Verificação:** \`${codigo}\`

---

*"O aprendizado contínuo é o caminho para a excelência em tecnologia."*

**— Digital Innovation One**

</div>

---

🎉 Parabéns, ${nome}! Seu certificado foi gerado com sucesso.
Compartilhe sua conquista no LinkedIn com a hashtag #DIO #DevEmCrescimento!`;
}

module.exports = { buildTrilhaOutput, buildDesafioOutput, buildCertificadoOutput };
