---
name: certificado
description: '# /certificado'
metadata:
  user-invocable: true
  disable-model-invocation: true
---

# /certificado

Gera um certificado fictício em Markdown com o nome do usuário e a trilha concluída.

## Como usar

```
/certificado <nome do usuario> <tecnologia>
```

**Exemplos:**
- `/certificado "Ana Lima" Java`
- `/certificado "Carlos Souza" Python`
- `/certificado "Maria Santos" React`

---

## Instruções para o modelo

Ao receber o comando `/certificado <nome> <tecnologia>`:

1. Leia o arquivo `data/trilhas.json`.
2. Busque a trilha cujo campo `tecnologia` corresponda (total ou parcialmente, sem diferenciar maiúsculas/minúsculas) ao argumento informado.
3. Se não encontrar a trilha, informe que a tecnologia não está cadastrada e liste as disponíveis.
4. Se encontrar, gere a data de conclusão como a **data atual** (use o dia de hoje).
5. Calcule um **código de verificação** fictício no formato `DIO-{ID da trilha em 4 dígitos}-{primeiras 3 letras do nome em maiúsculo}-{ano atual}`.
   - Exemplo: trilha id=1, nome="Ana Lima", ano=2025 → `DIO-0001-ANA-2025`
6. Formate a resposta **exatamente** conforme o template abaixo.

### Template de saída

```markdown
---

<div align="center">

# 🏆 CERTIFICADO DE CONCLUSÃO

### *Digital Innovation One — DIO*

---

Este certificado é conferido a

# {NOME DO USUÁRIO EM MAIÚSCULO}

por ter concluído com êxito a trilha de estudos

## {nome da trilha}

**Tecnologia:** {tecnologia}
**Nível:** {nivel}
**Módulos Concluídos:** {numero_de_modulos} de {numero_de_modulos}
**XP Conquistado:** {xp_total} XP

---

🏅 **Badges Conquistados:**

{liste cada badge de badges_disponiveis com emoji 🥇}

---

📅 **Data de Conclusão:** {data atual formatada como DD de [mês por extenso] de AAAA}

🔐 **Código de Verificação:** `{DIO-{id com 4 dígitos}-{3 primeiras letras do nome}-{ano}}`

---

*"O aprendizado contínuo é o caminho para a excelência em tecnologia."*

**— Digital Innovation One**

[![DIO](https://img.shields.io/badge/DIO-Certificado%20Verificado-blue?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgo=)](https://dio.me)

</div>

---
```

7. O certificado deve ser gerado inteiramente em Markdown válido e bem formatado.
8. Nunca invente dados da trilha — use sempre os dados reais do JSON (nome, nível, módulos, XP, badges).
9. O nome do usuário deve aparecer exatamente como fornecido, mas em MAIÚSCULO na linha do destaque principal.
10. Após gerar o certificado, adicione uma mensagem de parabéns personalizada fora do bloco do certificado, como:

```
🎉 Parabéns, {nome}! Seu certificado foi gerado com sucesso.
Compartilhe sua conquista no LinkedIn com a hashtag #DIO #DevEmCrescimento!
```
