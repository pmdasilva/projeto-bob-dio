# 🤖 Projeto Bob DIO — Plataforma de Trilhas com IA

> Projeto desenvolvido inteiramente com **IBM Bob AI** como par de programação, demonstrando como uma IA pode ser usada para construir uma plataforma real de trilhas de aprendizado, desafios de código e certificados — do zero à API e ao front-end em produção.

🌐 **Deploy:** [projeto-bob-dio.vercel.app](https://projeto-bob-dio.vercel.app)

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Fluxograma do Sistema](#-fluxograma-do-sistema)
- [Front-end React + Tailwind](#-front-end-react--tailwind)
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
- ⚔️ **Gera desafios de código** calibrados ao nível de cada trilha, com link direto para playground online
- 🏆 **Emite certificados** no estilo PDF com código de verificação único e botões de compartilhamento
- 🔌 **Expõe tudo via servidor MCP** — acessível por qualquer cliente compatível com o protocolo Model Context Protocol
- ✅ **Suite de testes com 387 casos** e 100% de cobertura
- 🌐 **Front-end em React + Tailwind** hospedado no Vercel

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| IA / Assistente | IBM Bob AI |
| Protocolo de integração | Model Context Protocol (MCP) |
| Linguagem do servidor | TypeScript + Node.js v24 |
| Validação de esquemas | Zod v4 |
| SDK MCP | `@modelcontextprotocol/sdk` v1.30 |
| **Front-end** | **React 19 + Tailwind CSS v4 + Vite 8** |
| **Deploy** | **Vercel** |
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
├── frontend-react/                # 🆕 Front-end React + Tailwind CSS
│   ├── src/
│   │   ├── App.jsx                # Roteamento entre as 3 views
│   │   ├── data.js                # Trilhas, helpers, playground URLs
│   │   ├── index.css              # Tailwind + print styles
│   │   └── components/
│   │       ├── Navbar.jsx         # Header sticky com tabs de navegação
│   │       ├── TrilhaCard.jsx     # Card de trilha com hover animado
│   │       ├── TrilhaDetalhe.jsx  # Detalhe: stats, badges, lives, promoção
│   │       ├── ViewTrilhas.jsx    # Grid de trilhas + busca + filtros
│   │       ├── ViewDesafio.jsx    # Gerador de desafios + link playground
│   │       ├── ViewCertificado.jsx# Certificado PDF + compartilhamento
│   │       └── nivelColors.js     # Cores por nível (reutilizável)
│   ├── vite.config.js
│   └── package.json
│
├── mcp/                           # Servidor MCP (TypeScript)
│   ├── src/index.ts               # 4 ferramentas MCP
│   ├── build/index.js             # Compilado
│   └── package.json
│
├── tests/                         # Suite de testes (387 casos, 100%)
│
├── vercel.json                    # 🆕 Configuração de deploy no Vercel
├── .bobignore
├── .gitignore
└── README.md
```

---

## 🔄 Fluxograma do Sistema

```mermaid
flowchart TD
    U([👤 Usuário]) -->|acessa URL| FE[🌐 Front-end React\nVercel]
    U -->|digita comando| BOB[🤖 Bob AI]

    FE --> V1[📚 View Trilhas\nbusca + filtros]
    FE --> V2[⚔️ View Desafio\nplayground online]
    FE --> V3[🏆 View Certificado\nPDF + compartilhamento]

    BOB --> SC{Tipo de\ninteração}
    SC -->|Slash Command| CMD[.bob/commands/]
    SC -->|Ferramenta MCP| MCP[MCP Server\nmcp/build/index.js]

    CMD --> C1[/trilha]
    CMD --> C2[/desafio]
    CMD --> C3[/certificado]

    MCP --> T1[listar_trilhas]
    MCP --> T2[buscar_trilha]
    MCP --> T3[gerar_desafio]
    MCP --> T4[gerar_certificado]

    V1 --> JSON[(data/trilhas.json)]
    V2 --> JSON
    V3 --> JSON
    T1 --> JSON
    T2 --> JSON
    T3 --> JSON
    T4 --> JSON

    style U fill:#4A90D9,color:#fff
    style BOB fill:#FF6B35,color:#fff
    style FE fill:#22c55e,color:#fff
    style JSON fill:#2ECC71,color:#fff
    style MCP fill:#9B59B6,color:#fff
```

---

## 🌐 Front-end React + Tailwind

O front-end foi construído com **React 19 + Tailwind CSS v4 + Vite 8** e está hospedado no **Vercel**.

### Funcionalidades

#### 📚 Trilhas
- Grid responsivo com as 30 trilhas
- **Busca com botão Pesquisar** — filtra por nome ou tecnologia
- **Filtros por nível** — Todos / Básico / Intermediário / Avançado
- Badge de nível colorido por categoria
- Tag 🔥 de promoção quando ativa
- Clique no card abre o detalhe completo (módulos, XP, badges, lives)

#### ⚔️ Desafio de Código
- Seleciona tecnologia + categoria (ou sorteia aleatória)
- Enunciado calibrado ao nível da trilha (XP e tempo estimado)
- Botão **💻 Resolver Online** — abre o playground mais adequado para cada tecnologia:

| Tecnologia | Playground |
|---|---|
| Python / ML / Data Science | Google Colab |
| React | StackBlitz (fork React) |
| Angular | StackBlitz (fork Angular) |
| Vue.js | Vue Playground |
| TypeScript | TypeScript Playground oficial |
| Flutter / Dart | DartPad |
| Kotlin / Android | Kotlin Playground |
| Rust | Rust Playground |
| Go | Go Playground |
| C# / .NET | .NET Fiddle |
| SQL | SQL Fiddle |
| Blockchain / Solidity | Remix IDE |
| Segurança da Informação | TryHackMe |
| AWS | AWS CloudShell |
| Azure | Azure Cloud Shell |

#### 🏆 Certificado
- Layout estilo **PDF** com gradiente DIO, nome em destaque, badges e código de verificação
- **🖨️ Salvar / Imprimir PDF** — `window.print()` com estilos de impressão otimizados
- **🔗 Copiar Link** — URL do certificado com feedback visual
- **LinkedIn** — compartilha diretamente na timeline
- **X / Twitter** — tweet com texto pré-formatado
- **WhatsApp** — mensagem com link do certificado

### Rodar localmente

```bash
cd frontend-react
npm install
npm run dev        # http://localhost:5173
```

### Build de produção

```bash
npm run build      # gera frontend-react/dist/
npm run preview    # preview local do build
```

---

## 🚀 Como Inicializar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org) **v18 ou superior** (testado com v24.15.0)
- [IBM Bob AI](https://dio.me) instalado e configurado no VS Code
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/pmdasilva/projeto-bob-dio.git
cd projeto-bob-dio
```

### 2. Front-end React (recomendado)

```bash
cd frontend-react
npm install
npm run dev        # abre em http://localhost:5173
```

### 3. Servidor MCP (opcional — integração com Bob AI)

```bash
cd mcp
npm install
npm run build
```

> **Windows com PowerShell restrito:** se encontrar erro de execução de scripts, use:
> ```powershell
> & "C:\Program Files\nodejs\node.exe" "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install
> ```

### 4. (Opcional) Execute os testes

```bash
node tests/run-tests.js
```

---

## 💬 Slash Commands

Os slash commands são arquivos Markdown em `.bob/commands/` que ensinam o Bob AI a responder a padrões específicos de entrada.

### `/trilha <tecnologia>`

```
/trilha React
/trilha Python
/trilha AWS
/trilha docker        ← busca parcial, case-insensitive
```

### `/desafio <tecnologia>`

```
/desafio Java
/desafio React
/desafio SQL
/desafio COBOL        ← tecnologia fora do JSON, usa nível Intermediário
```

### `/certificado <nome> <tecnologia>`

```
/certificado "Ana Lima" React
/certificado "Carlos Souza" Python
```

**Formato do código de verificação:**
```
DIO-{id em 4 dígitos}-{3 primeiras letras do nome}-{ano}

Exemplos:
  Ana Lima     → React  (id=4)  → DIO-0004-ANA-2025
  Carlos Souza → Python (id=2)  → DIO-0002-CAR-2025
```

---

## 🔌 MCP Server — API via Protocolo MCP

### Ferramentas disponíveis

| Ferramenta | Entrada | Saída |
|---|---|---|
| `listar_trilhas` | — | tabela com 30 trilhas |
| `buscar_trilha` | `{ "tecnologia": "React" }` | plano de estudos completo |
| `gerar_desafio` | `{ "tecnologia": "Python", "categoria": "..." }` | desafio com enunciado e casos de teste |
| `gerar_certificado` | `{ "nome": "Ana Lima", "tecnologia": "React" }` | certificado Markdown com código único |

---

## ✅ Suite de Testes

```bash
node tests/run-tests.js
```

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

---

## 💡 Dicas de Uso com o Bob AI

1. **Busca inteligente** — os slash commands aceitam termos parciais e não diferenciam maiúsculas.
2. **Encadeie os comandos** — use `/trilha` para estudar, `/desafio` para praticar e `/certificado` para concluir.
3. **Peça variações de desafio** — execute `/desafio React` múltiplas vezes; a categoria é sorteada a cada chamada.
4. **MCP vs Slash Commands** — slash commands são conversacionais; ferramentas MCP são programáticas (JSON I/O).
5. **Rebuild automático** — após editar `mcp/src/index.ts`, execute `npm run build` e o Bob recarrega o servidor.

---

## 🎓 Insights para Futuros Profissionais

**1. Prompts iterativos produzem código incremental e rastreável**

**2. Especifique o formato de saída quando importa**

**3. Testes validam o que a IA produziu**
A suite de 387 testes foi criada pelo próprio Bob para validar seu próprio trabalho.

**4. MCP como camada de integração**
O Model Context Protocol transforma o Bob em uma plataforma extensível com ferramentas tipadas.

**5. Separe dados de lógica**
O `data/trilhas.json` é a única fonte de verdade — adicionar trilhas não exige recompilação.

**6. `.bobignore` protege dados sensíveis**
Trate-o como `.gitignore` para segredos, certificados, caches e builds.

---

## 📜 Histórico de Prompts

| # | Prompt do Usuário | O que foi criado |
|---|---|---|
| 1 | *"crie na raiz do projeto um arquivo .bobignore..."* | `.bobignore` com regras para `node_modules`, `.env`, certificados, caches e builds |
| 2 | *"crie slash commands chamado /trilha... /desafio... /certificado..."* | `.bob/commands/trilha.md`, `desafio.md`, `certificado.md` com templates completos |
| 3 | *"crie arquivos de testes unitarios e teste de fluxo..."* | `tests/` com runner customizado, 4 suites e 387 casos — 100% cobertura |
| 4 | *"poderia executar o slash command /trilhas"* | Execução demonstrativa do `/trilha` |
| 5 | *"React"* | Retorno do plano completo da **Formação React Developer** |
| 6 | *"gere para mim o certificado com o /certificado Paulo Silva React"* | Certificado com `DIO-0004-PAU-2025` |
| 7 | *"crie um mcp server do projeto..."* | `mcp/` com TypeScript, 4 ferramentas MCP e registro em `.bob/mcp.json` |
| 8 | *"gostaria que você documentasse todo o projeto..."* | `README.md` completo |
| 9 | *"podemos estar criando uma nova branch para o front-end?"* | Branch `feature/front-end` criada |
| 10 | *"preciso que crie um front end com base no que temos hoje..."* | `frontend/` com HTML + CSS + JS vanilla, dark mode, todas as 3 views |
| 11 | *"melhorando desafios e certificado... projeto em react mais tailwind..."* | `frontend-react/` — React 19 + Tailwind v4 + Vite 8, busca com botão, playgrounds online, certificado PDF + compartilhamento |
| 12 | *"realizando a atualização da documentação e hospedando no vercel"* | `README.md` atualizado + `vercel.json` + deploy no Vercel |

---

## 📄 Licença

[ISC](LICENSE)

---

<div align="center">

Feito com 🤖 **IBM Bob AI** + ☕ café

🌐 [projeto-bob-dio.vercel.app](https://projeto-bob-dio.vercel.app)

**#DIO #BobAI #MCP #React #Tailwind #Vercel #DevEmCrescimento**

</div>
