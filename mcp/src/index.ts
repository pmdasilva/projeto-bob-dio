#!/usr/bin/env node
/**
 * DIO MCP Server
 * Expõe as ferramentas de trilhas, desafios e certificados via protocolo MCP.
 * Transporte: stdio (padrão para integração com Bob/Claude Desktop).
 *
 * Ferramentas disponíveis:
 *   - buscar_trilha     : retorna o plano de estudos de uma tecnologia
 *   - listar_trilhas    : lista todas as trilhas disponíveis
 *   - gerar_desafio     : gera um desafio de código para uma tecnologia
 *   - gerar_certificado : gera um certificado fictício em Markdown
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ─── Caminho absoluto para data/trilhas.json ─────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH  = resolve(__dirname, '../../data/trilhas.json');

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface Promocao {
  desconto: string | null;
  validade: string | null;
  descricao: string;
}

interface Live {
  titulo: string;
  data: string;
  horario: string;
  instrutor: string;
}

interface Trilha {
  id: number;
  nome: string;
  tecnologia: string;
  nivel: string;
  numero_de_modulos: number;
  xp_total: number;
  badges_disponiveis: string[];
  promocoes: Promocao;
  lives_ao_vivo: Live[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadTrilhas(): Trilha[] {
  const raw  = readFileSync(DATA_PATH, 'utf-8');
  const data = JSON.parse(raw) as { trilhas: Trilha[] };
  return data.trilhas;
}

function findTrilha(trilhas: Trilha[], termo: string): Trilha | null {
  const t = termo.trim().toLowerCase();
  return (
    trilhas.find(
      (tr) =>
        tr.tecnologia.toLowerCase().includes(t) ||
        tr.nome.toLowerCase().includes(t)
    ) ?? null
  );
}

function gerarCodigoVerificacao(id: number, nome: string, ano: number): string {
  const idFmt    = String(id).padStart(4, '0');
  const semAcent = nome.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const iniciais = semAcent.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
  return `DIO-${idFmt}-${iniciais}-${ano}`;
}

function formatarData(data: Date): string {
  const meses = [
    'janeiro','fevereiro','março','abril','maio','junho',
    'julho','agosto','setembro','outubro','novembro','dezembro',
  ];
  const dia = String(data.getDate()).padStart(2, '0');
  return `${dia} de ${meses[data.getMonth()]} de ${data.getFullYear()}`;
}

function buildTrilhaOutput(t: Trilha): string {
  const badges = t.badges_disponiveis.map((b) => `🥇 ${b}`).join('\n');

  const lives = t.lives_ao_vivo
    .map((l) => {
      const [ano, mes, dia] = l.data.split('-');
      return `- **${l.titulo}** — ${dia}/${mes}/${ano} às ${l.horario} com ${l.instrutor}`;
    })
    .join('\n');

  const promo =
    !t.promocoes.desconto || t.promocoes.desconto === '0%'
      ? 'Nenhuma promoção ativa no momento.'
      : `🏷️ **${t.promocoes.desconto} de desconto** — ${t.promocoes.descricao} (válido até ${t.promocoes.validade})`;

  const modulos = Array.from({ length: t.numero_de_modulos }, (_, i) => {
    const n = i + 1;
    return `| ${n} | Módulo ${n} — ${t.tecnologia} | Conteúdo progressivo do módulo ${n} |`;
  }).join('\n');

  return `# 🎓 Trilha: ${t.nome}

**Tecnologia:** ${t.tecnologia}
**Nível:** ${t.nivel}
**Total de Módulos:** ${t.numero_de_modulos}
**XP Total:** ${t.xp_total} XP

---

## 📚 Plano de Estudos

| # | Módulo | Descrição |
|---|--------|-----------|
${modulos}

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

> ✅ Ao concluir, use a ferramenta \`gerar_certificado\` com seu nome e a tecnologia "${t.tecnologia}".`;
}

function buildDesafioOutput(t: Trilha | null, tecnologia: string, categoria: string): string {
  const nivel    = t?.nivel ?? 'Intermediário';
  const xpMap:   Record<string, number> = { 'Básico': 500, 'Intermediário': 1500, 'Avançado': 3000 };
  const tempoMap: Record<string, string> = { 'Básico': '30 min', 'Intermediário': '1h', 'Avançado': '2h' };
  const xp    = xpMap[nivel]    ?? 1500;
  const tempo = tempoMap[nivel] ?? '1h';

  return `# ⚔️ Desafio de Código — ${tecnologia}

**Categoria:** ${categoria}
**Dificuldade:** ${nivel} — baseada no nível da trilha
**XP ao concluir:** ${xp} XP
**Tempo estimado:** ${tempo}

---

## 📋 Enunciado

Implemente uma solução utilizando **${tecnologia}** para resolver o problema proposto na categoria **${categoria}**.

A solução deve ser eficiente e seguir as boas práticas da tecnologia. Não utilize bibliotecas externas além das nativas da linguagem/plataforma.

Requisitos obrigatórios:
- O código deve ser legível e bem comentado
- Considere casos de borda (lista vazia, valores nulos, entradas inválidas)
- Escreva pelo menos um teste para validar a solução principal

---

## 📥 Entrada Esperada

Uma estrutura de dados compatível com o problema da categoria **${categoria}** em **${tecnologia}**.

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
- Pense na complexidade do algoritmo antes de implementar (prefira O(n) quando possível)
- Valide os casos de borda antes de submeter

---

## 🧪 Casos de Teste

| # | Entrada | Saída Esperada |
|---|---------|----------------|
| 1 | [1, 2, 3] | 6 |
| 2 | [] | 0 |
| 3 | [-1, -2, -3] | -6 |

---

> 💬 Cole sua solução no chat para revisão! Quando terminar, use \`gerar_certificado\` para emitir seu certificado.`;
}

function buildCertificadoOutput(t: Trilha, nome: string, data: Date): string {
  const ano      = data.getFullYear();
  const codigo   = gerarCodigoVerificacao(t.id, nome, ano);
  const dateFmt  = formatarData(data);
  const maiusulo = nome.toUpperCase();
  const badges   = t.badges_disponiveis.map((b) => `🥇 ${b}`).join('\n');

  return `---

<div align="center">

# 🏆 CERTIFICADO DE CONCLUSÃO

### *Digital Innovation One — DIO*

---

Este certificado é conferido a

# ${maiusulo}

por ter concluído com êxito a trilha de estudos

## ${t.nome}

**Tecnologia:** ${t.tecnologia}
**Nível:** ${t.nivel}
**Módulos Concluídos:** ${t.numero_de_modulos} de ${t.numero_de_modulos}
**XP Conquistado:** ${t.xp_total} XP

---

🏅 **Badges Conquistados:**

${badges}

---

📅 **Data de Conclusão:** ${dateFmt}

🔐 **Código de Verificação:** \`${codigo}\`

---

*"O aprendizado contínuo é o caminho para a excelência em tecnologia."*

**— Digital Innovation One**

[![DIO](https://img.shields.io/badge/DIO-Certificado%20Verificado-blue?style=for-the-badge)](https://dio.me)

</div>

---

🎉 Parabéns, ${nome}! Seu certificado foi gerado com sucesso.
Compartilhe sua conquista no LinkedIn com a hashtag #DIO #DevEmCrescimento!`;
}

// ─── Categorias de desafio ────────────────────────────────────────────────────
const CATEGORIAS = [
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
] as const;

// ─── Servidor MCP ─────────────────────────────────────────────────────────────
const server = new McpServer({
  name: 'dio-mcp-server',
  version: '1.0.0',
});

// ────────────────────────────────────────────────────────────────────────────
// FERRAMENTA 1 — listar_trilhas
// ────────────────────────────────────────────────────────────────────────────
server.registerTool(
  'listar_trilhas',
  {
    title: 'Listar Trilhas DIO',
    description:
      'Lista todas as trilhas de aprendizado disponíveis na plataforma DIO com nome, tecnologia e nível.',
    inputSchema: z.object({}),
  },
  async () => {
    try {
      const trilhas = loadTrilhas();
      const linhas  = trilhas.map(
        (t) => `| ${t.id} | ${t.nome} | ${t.tecnologia} | ${t.nivel} | ${t.xp_total} XP |`
      );

      const tabela = `# 📚 Trilhas Disponíveis na DIO

Total: **${trilhas.length} trilhas**

| ID | Trilha | Tecnologia | Nível | XP |
|----|--------|-----------|-------|-----|
${linhas.join('\n')}

> Use a ferramenta \`buscar_trilha\` com o nome de uma tecnologia para ver o plano completo.`;

      return { content: [{ type: 'text' as const, text: tabela }] };
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: `Erro ao carregar trilhas: ${String(err)}` }],
        isError: true,
      };
    }
  }
);

// ────────────────────────────────────────────────────────────────────────────
// FERRAMENTA 2 — buscar_trilha
// ────────────────────────────────────────────────────────────────────────────
server.registerTool(
  'buscar_trilha',
  {
    title: 'Buscar Trilha de Estudos',
    description:
      'Busca uma trilha pelo nome da tecnologia e retorna o plano de estudos completo com módulos, badges, lives e promoções.',
    inputSchema: z.object({
      tecnologia: z
        .string()
        .describe(
          'Nome da tecnologia ou parte do nome. Ex: "Java", "React", "Python", "AWS", "Docker"'
        ),
    }),
  },
  async ({ tecnologia }) => {
    try {
      const trilhas = loadTrilhas();
      const trilha  = findTrilha(trilhas, tecnologia);

      if (!trilha) {
        const disponiveis = trilhas.map((t) => `- ${t.tecnologia}`).join('\n');
        return {
          content: [
            {
              type: 'text' as const,
              text: `❌ Nenhuma trilha encontrada para **"${tecnologia}"**.\n\nTecnologias disponíveis:\n${disponiveis}`,
            },
          ],
        };
      }

      return { content: [{ type: 'text' as const, text: buildTrilhaOutput(trilha) }] };
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: `Erro ao buscar trilha: ${String(err)}` }],
        isError: true,
      };
    }
  }
);

// ────────────────────────────────────────────────────────────────────────────
// FERRAMENTA 3 — gerar_desafio
// ────────────────────────────────────────────────────────────────────────────
server.registerTool(
  'gerar_desafio',
  {
    title: 'Gerar Desafio de Código',
    description:
      'Gera um desafio de código aleatório calibrado ao nível da trilha correspondente. Se a tecnologia não estiver cadastrada, usa nível Intermediário.',
    inputSchema: z.object({
      tecnologia: z
        .string()
        .describe('Nome da tecnologia para o desafio. Ex: "Java", "React", "Python"'),
      categoria: z
        .string()
        .optional()
        .describe(
          `Categoria do desafio (opcional). Opções: ${CATEGORIAS.join(', ')}. Se omitido, uma categoria é sorteada.`
        ),
    }),
  },
  async ({ tecnologia, categoria }) => {
    try {
      const trilhas = loadTrilhas();
      const trilha  = findTrilha(trilhas, tecnologia);

      // Sorteia categoria se não fornecida
      const catFinal =
        categoria && CATEGORIAS.includes(categoria as typeof CATEGORIAS[number])
          ? categoria
          : CATEGORIAS[Math.floor(Math.random() * CATEGORIAS.length)];

      return {
        content: [
          { type: 'text' as const, text: buildDesafioOutput(trilha, tecnologia, catFinal) },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: `Erro ao gerar desafio: ${String(err)}` }],
        isError: true,
      };
    }
  }
);

// ────────────────────────────────────────────────────────────────────────────
// FERRAMENTA 4 — gerar_certificado
// ────────────────────────────────────────────────────────────────────────────
server.registerTool(
  'gerar_certificado',
  {
    title: 'Gerar Certificado de Conclusão',
    description:
      'Gera um certificado fictício em Markdown para o aluno que concluiu uma trilha DIO. Usa dados reais do JSON da trilha.',
    inputSchema: z.object({
      nome: z
        .string()
        .describe('Nome completo do aluno que receberá o certificado. Ex: "Ana Lima"'),
      tecnologia: z
        .string()
        .describe('Tecnologia da trilha concluída. Ex: "React", "Python", "Java"'),
    }),
  },
  async ({ nome, tecnologia }) => {
    try {
      const trilhas = loadTrilhas();
      const trilha  = findTrilha(trilhas, tecnologia);

      if (!trilha) {
        const disponiveis = trilhas.map((t) => `- ${t.tecnologia}`).join('\n');
        return {
          content: [
            {
              type: 'text' as const,
              text: `❌ Trilha **"${tecnologia}"** não encontrada. Não é possível gerar o certificado.\n\nTrilhas disponíveis:\n${disponiveis}`,
            },
          ],
        };
      }

      const certificado = buildCertificadoOutput(trilha, nome, new Date());
      return { content: [{ type: 'text' as const, text: certificado }] };
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: `Erro ao gerar certificado: ${String(err)}` }],
        isError: true,
      };
    }
  }
);

// ─── Bootstrap ────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[DIO MCP Server] Conectado via stdio. Aguardando requisições...');
}

main().catch((err) => {
  console.error('[DIO MCP Server] Erro fatal:', err);
  process.exit(1);
});
