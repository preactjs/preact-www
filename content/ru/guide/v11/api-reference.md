---
title: Справочник по API
description: Узнайте больше обо всех экспортируемых функциях модуля Preact
---

# Справочник по API

Эта страница служит кратким обзором всех экспортируемых функций.

---

<toc></toc>

---

## Component

`Component` — это базовый класс, который можно расширить для создания компонентов Preact с состоянием.

Компоненты управляются рендерером и создаются по мере необходимости, а не инстанцируются напрямую.

```js
import { Component } from 'preact';

class MyComponent extends Component {
	// (см. ниже)
}
```

### Component.render(props, state)

Все компоненты должны предоставлять функцию `render()`. Функция render получает текущие пропсы (`props`) и состояние (`state`) компонента и должна возвращать элемент Virtual DOM (обычно JSX «элемент»), Array или `null`.

```jsx
import { Component } from 'preact';

class MyComponent extends Component {
	render(props, state) {
		// props то же, что и this.props
		// state то же, что и this.state

		return <h1>Привет, {props.name}!</h1>;
	}
}
```

Чтобы узнать больше о компонентах и их использовании, ознакомьтесь с [Документацией по Компонентам](/guide/v10/components).

## render()

`render(virtualDom, containerNode)`

Рендерит элемент Virtual DOM в родительский DOM элемент `containerNode`. Не возвращает ничего.

```jsx
// --repl
// Дерево DOM до рендеринга:
// <div id="container"></div>

import { render } from 'preact';

const Foo = () => <div>foo</div>;

render(<Foo />, document.getElementById('container'));

// После рендеринга:
// <div id="container">
//  <div>foo</div>
// </div>
```

Первый аргумент должен быть действительным элементом Virtual DOM, который представляет либо компонент, либо элемент. При передаче компонента важно позволить Preact выполнять создание экземпляра, а не вызывать компонент напрямую, что может привести к неожиданным сбоям:

```jsx
const App = () => <div>foo</div>;

// НЕЛЬЗЯ: Прямой вызов компонентов означает, что они не будут считаться
// VNode, и, следовательно, не смогут использовать функциональность, связанную с VNode.
render(App(), rootElement); // ОШИБКА
render(App, rootElement); // ОШИБКА

// ПРАВИЛЬНО: Передача компонентов с использованием h() или JSX позволяет Preact корректно выполнить рендеринг:
render(h(App), rootElement); // успех
render(<App />, rootElement); // успех
```

## hydrate()

Если вы уже предварительно отрендерили или серверно-отрендерили ваше приложение в HTML, Preact может обойти большую часть работы по рендерингу при загрузке в браузере. Это можно включить, переключившись с `render()` на `hydrate()`, который пропускает большую часть диффинга, при этом всё ещё присоединяя слушатели событий и настраивая ваше дерево компонентов. Это работает только в сочетании с предварительным рендерингом или [серверным рендерингом](/guide/v10/server-side-rendering).

```jsx
// --repl
import { hydrate } from 'preact';

const Foo = () => <div>foo</div>;
hydrate(<Foo />, document.getElementById('container'));
```

## h() / createElement()

`h(type, props, ...children)`

Возвращает элемент Virtual DOM с заданными `props`. Элементы Virtual DOM — это легковесные описания узла в иерархии UI вашего приложения, по сути объект формы `{ type, props }`.

После `type` и `props` все оставшиеся параметры собираются в свойство `children`.
Дочерние элементы могут быть любыми из следующих:

- Скалярные значения (строка, число, булево значение, null, undefined и т. д.)
- Вложенные элементы Virtual DOM
- Бесконечно вложенные массивы из вышеперечисленного

```js
import { h } from 'preact';

h('div', { id: 'foo' }, 'Привет!');
// <div id="foo">Привет!</div>

h('div', { id: 'foo' }, 'Привет,', null, ['Preact!']);
// <div id="foo">Привет, Preact!</div>

h('div', { id: 'foo' }, h('span', null, 'Привет!'));
// <div id="foo"><span>Привет!</span></div>
```

## toChildArray

Эта вспомогательная функция преобразует значение `props.children` в плоский массив (`Array`) независимо от его структуры или вложенности. Если `props.children` уже является массивом, возвращается копия. Эта функция полезна в случаях, когда `props.children` может не быть массивом, что может произойти с определёнными комбинациями статических и динамических выражений в JSX.

Для элементов Virtual DOM с одним дочерним элементом `props.children` является ссылкой на этот дочерний элемент. Когда дочерних элементов несколько, `props.children` всегда является массивом. Вспомогательная функция `toChildArray` предоставляет способ единообразной обработки всех случаев.

```jsx
import { toChildArray } from 'preact';

function Foo(props) {
	const count = toChildArray(props.children).length;
	return <div>У меня {count} дочерних элементов</div>;
}

// props.children — "bar"
render(<Foo>bar</Foo>, container);

// props.children — [<p>A</p>, <p>B</p>]
render(
	<Foo>
		<p>A</p>
		<p>B</p>
	</Foo>,
	container
);
```

## cloneElement

`cloneElement(virtualElement, props, ...children)`

Эта функция позволяет создать неглубокую копию элемента Virtual DOM.
Обычно используется для добавления или перезаписи `props` элемента:

```jsx
function Linkout(props) {
	// добавляем target="_blank" к ссылке:
	return cloneElement(props.children, { target: '_blank' });
}
render(
	<Linkout>
		<a href="/">главная</a>
	</Linkout>
);
// <a href="/" target="_blank">главная</a>
```

## createContext

Смотрите раздел в [Документации по Контексту](/guide/v10/context#createcontext).

## createRef

Предоставляет способ ссылаться на элемент или компонент после его рендеринга.

Смотрите [Документацию по Рефам](/guide/v10/refs#createref) для более подробной информации.

## Fragment

Особый тип компонента, который может иметь дочерние элементы, но не отображается как DOM-элемент.
Фрагменты позволяют возвращать несколько соседних дочерних элементов без необходимости оборачивать их в DOM-контейнер:

```jsx
// --repl
import { Fragment, render } from 'preact';

render(
	<Fragment>
		<div>A</div>
		<div>B</div>
		<div>C</div>
	</Fragment>,
	document.getElementById('container')
);
// Рендерит:
// <div id="container>
//   <div>A</div>
//   <div>B</div>
//   <div>C</div>
// </div>
```
