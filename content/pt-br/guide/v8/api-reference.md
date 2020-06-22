---
name: Referência da API
permalink: '/guide/api-reference'
---

# Referência da API

---

<div><toc></toc></div>

---

## `Preact.Component`

`Component` é uma classe base, que é geralmente estendida por subclasses, para criar componentes com estado.

### `Component.render(props, state)`

A função `render()` é obrigatória para todos os componentes. Ela tem acesso às propriedades e estado dos componentes, e deve retornar um elemento Preact ou `null`.

```jsx
import { Component } from 'preact';

class MyComponent extends Component {
	render(props, state) {
		// props === this.props
		// state === this.state

		return <h1>Oi, {props.name}!</h1>;
	}
}
```

### Métodos do Ciclo de Vida

> _**Dica:** Caso você já tenha utilizado HTML5 Custom Elements, isso é similar aos métodos de ciclo de vida `attachedCallback` e `detachedCallback`._

Preact invoca os seguintes métodos do ciclo de vida se os mesmos estiverem definidos para um Componente.


| Métodos do Ciclo de Vida    | Quando é chamado                                 			   |
|-----------------------------|----------------------------------------------------------------|
| `componentWillMount`        | antes do componente ser montado no DOM 			     		   |
| `componentDidMount`         | depois do componente ser montado no DOM    			 		   |
| `componentWillUnmount`      | antes da remoção do Componente do DOM 					 	   |
| `componentWillReceiveProps` | antes das novas props serem aceitas 						   |
| `shouldComponentUpdate`     | antes de `render()`. Retorne `false` para pular a renderização |
| `componentWillUpdate`       | antes de `render()`                              			   |
| `componentDidUpdate`        | depois de `render()`                             			   |

Todos os métodos do ciclo de vida e seus parametros são mostrados no exemplo seguinte:

```js
import { Component } from 'preact';

class MyComponent extends Component {
	shouldComponentUpdate(nextProps, nextState) {}
	componentWillReceiveProps(nextProps, nextState) {
		this.props // Previous props
		this.state // Previous state
	}
	componentWillMount() {}
	componentWillUpdate(nextProps, nextState) {
		this.props // Previous props
		this.state // Previous state
	}
	componentDidMount() {}
	componentDidUpdate(prevProps, prevState) {}
	componentWillUnmount() {
		this.props // Current props
		this.state // Current state
	}
}
```

## `Preact.render()`

`render(component, containerNode, [replaceNode])`

Renderiza um componente Preact dentro do nó `containerNode` na DOM. Returna uma referência para o nó renderizado.

Se o nó da DOM `replaceNode` for passado (opcional) e esse for um filho de `containerNode`, Preact irá atualizar ou substituir esse elemento usando seu algoritmo de diferenciação. Caso contrário, Preact irá acrescentar o elemento renderizado à `containerNode`.

```js
import { render } from 'preact';

// Esses exemplos mostram como o render() se comporta numa página com a seguinte estrutura:
// <div id="container">
//   <h1>My App</h1>
// </div>

const container = document.getElementById('container');

render(MyComponent, container);
// Acrescenta MyComponent ao container
//
// <div id="container">
//   <h1>My App</h1>
//   <MyComponent />
// </div>

const existingNode = container.querySelector('h1');

render(MyComponent, container, existingNode);
// Diferencia MyComponent de <h1>My App</h1>
//
// <div id="container">
//   <MyComponent />
// </div>
```

## `Preact.h()` / `Preact.createElement()`

`h(nodeName, attributes, [...children])`

Returna um elemento Preact Virtual DOM com os `attributes` dados.

Todos os argumentos restantes são agregados num vetor `children`, e podem ser um dos seguintes:

- Valores primitivos escalares (string, number, boolean, null, undefined, etc)
- Outros elementos Virtual DOM
- Infinitos vetores encapsulados dos acima

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
