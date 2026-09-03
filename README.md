# 🤖 Projeto Bob DIO — Plataforma de Trilhas com IA

> Projeto desenvolvido inteiramente com **IBM Bob AI** como par de programação, demonstrando como uma IA pode ser usada para construir uma plataforma real de trilhas de aprendizado, desafios de código e certificados — do zero à API.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Fluxograma do Sistema](#-fluxograma-do-sistema)
- [Como Inicializar o Projeto](#-como-inicializar-o-projeto)
- [Slash Commands](#-slash-commands)
- [MCP Server — API via Protocolo MCP](#-mcp-server--api-via-protocolo-mcp)
- [Suite de Testes](#-suite-de-testes)
- [Exemplos de Uso](#-exemplos-de-uso)
- [Dicas de Uso com o Bob AI](#-dicas-de-uso-com-o-bob-ai)
- [Insights para Futuros Profissionais](#-insights-para-futuros-profissionais)
- [Histórico de Prompts](#-histórico-de-prompts)

---

## 🎯 Visão Geral

Este projeto nasceu de uma conversa com o **IBM Bob AI** e evoluiu em sessões incrementais, onde cada prompt do usuário adicionou uma camada nova à plataforma. O resultado é uma aplicação completa que:

- 📚 **Consulta trilhas de aprendizado** a partir de um JSON com 30 tecnologias
- ⚔️ **Gera desafios de código** calibrados ao nível de cada trilha
- 🏆 **Emite certificados fictícios** em Markdown com código de verificação único
- 🔌 **Expõe tudo via servidor MCP** — acessível por qualquer cliente compatível com o protocolo Model Context Protocol
- ✅ **Suite de testes com 387 casos** e 100% de cobertura

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| IA / Assistente | IBM Bob AI |
| Protocolo de integração | Model Context Protocol (MCP) |
| Linguagem do servidor | TypeScript + Node.js v24 |
| Validação de esquemas | Zod v4 |
| SDK MCP | `@modelcontextprotocol/sdk` v1.30 |
| Dados | JSON estático (`data/trilhas.json`) |
| Testes | JavaScript puro (runner customizado, sem frameworks) |
| Slash Commands | Markdown (`.bob/commands/`) |

---

## 📁 Estrutura do Projeto

```
projeto-bob-dio/
│
├── .bob/                          # Configurações do Bob AI
│   ├── commands/                  # Slash commands customizados
│   │   ├── trilha.md              # /trilha <tecnologia>
│   │   ├── desafio.md             # /desafio <tecnologia>
│   │   └── certificado.md         # /certificado <nome> <tecnologia>
│   └── mcp.json                   # Registro do servidor MCP (escopo workspace)
│
├── data/
│   └── trilhas.json               # 30 trilhas com módulos, badges, lives e promoções
│
├── docs/                          # Documentação e certificados gerados
│
├── mcp/                           # Servidor MCP (TypeScript)
│   ├── src/
│   │   └── index.ts               # Código-fonte — 4 ferramentas MCP
│   ├── build/
│   │   └── index.js               # Compilado (gerado por `npm run build`)
│   ├── package.json
│   └── tsconfig.json
│
├── tests/                         # Suite de testes
│   ├── helpers/
│   │   ├── trilhasHelper.js       # Funções puras testáveis
│   │   └── outputBuilder.js       # Builders de output dos comandos
│   ├── helpers.test.js            # 51 testes unitários
│   ├── trilha.flow.test.js        # 125 testes de fluxo do /trilha
│   ├── desafio.flow.test.js       # 76 testes de fluxo do /desafio
│   ├── certificado.flow.test.js   # 135 testes de fluxo do /certificado
│   └── run-tests.js               # Runner — executa tudo e grava test-results.txt
│
├── .bobignore                     # Arquivos ignorados pelo Bob AI
├── .gitignore
├── test-results.txt               # Relatório de testes (gerado automaticamente)
└── README.md
```

---

## 🔄 Fluxograma do Sistema

```mermaid
flowchart TD
    U([👤 Usuário]) -->|digita comando| BOB[🤖 Bob AI]

    BOB --> SC{Tipo de\ninteração}

    SC -->|Slash Command| CMD[.bob/commands/]
    SC -->|Ferramenta MCP| MCP[MCP Server\nmcp/build/index.js]
    SC -->|Pergunta direta| BOB

    CMD --> C1[/trilha]
    CMD --> C2[/desafio]
    CMD --> C3[/certificado]

    MCP --> T1[listar_trilhas]
    MCP --> T2[buscar_trilha]
    MCP --> T3[gerar_desafio]
    MCP --> T4[gerar_certificado]

    C1 --> JSON[(data/trilhas.json)]
    C2 --> JSON
    C3 --> JSON
    T1 --> JSON
    T2 --> JSON
    T3 --> JSON
    T4 --> JSON

    JSON -->|30 trilhas| PROC[Processamento\nfindTrilha · buildOutput\ngerarCodigo · formatarData]

    PROC --> R1[📚 Plano de Estudos\ncom módulos, badges\nlives e promoções]
    PROC --> R2[⚔️ Desafio de Código\ncategoria sorteada\ncasos de teste]
    PROC --> R3[🏆 Certificado Markdown\nDIO-XXXX-XXX-AAAA]

    R1 --> U
    R2 --> U
    R3 --> U

    style U fill:#4A90D9,color:#fff
    style BOB fill:#FF6B35,color:#fff
    style JSON fill:#2ECC71,color:#fff
    style MCP fill:#9B59B6,color:#fff
    style CMD fill:#3498DB,color:#fff
```

---

## 🚀 Como Inicializar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org) **v18 ou superior** (testado com v24.15.0)
- [IBM Bob AI](https://dio.me) instalado e configurado no VS Code
- Git

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd projeto-bob-dio
```

### 2. Instale as dependências do servidor MCP

```bash
cd mcp
npm install
```

> **Windows com PowerShell restrito:** se encontrar erro de execução de scripts, use:
> ```powershell
> & "C:\Program Files\nodejs\node.exe" "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install
> ```

### 3. Compile o servidor MCP

```bash
npm run build
```

O arquivo `mcp/build/index.js` será gerado.

### 4. Abra o projeto no VS Code com Bob AI

Ao abrir o workspace, o Bob AI detecta automaticamente o arquivo `.bob/mcp.json` e conecta o servidor MCP. Verifique no painel **MCP** do Bob se `dio-mcp-server` aparece como **conectado**.

### 5. (Opcional) Execute os testes

```bash
node tests/run-tests.js
```

O relatório será gravado em `test-results.txt`.

---

## 💬 Slash Commands

Os slash commands são arquivos Markdown em `.bob/commands/` que ensinam o Bob AI a responder a padrões específicos de entrada. Digite `/` no chat do Bob para ver todos disponíveis.

### `/trilha <tecnologia>`

Consulta o plano de estudos de uma tecnologia a partir do `data/trilhas.json`.

```
/trilha React
/trilha Python
/trilha AWS
/trilha docker        ← busca parcial, case-insensitive
/trilha machine       ← encontra "Python / Machine Learning"
```

**O que retorna:**
- Nome e nível da trilha
- Tabela de módulos proporcional ao número real de módulos
- Badges conquistáveis
- Próximas lives ao vivo com data, horário e instrutor
- Promoção ativa (se houver)

---

### `/desafio <tecnologia>`

Gera um desafio de código aleatório calibrado ao nível da trilha.

```
/desafio Java
/desafio React
/desafio SQL
/desafio COBOL        ← tecnologia fora do JSON, usa nível Intermediário
```

**Categorias sorteadas aleatoriamente:**
- Algoritmos e Lógica
- Estruturas de Dados
- Manipulação de Strings
- Operações com Arrays/Listas
- Orientação a Objetos
- Consumo de API / HTTP
- Banco de Dados / Queries
- Testes Unitários
- Refatoração de Código
- Mini Projeto Prático

**Calibragem por nível:**

| Nível | XP | Tempo |
|---|---|---|
| Básico | 500 XP | 30 min |
| Intermediário | 1500 XP | 1h |
| Avançado | 3000 XP | 2h |

---

### `/certificado <nome> <tecnologia>`

Emite um certificado fictício em Markdown para o aluno.

```
/certificado "Ana Lima" React
/certificado "Carlos Souza" Python
/certificado "Maria Santos" AWS
```

**Formato do código de verificação:**
```
DIO-{id em 4 dígitos}-{3 primeiras letras do nome sem acento}-{ano}

Exemplos:
  Ana Lima    → React  (id=4)  → DIO-0004-ANA-2025
  Carlos Souza → Python (id=2) → DIO-0002-CAR-2025
```

---

## 🔌 MCP Server — API via Protocolo MCP

O servidor MCP transforma as funcionalidades do projeto em ferramentas consumíveis por qualquer cliente compatível com o [Model Context Protocol](https://modelcontextprotocol.io).

### Configuração atual (`.bob/mcp.json`)

```json
{
  "mcpServers": {
    "dio-mcp-server": {
      "command": "node",
      "args": ["C:\\caminho\\para\\mcp\\build\\index.js"]
    }
  }
}
```

> ⚠️ Ajuste o caminho absoluto para o seu ambiente ao clonar o projeto.

### Ferramentas disponíveis

#### `listar_trilhas`
Lista todas as 30 trilhas em formato de tabela.

```
Entrada: (nenhuma)
Saída:   tabela com ID, nome, tecnologia, nível e XP de cada trilha
```

#### `buscar_trilha`
Retorna o plano completo de estudos de uma tecnologia.

```
Entrada: { "tecnologia": "React" }
Saída:   plano de estudos com módulos, badges, lives e promoções
```

#### `gerar_desafio`
Gera um desafio de código com enunciado, casos de teste e dicas.

```
Entrada: { "tecnologia": "Python", "categoria": "Algoritmos e Lógica" }
         categoria é opcional — se omitida, é sorteada aleatoriamente
Saída:   desafio formatado com enunciado, I/O e casos de teste
```

#### `gerar_certificado`
Emite um certificado em Markdown com código de verificação único.

```
Entrada: { "nome": "Paulo Silva", "tecnologia": "React" }
Saída:   certificado Markdown com DIO-0004-PAU-2025
```

### Reconstruir após alterações

```bash
cd mcp
npm run build
```

O Bob recarrega o servidor automaticamente após a rebuild.

---

## ✅ Suite de Testes

O projeto usa um runner de testes **100% vanilla Node.js** — sem Jest, Mocha ou qualquer framework externo.

### Executar

```bash
node tests/run-tests.js
```

### Resultado

```
══════════════════════════════════════════════════
  RESUMO EXECUTIVO

  ✔  Unitários — helpers          51 /  51  (100%)
  ✔  Fluxo — /trilha             125 / 125  (100%)
  ✔  Fluxo — /desafio             76 /  76  (100%)
  ✔  Fluxo — /certificado        135 / 135  (100%)

  TOTAL GERAL
  ├─ Testes executados : 387
  ├─ Aprovados         : 387
  └─ Cobertura         : 100.00%  ✔ META DE 70% ATINGIDA
══════════════════════════════════════════════════
```

O relatório completo é gravado em `test-results.txt` a cada execução.

### O que é testado

| Suite | Cobertura |
|---|---|
| `helpers.test.js` | `loadTrilhas`, `findTrilha` (case, parcial, edge), `listTecnologias`, `gerarCodigoVerificacao`, `formatarDataCertificado`, `validateOutput*` |
| `trilha.flow.test.js` | Busca exata/parcial/case-insensitive para 6 tecnologias + todas 30 trilhas do JSON + promoção ativa vs inativa |
| `desafio.flow.test.js` | 5 tecnologias × 10 categorias + tecnologias desconhecidas + calibragem de XP por nível |
| `certificado.flow.test.js` | 5 alunos × validação completa + formato de código + unicidade + 30 trilhas + branding |

---

## 🧩 Exemplos de Uso

### Fluxo completo de um aluno

```
1. Descobrir trilhas disponíveis:
   /trilha Python

2. Praticar com um desafio:
   /desafio Python

3. Emitir o certificado ao concluir:
   /certificado "João Silva" Python
```

### Via MCP (integração programática)

Qualquer cliente MCP pode chamar as ferramentas diretamente:

```json
{
  "method": "tools/call",
  "params": {
    "name": "gerar_certificado",
    "arguments": {
      "nome": "Ana Lima",
      "tecnologia": "React"
    }
  }
}
```

---

## 💡 Dicas de Uso com o Bob AI

1. **Busca inteligente** — os slash commands aceitam termos parciais e não diferenciam maiúsculas: `docker`, `DOCKER`, `Docker` encontram a mesma trilha.

2. **Encadeie os comandos** — use `/trilha` para estudar, `/desafio` para praticar e `/certificado` para concluir. O Bob entende o contexto entre as mensagens.

3. **Peça variações de desafio** — execute `/desafio React` múltiplas vezes: a categoria é sorteada aleatoriamente a cada chamada.

4. **MCP vs Slash Commands** — os slash commands são conversacionais (saída em texto no chat); as ferramentas MCP são programáticas (JSON de entrada/saída). Use MCP para integrar com outras aplicações.

5. **Rebuild automático** — após editar `mcp/src/index.ts`, execute `npm run build` dentro de `mcp/` e o Bob recarrega o servidor sem reiniciar.

6. **Adicione novas trilhas** — basta editar `data/trilhas.json` com o mesmo esquema. Todas as ferramentas leem o arquivo em tempo real; não é necessário recompilar.

---

## 🎓 Insights para Futuros Profissionais

### Sobre IA como par de programação

> Este projeto foi construído inteiramente por meio de prompts em linguagem natural. Cada seção abaixo descreve uma lição aprendida no processo.

**1. Prompts iterativos produzem código incremental e rastreável**
Cada funcionalidade foi pedida em uma mensagem separada. Isso cria um histórico claro de decisões e facilita revisão. Evite "mega-prompts" que pedem tudo de uma vez.

**2. Especifique o formato de saída quando importa**
Os templates nos arquivos `.bob/commands/*.md` mostram ao modelo exatamente qual Markdown gerar. Quanto mais preciso o template, mais consistente a saída.

**3. Testes validam o que a IA produziu**
A suite de 387 testes foi criada pelo próprio Bob para validar seu próprio trabalho. Isso é uma prática essencial: sempre peça à IA que escreva testes para o código que ela gera.

**4. MCP como camada de integração**
O Model Context Protocol transforma o Bob em uma plataforma extensível. Em vez de ensinar o modelo com prompts, você registra ferramentas com esquemas Zod — o modelo sabe exatamente o que pode e o que cada parâmetro significa.

**5. Separe dados de lógica**
O `data/trilhas.json` é a única fonte de verdade. Os builders de output consomem esse JSON sem hardcode. Isso permite adicionar trilhas sem tocar no código.

**6. `.bobignore` protege dados sensíveis**
O Bob AI não envia arquivos listados no `.bobignore` para o contexto. Trate-o como `.gitignore` para segredos, certificados, caches e builds.

### Arquitetura recomendada para projetos similares

```
Dados (JSON/DB)
    ↓
Helpers (funções puras, testáveis)
    ↓
Builders (montam o output)
    ↓
Transporte (Slash Command ou MCP Tool)
    ↓
Usuário / Cliente
```

Esta separação torna cada camada testável de forma isolada — exatamente como a suite de testes deste projeto foi estruturada.

---

## 📜 Histórico de Prompts

A tabela abaixo documenta a conversa completa com o Bob AI que gerou este projeto, em ordem cronológica.

| # | Prompt do Usuário | O que foi criado |
|---|---|---|
| 1 | *"crie na raiz do projeto um arquivo .bobignore..."* | `.bobignore` com regras para `node_modules`, `.env`, certificados, caches e builds |
| 2 | *"crie slash commands chamado /trilha... /desafio... /certificado..."* | `.bob/commands/trilha.md`, `desafio.md`, `certificado.md` com templates completos |
| 3 | *"crie arquivos de testes unitarios e teste de fluxo para atingir uma cobertura de 70%..."* | `tests/` com runner customizado, helpers, 4 suites e 387 casos de teste — resultado: 100% |
| 4 | *"poderia executar o slash command /trilhas"* | Execução demonstrativa do `/trilha` — sistema perguntou a tecnologia |
| 5 | *"React"* | Retorno do plano completo da **Formação React Developer** com 10 módulos, 4 badges, 1 live e promoção de 25% |
| 6 | *"gere para mim o certificado com o /certificado Paulo Silva React"* | Certificado Markdown completo com `DIO-0004-PAU-2025` e badges da trilha React |
| 7 | *"crie um mcp server do projeto... para que futuramente pessoas possam acessar por meio de um servidor https ou via API..."* | `mcp/` com TypeScript, 4 ferramentas MCP, build limpo e registro em `.bob/mcp.json` |
| 8 | *"gostaria que você documentasse todo o projeto até o momento..."* | Este `README.md` |

---

## 📄 Licença

[ISC](LICENSE)

---

<div align="center">

Feito com 🤖 **IBM Bob AI** + ☕ café

**#DIO #BobAI #MCP #DevEmCrescimento**

</div>
