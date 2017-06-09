---
name: Diferenças do React
permalink: '/guide/differences-to-react'
---

# Diferenças do React

O próprio Preact não tem a intenção de ser uma reimplementacao do React. Há diferenças. Muitas dessas são triviais, ou podem ser completamente removidas utilizando [preact-compat], que é uma fina camada sobre o Preact que tenta conseguir 100% de compatibilidade com React.

Preact não tenta incluir cada pequeno recurso do React em razão manter-se **pequeno** e **focado** - de outro modo faria mais sentido simplesmente submeter otimizações para o projeto React, que já é atualmente uma _codebase_ muito complexa e bem arquitetada.

## Compatibilidade de Versões

Para ambos o Preact e [preact-compat], compatibilidade de versões pode ser medida comparando o _releases_ `current` e `previous` do React. Quando novos recursos são anunciados pelo time do React, eles podem ser adicionados ao Preact se os mesmos fizerem sentido de acordo com os [Objetivos do Projeto]. É um processo bastante democrático, que evolui constantemente através da discussão e decisão feita abertamente, utilizando _issues_ e _pull requests_.

> Assim, o site e a documentação refletem o react `0.14.x` e `15.x` quando se discutem compatibildiade e fazem-se comparações.


## O que está incluso?

- [Componentes de Classes ES6]
    - _classes oferecem uma forma expressiva de definir componentes com estado_
- [Componentes de Alta-Ordem]
    - _componentes que retornam outro componente a partir do `render()` (wrappers, efetivamente)_
- [Componentes Funcionais Puros e Sem Estados]
    - _funcões que recebem `props` como argumentos e retornam JSX/VDOM_
- [Contextos]: Suporta para `contexto` foi adicionado no Preact [3.0].
    - _Contexto é uma funcionalidade experimental do React, mas tem sido adotada por algumas bibliotecas._
- [Refs]: Suporte para _refs_ de função foi adicionado no Preact [4.0]. _refs_ de Strings são suportadas via `preact-compat`
    - _Refs proveem uma maneira de se referir aos componentes renderizados e componentes filhos._
- Compração de Virtual DOM
    - _Essa com certeza! - O algorítimo de diff do Preact é simples porém efetivo e **[extremamente](http://developit.github.io/js-repaint-perfs/) [rápido](https://localvoid.github.io/uibench/)**._
- `h()`, uma versão mais generalizada do `React.createElement`
    - _Essa ideia foi originalmente chama de [hyperscript] e tem valor muito além do ecossistema React, então Preact promove o padrão original.([Leia: Por que `h()`?](http://jasonformat.com/wtf-is-jsx))_
    - _Também é mais legível: `h('a', { href:'/' }, h('span', null, 'Home'))`_

## O que foi adicionado?

Preact na verdade adiciona algumas características conveninentes inspiradas pelo trabalho da comunidade do React:

- `this.props` e `this.state` são passadas para o `render()` pra você
    - _Você ainda os pode referenciar manualmente. Essa é só uma maneira mais limpa, particularmente com [destructuring]_
- [Linked State] atualiza o estado quando os _inputs_ mudam automaticamente
- Atualização de DOM em lotes, 'debounced/collated' usando `setTimeout(1)` _(também pode utilizar requestAnimationFrame)_
- Você pode utilizar apenas `class` pra classes CSS. `classNames` ainda é suportado, mas `class` é preferível.
- Reciclagem/_pooling_ de elementos e componentes.



## O que está faltando?

- Validação de [PropType] : Nem todos usam PropTypes, desse modo eles não fazem parte do núcleo do Preact.
    - _**PropTypes são totalmente suportados** com [preact-compat], ou você pode utilizá-los manualmente._
- [Children]: Não é necessário no Preact, pois `props.children` é _sempre um Array_.
    - _`React.Children` é totalmente suportado em [preact-compat]._
- Eventos Sintéticos: Os navegadores suportados pelo Preact não requerem esse encargo adicional.
    - _Preact usa o `addEventListener` nativo do navegador para manipulação de eventos. Veja [Manipuladores de Evento Globais] para uma lista completa dos manipuladores de eventos DOM._
    - _Uma implementação completa dos eventos significaria mais manutenção e preocupações com performance, além de uma API maior._


## O que é diferente?

Preact e React tem algumas diferenças sutis:

- `render()` aceita um terceiro argumento, que é o nó raiz para _substituição_, caso contrário ele acrescenta (_append_). Isso pode mudar levemente em futuras versões, talvez auto detecção de uma renderização de substituição seja apropriado por meio da inspeção do nó raiz.


[Objetivos do Projeto]: /about/project-goals
[hyperscript]: https://github.com/dominictarr/hyperscript
[3.0]: https://github.com/developit/preact/milestones/3.0
[4.0]: https://github.com/developit/preact/milestones/4.0
[preact-compat]: https://github.com/developit/preact-compat
[PropType]: https://github.com/developit/proptypes
[Contextos]: https://facebook.github.io/react/docs/context.html
[Refs]: https://facebook.github.io/react/docs/more-about-refs.html
[Children]: https://facebook.github.io/react/docs/top-level-api.html#react.children
[Manipuladores de Evento Globais]: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers
[Componentes de Classes ES6]: https://facebook.github.io/react/docs/reusable-components.html#es6-classes
[Componentes de Alta-Ordem]: https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
[Componentes Funcionais Puros e Sem Estados]: https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
[destructuring]: http://www.2ality.com/2015/01/es6-destructuring.html
[Linked State]: /guide/linked-state
