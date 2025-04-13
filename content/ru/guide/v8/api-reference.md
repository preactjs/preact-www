---
title: Справочник по API
---

# Справочник по API


---

<toc></toc>

---

## Preact.Component

`Component` — это базовый класс, который вы обычно создаете в качестве подкласса для создания компонентов Preact с сохранением состояния.

### `Component.render(props, state)`

Функция `render()` необходима для всех компонентов. Она может проверять входные параметры и состояние компонента и должна возвращать элемент Preact или `null`.

```jsx
import { Component } from 'preact';

class MyComponent extends Component {
	render(props, state) {
		// props === this.props
		// state === this.state

		return <h1>Привет, {props.name}!</h1>;
	}
}
```

### Методы жизненного цикла

> _**Совет:** Если вы использовали пользовательские элементы HTML5, это похоже на методы жизненного цикла `attachedCallback` и `detachedCallback`._

Preact вызывает следующие методы жизненного цикла, если они определены для компонента:

| Метод            | Когда его вызывают                              |
|-----------------------------|--------------------------------------------------|
| `componentWillMount`        | до того, как компонент будет установлен в DOM     |
| `componentDidMount`         | после того, как компонент будет установлен в DOM      |
| `componentWillUnmount`      | до удаления из DOM                    |
| `componentWillReceiveProps` | до того, как новые реквизиты будут приняты                    |
| `shouldComponentUpdate`     | перед `render()`. Верните `false`, чтобы пропустить рендеринг |
| `componentWillUpdate`       | перед `render()`                                |
| `componentDidUpdate`        | после `render()`                                 |

Все методы жизненного цикла и их параметры показаны в следующем примере компонента:

```js
import { Component } from 'preact';

class MyComponent extends Component {
	shouldComponentUpdate(nextProps, nextState) {}
	componentWillReceiveProps(nextProps, nextState) {
		this.props // Предыдущие параметры
		this.state // Предыдущее состояние
	}
	componentWillMount() {}
	componentWillUpdate(nextProps, nextState) {
		this.props // Предыдущие параметры
		this.state // Предыдущее состояние
	}
	componentDidMount() {}
	componentDidUpdate(prevProps, prevState) {}
	componentWillUnmount() {
		this.props // Текущие параметры
		this.state // Текущее состояние
	}
}
```

## `Preact.render()`

`render(component, containerNode, [replaceNode])`

Рендеринг компонента Preact в DOM-узел `containerNode`. Возвращает ссылку на отрисованный узел DOM.

Если указан необязательный узел DOM `replaceNode`, который является дочерним элементом `containerNode`, Preact обновит или заменит этот элемент, используя свой алгоритм диффиринга. В противном случае Preact добавит отрисованный элемент к `containerNode`.

```js
import { render } from 'preact';

// Эти примеры показывают, как render() ведет себя на странице со следующей разметкой:
// <div id="container">
//   <h1>My App</h1>
// </div>

const container = document.getElementById('container');

render(MyComponent, container);
// Добавляем MyComponent в container
//
// <div id="container">
//   <h1>My App</h1>
//   <MyComponent />
// </div>

const existingNode = container.querySelector('h1');

render(MyComponent, container, existingNode);
// Используем MyComponent вместо <h1>My App</h1>
//
// <div id="container">
//   <MyComponent />
// </div>
```

## `Preact.h()` / `Preact.createElement()`

`h(nodeName, attributes, [...children])`

Возвращает элемент Preact Virtual DOM с заданными `атрибутами` (`attributes`).

Все оставшиеся аргументы собираются в массив `children` и могут быть любыми из следующих:

- Скалярные значения (строка, число, булевое значение, null, undefined и т. д.)
- Больше виртуальных элементов DOM
- Бесконечно вложенные массивы вышеперечисленных элементов

```js
import { h } from 'preact';

h('div', { id: 'foo' }, 'Привет!');
// <div id="foo">Привет!</div>

h('div', { id: 'foo' }, 'Привет,', null, ['Preact!']);
// <div id="foo">Привет, Preact!</div>

h(
	'div',
	{ id: 'foo' },
	h('span', null, 'Привет!')
);
// <div id="foo"><span>Привет!</span></div>
```
