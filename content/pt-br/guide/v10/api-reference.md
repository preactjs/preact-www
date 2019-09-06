---
name: Referência da API
description: 'Learn more about all exported functions of the Preact module'
---

# Referência da API

Esta página serve como uma visão geral rápida de todas as funções exportadas.

---

<toc></toc>

---

## Preact.Component

`Component` é uma classe base que você normalmente criará na subclasse para criar componentes Preact com monitoração de estado.

### Component.render(props, state)

O `render()` é a função  necessária para todos os componentes. Ele pode inspecionar os props e o estado do componente e deve retornar um elemento Preact ou `null`.

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

Para saber mais sobre os componentes e como eles podem ser usados, vá para o [Components](guide/v10/components) página.

## render()

`render(component, containerNode, [replaceNode])`

Renderize um componente Preact no `containerNode` Nó DOM. Retorna uma referência ao nó DOM renderizado.

Se o opcional `replaceNode` O nó DOM é fornecido e é filho de  `containerNode`,O Preact atualizará ou substituirá esse elemento usando seu algoritmo diffing.

```js
import { render } from 'preact';

const Foo = () => <div>foo</div>;

// DOM before render:
// <div id="container"></div>
render(<Foo />, document.getElementById('container'));
// depois do  render:
// <div id="container">
//  <div>foo</div>
// </div>

// DOM antes do render:
// <div id="container">
//   <div>bar</div>
//   <div id="target"></div>
// </div>
render(
  Foo,
  document.getElementById('container'),
  document.getElementById('target')
);
// depois do  render:
// <div id="container">
//   <div>bar</div>
//   <div id="target">
//     <div>foo</div>
//   </div>
// </div>
```

## hydrate()

Quando você tem um DOM pré-renderizado, não há necessidade de renderizá-lo novamente. Com o hidrato, a maior parte da fase diferente será ignorada, com os ouvintes do evento sendo a exceção. É usado principalmente em conjunto com [Server-Side Rendering](/guide/v10/server-side-rendering).

```jsx
import { render } from 'preact';

const Foo = () => <div>foo</div>;
hydrate(<Foo />, document.getElementById('container));
```

## h() / createElement()

`h(nodeName, attributes, [...children])`

Retorna um elemento Preact Virtual DOM com o dado `attributes`.

Todos os argumentos restantes são coletados em um `children` Matriz e siga um destes procedimentos:

- Valores escalares (string, número, booleano, nulo, indefinido, etc)
- Mais elementos virtuais do DOM
- Matrizes infinitamente aninhadas acima

```js
import { h } from 'preact';

h('div', { id: 'foo' }, 'Hello!');
// <div id="foo">Hello!</div>

h('div', { id: 'foo' }, 'Hello', null, ['Preact!']);
// <div id="foo">Hello Preact!</div>

h(
	'div',
	{ id: 'foo' },
	h('span', null, 'Hello!')
);
// <div id="foo"><span>Hello!</span></div>
```

## toChildArray

Essa função auxiliar sempre converterá filhos em uma matriz. Se já é uma matriz, será um noop essencialmente. Esta função é necessária porque não é garantido que os filhos sejam uma matriz.

Se um elemento tiver apenas um filho, ele o receberá diretamente. Somente quando houver mais de um filho, você pode ter certeza de que receberá uma matriz. Com `toChildArray` 
você pode garantir que esse seja sempre o caso.

```jsx
import { toChildArray } from 'preact';

function Foo(props) {
  const count = toChildArray(props.children).length;
  return <div>I have {count} children</div>;
}

// Filho não é uma matriz
render(<Foo>bar</Foo>, container);

// Filho é uma matriz
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

Veja a seção em   [Context documentation](/guide/v10/context#createcontext).

## createRef

Veja a seção em  [References documentation](/guide/v10/refs#createref).

## Fragment

Um tipo especial de componente que não renderiza nada no DOM. Eles permitem que um componente retorne vários filhos irmãos sem precisar envolvê-los em uma div de contêiner.

```jsx
import { Fragment, render } from 'preact';

render((
  <Fragment>
    <div>A</div>
    <div>B</div>
    <div>C</div>
  </Fragment>
), container);
// Renders:
// <div id="container>
//   <div>A</div>
//   <div>B</div>
//   <div>C</div>
// </div>
```
