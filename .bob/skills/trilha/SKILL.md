---
name: trilha
description: '# /trilha'
metadata:
  user-invocable: true
  disable-model-invocation: true
---

# /trilha

Recebe o nome de uma tecnologia e retorna um plano de estudos formatado com os módulos dessa trilha a partir do arquivo `data/trilhas.json`.

## Como usar

```
/trilha <tecnologia>
```

**Exemplos:**
- `/trilha Java`
- `/trilha Python`
- `/trilha React`
- `/trilha AWS`

---

## Instruções para o modelo

Ao receber o comando `/trilha <tecnologia>`:

1. Leia o arquivo `data/trilhas.json`.
2. Busque a trilha cujo campo `tecnologia` corresponda (total ou parcialmente, sem diferenciar maiúsculas/minúsculas) ao argumento informado pelo usuário.
3. Se não encontrar nenhuma trilha, liste todas as tecnologias disponíveis no JSON e peça ao usuário que escolha uma.
4. Se encontrar, formate a resposta **exatamente** conforme o template abaixo, preenchendo com os dados reais da trilha.

### Template de saída

```
# 🎓 Trilha: {nome}

**Tecnologia:** {tecnologia}
**Nível:** {nivel}
**Total de Módulos:** {numero_de_modulos}
**XP Total:** {xp_total} XP

---

## 📚 Plano de Estudos

Abaixo estão os módulos desta trilha organizados em ordem progressiva:

| # | Módulo | Descrição |
|---|--------|-----------|
| 1 | Fundamentos de {tecnologia} | Conceitos essenciais e configuração do ambiente |
| 2 | Sintaxe e Estruturas de Dados | Tipos, variáveis, coleções e estruturas de controle |
| 3 | Orientação a Objetos / Paradigmas | Princípios e padrões do paradigma central da tecnologia |
| 4 | Ferramentas e Ecossistema | Principais bibliotecas, frameworks e ferramentas do mercado |
| 5 | Projetos Práticos Intermediários | Aplicações reais com desafios progressivos |
| ... | *(módulos seguintes conforme o nível e foco da trilha)* | *(aprofundamento até o módulo {numero_de_modulos})* |

> 💡 Os módulos acima são gerados com base no nível **{nivel}** e na tecnologia **{tecnologia}**.
> O número exato de módulos desta trilha é **{numero_de_modulos}**, distribua o conteúdo proporcionalmente.

---

## 🏅 Badges Disponíveis

Ao concluir os módulos, você pode conquistar os seguintes badges:

{badges_disponiveis - liste cada badge com um emoji 🥇 na frente}

---

## 📡 Próximas Lives ao Vivo

{lives_ao_vivo - para cada live, exiba: título, data formatada (DD/MM/AAAA), horário e instrutor}

---

## 🎁 Promoção Ativa

{se promocoes.desconto for "0%" ou null, escreva "Nenhuma promoção ativa no momento."}
{caso contrário, exiba: desconto, validade formatada e descrição}

---

> ✅ Boa sorte na sua jornada! Ao concluir, use `/certificado <seu nome> <tecnologia>` para gerar seu certificado.
```

5. Gere os módulos do plano de estudos com nomes e descrições **coerentes com a tecnologia e o nível** da trilha. A quantidade de linhas na tabela deve bater com `numero_de_modulos`.
6. Nunca invente dados de badges, lives ou promoções — use sempre o que está no JSON.
