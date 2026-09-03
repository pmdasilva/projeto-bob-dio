# /desafio

Gera um desafio de código aleatório baseado na tecnologia escolhida pelo usuário.

## Como usar

```
/desafio <tecnologia>
```

**Exemplos:**
- `/desafio Java`
- `/desafio Python`
- `/desafio React`
- `/desafio SQL`

---

## Instruções para o modelo

Ao receber o comando `/desafio <tecnologia>`:

1. Verifique se a tecnologia informada tem correspondência (total ou parcial, sem diferenciar maiúsculas/minúsculas) com alguma trilha em `data/trilhas.json`.
2. Use o campo `nivel` da trilha correspondente para calibrar a dificuldade do desafio.
   - Se não houver trilha correspondente, gere um desafio de nível intermediário para a tecnologia informada.
3. Escolha **aleatoriamente** uma categoria de desafio dentre as opções abaixo:
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
4. Formate a resposta **exatamente** conforme o template abaixo.

### Template de saída

```
# ⚔️ Desafio de Código — {tecnologia}

**Categoria:** {categoria sorteada}
**Dificuldade:** {Básico | Intermediário | Avançado} — baseada no nível da trilha
**XP ao concluir:** {valor entre 500 e 3000, proporcional à dificuldade}
**Tempo estimado:** {15 min | 30 min | 1h | 2h}

---

## 📋 Enunciado

{Descrição clara e objetiva do desafio, entre 3 e 6 parágrafos. Deve incluir:
- Contexto do problema
- O que deve ser implementado
- Regras e restrições (ex: não usar bibliotecas externas, complexidade máxima O(n), etc.)
- Critérios de sucesso}

---

## 📥 Entrada Esperada

{Descreva o formato e exemplos de entrada}

**Exemplo:**
```
{exemplo concreto de entrada}
```

## 📤 Saída Esperada

{Descreva o formato e exemplos de saída}

**Exemplo:**
```
{exemplo concreto de saída}
```

---

## 💡 Dicas

- {dica 1 relevante para a tecnologia}
- {dica 2 relevante para o problema}
- {dica 3 opcional para nível avançado}

---

## 🧪 Casos de Teste

| # | Entrada | Saída Esperada |
|---|---------|----------------|
| 1 | {entrada 1} | {saída 1} |
| 2 | {entrada 2} | {saída 2} |
| 3 | {entrada edge case} | {saída edge} |

---

> 💬 Quando terminar, cole sua solução no chat para revisão!
> Ao completar a trilha completa, use `/certificado <seu nome> <tecnologia>` para gerar seu certificado.
```

5. O desafio deve ser **tecnicamente correto**, **executável** e adequado ao nível da trilha.
6. Use sintaxe, convenções e boas práticas da tecnologia em questão nos exemplos.
7. Cada vez que o comando for chamado para a mesma tecnologia, varie a categoria e o enunciado para garantir aleatoriedade.
