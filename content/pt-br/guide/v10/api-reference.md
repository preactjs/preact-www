---
name: Referências da API
description: 'Saiba mais sobre todas as funções exportadas do módulo Preact'
---

# Referência da API

Esta página serve como uma rápida visão geral de todas as funções exportadas.

---

<div><toc></toc></div>

---

## Preact.Component

`Component` é uma classe base, que é geralmente estendida por subclasses, para criar componentes com estado.

### Component.render(props, state)

A função `render ()` é necessária para todos os componentes. Ele pode inspecionar os props e o estado do componente e deve retornar um elemento Preact ou `null '.

```jsx
import { Component } from 'preact';

class MyComponent extends Component {
	render(props, state) {
		// props === this.props
		// state === this.state

		return <h1>Olá, {props.name}!</h1>;
	}
}
```

Para saber mais sobre os componentes e como eles podem ser usados, vá para a página [Components](/guide/v10/components).

## render()

`render(component, containerNode, [replaceNode])`

Renderizar um componente Preact no `containerNode` do DOM. Não retorna nada.

Se o nó DOM opcional `replaceNode` for fornecido e for filho de `containerNode`, o Preact atualizará ou substituirá esse elemento usando seu algoritmo de comparação.

```jsx
import { render } from 'preact';

const Foo = () => <div>foo</div>;

// DOM antes de renderizar:
// <div id="container"></div>
render(<Foo />, document.getElementById('container'));
// depois de renderizar:
// <div id="container">
//  <div>foo</div>
// </div>

// DOM antes de renderizar:
// <div id="container">
//   <div>bar</div>
//   <div id="target"></div>
// </div>
render(
  <Foo />,
  document.getElementById('container'),
  document.getElementById('target')
);
// depois de renderizar:
// <div id="container">
//   <div>bar</div>
//   <div id="target">
//     <div>foo</div>
//   </div>
// </div>
```

O primeiro argumento deve ser um nó do virtual-dom válido que represente um componente ou um elemento HTML.

```jsx
const App = () => <div>foo</div>;

// ERRADO: O primeiro parâmetro deve ser passadopara afunção h() ou
// createElement() direta ou indiretamente via JSX
render(App(), rootElement);

// ERRADO: Pelas mesmas razões acima
render(App, rootElement);

// CORRETO: Passando APP para a função h()
render(h(App), rootElement);

// CORRETO: Passando App indiretamente para função h() via JSX
render(<App />, rootElement)
```

## hydrate()

Quando você tem um DOM pré-renderizado, não há necessidade de renderizá-lo novamente. Com o hydrate, a maior parte da fase de comparação será ignorada, com os ouvintes do evento sendo a exceção. É usado principalmente em conjunto com
[Server-Side Rendering](/guide/v10/server-side-rendering).

```jsx
import { hydrate } from 'preact';

const Foo = () => <div>foo</div>;
hydrate(<Foo />, document.getElementById('container'));
```

## h() / createElement()

`h(nodeName, attributes, [...children])`

Retorna um elemento Preact Virtual DOM com os seguintes  atributos.

All remaining arguments are collected into a `children` Array, and be any of the following:
Todos os argumentos restantes são coletados em um `children` Array e são um dos seguintes:

- Valores escalares (sequência, número, booleano, nulo, indefinido etc.)
- Mais elementos DOM virtuais
- Arrays infinitamente aninhados dos itens acima

```js
import { h } from 'preact';

h('div', { id: 'foo' }, 'Hello!');
// <div id="foo">Olá!</div>

h('div', { id: 'foo' }, 'Olá', null, ['Preact!']);
// <div id="foo">Olá Preact!</div>

h(
	'div',
	{ id: 'foo' },
	h('span', null, 'Olá!')
);
// <div id="foo"><span>Olá!</span></div>
```

## toChildArray

Essa função auxiliar sempre converterá filhos em um array. Se já é uma array, será um noop essencialmente. Essa função é necessária porque não é garantido que os filhos sejam uma array.

Se um elemento tiver apenas um filho, ele o receberá diretamente. Somente quando houver mais de um filho, você pode ter certeza de que receberá um array. Com o `toChildArray`, você pode garantir que esse seja sempre o caso.

```jsx
import { toChildArray } from 'preact';

function Foo(props) {
  const count = toChildArray(props.children).length;
  return <div>I have {count} children</div>;
}

// filho não é um arrray
render(<Foo>bar</Foo>, container);

// filho é um arrray
render((
  <Foo>
    <p>A</p>
    <p>B</p>
  </Foo>,
  container
);
```

## cloneElement

Esta função permite clonar superficialmente um componente e renderizá-lo em outro lugar.

## createContext

Veja a seção no [Context documentation](/guide/v10/context#createcontext).

## createRef

Veja a seção no [References documentation](/guide/v10/refs#createref).

## Fragment

Um tipo especial de componente que não renderiza nada no DOM. Eles permitem que um componente retorne vários filhos irmãos sem precisar envolvê-los em uma div container.

```jsx
import { Fragment, render } from 'preact';

render((
  <Fragment>
    <div>A</div>
    <div>B</div>
    <div>C</div>
  </Fragment>
), container);
// Renderiza:
// <div id="container>
//   <div>A</div>
//   <div>B</div>
//   <div>C</div>
// </div>
```
