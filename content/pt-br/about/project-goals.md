---
name: Objetivos do Projeto
permalink: '/about/project-goals'
---

# Objetivos do Preact

## Objetivos

Preact tem como finalidade prover em alguns aspectos:

- **Performance:** Renderizar rápido e de forma eficiente.
- **Tamanho:** Pequeno, leve _(aproximadamente 3.5kb)_.
- **Eficiência:** Uso de memória efetivo _(reciclagem, prevenção de GC thrash)_.
- **Compreensibilidade:** Entender a codebase não deve levar mais do que algumas horas.
- **Compatibilidade:** Preact mira em ser _altamente compatível_ com a API do React. [preact-compat] tenta alcançar a máxima compatibilidade possível com React.

## Fora dos objetivos

Algumas funcionalidade do React foram intencionalmente omitidas do Preact, ou por não serem alcançáveis mantendo a fidelidade aos objetívos primário listados acima ou porque não encaixam no escopo das funcionalidades chave do Preact.

- Os items (intencionais) em [O que está faltando?](/guide/differences-to-react#whats-missing):
    - PropTypes, que são facilmente utilizadas como uma biblioteca separada.
    - Children, já que o Preact sempre compacta _children_ como um `Array`
    - Eventos Sintéticos, já que o Preact não tenta resolver problemas em browsers mais velhos, como IE8

[preact-compat]: https://github.com/developit/preact-compat/
