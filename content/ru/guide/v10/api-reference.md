---
title: Справочник по API
description: 'Информация обо всех экспортируемых функциях модуля Preact.'
---

# Справочник по API

Эта страница служит кратким обзором всех экспортируемых функций.

---

<toc></toc>

---

## Component

`Component` — это базовый класс, который можно расширить для создания компонентов Preact с сохранением состояния.

Вместо того, чтобы создавать экземпляры напрямую, компоненты управляются средством визуализации и создаются по мере необходимости.

```js
import { Component } from 'preact';

class MyComponent extends Component {
  // (см. ниже)
}
```

### Component.render(props, state)

Все компоненты должны иметь функцию `render()`. В функцию рендеринга передаются текущие параметры и состояние компонента, и она должна возвращать элемент Virtual DOM (обычно «элемент JSX»), массив или `null`.

```jsx
import { Component } from 'preact';

class MyComponent extends Component {
  render(props, state) {
    // props то же самое, что и this.props
    // state то же самое, что и this.state

    return <h1>Привет, {props.name}!</h1>;
  }
}
```

Чтобы узнать больше о компонентах и ​​о том, как их можно использовать, ознакомьтесь с [документацией по компонентам](/guide/v10/components).

## render()

`render(virtualDom, containerNode, [replaceNode])`

Визуализация элемента Virtual DOM в родительский элемент DOM `containerNode`. Ничего не возвращает.

```jsx
// --repl
// Дерево DOM перед рендерингом:
// <div id="container"></div>

import { render } from 'preact';

const Foo = () => <div>foo</div>;

render(<Foo />, document.getElementById('container'));

// После рендеринга:
// <div id="container">
//  <div>foo</div>
// </div>
```

Если указан необязательный параметр `replaceNode`, он должен быть дочерним по отношению к `containerNode`. Вместо того, чтобы делать вывод о том, с чего начать рендеринг, Preact обновит или заменит переданный элемент, используя свой алгоритм сравнения.

> ⚠️ Аргумент `replaceNode` будет удален, начиная с Preact `v11`. Он вводит слишком много крайних случаев и ошибок, которые необходимо учитывать в остальной части исходного кода Preact. Мы оставляем этот раздел открытым по историческим причинам, но не рекомендуем никому использовать третий аргумент `replaceNode`.

```jsx
// Дерево DOM перед рендерингом:
// <div id="container">
//   <div>bar</div>
//   <div id="target">foo</div>
// </div>

import { render } from 'preact';

const Foo = () => <div id='target'>BAR</div>;

render(<Foo />, document.getElementById('container'), document.getElementById('target'));

// После рендеринга:
// <div id="container">
//   <div>bar</div>
//   <div id="target">BAR</div>
// </div>
```

Первый аргумент должен быть допустимым элементом Virtual DOM, который представляет либо компонент, либо элемент. При передаче компонента важно позволить Preact создать экземпляр, а не вызывать ваш компонент напрямую, что может привести к неожиданным поломкам:

```jsx
const App = () => <div>foo</div>;

// НЕЛЬЗЯ: Прямой вызов компонентов означает, что они не будут считаться
// VNode и, следовательно, не смогут использовать функциональность, связанную с vnodes.
render(App(), rootElement); // ОШИБКА
render(App, rootElement); // ОШИБКА

// НУЖНО: Передача компонентов с помощью h() или JSX позволяет Preact корректно отображать:
render(h(App), rootElement); // успешно
render(<App />, rootElement); // успешно
```

## hydrate()

Если вы уже предварительно отрисовали свое приложение в HTML, Preact может пропустить большую часть работы по отрисовке при загрузке в браузере. Это можно включить, переключившись с `render()` на `hydrate()`, что позволяет пропустить большую часть различий, но при этом подключить прослушиватели событий и настроить дерево компонентов. Это работает только при использовании в сочетании с предварительным рендерингом или [серверным рендерингом](/guide/v10/server-side-rendering).

```jsx
// --repl
import { hydrate } from 'preact';

const Foo = () => <div>foo</div>;
hydrate(<Foo />, document.getElementById('container'));
```

## h() / createElement()

`h(type, props, ...children)`

Возвращает элемент Virtual DOM с заданными параметрами `props`. Элементы Virtual DOM — это упрощённые описания узла в иерархии пользовательского интерфейса вашего приложения, по сути, это объект формы `{ type, props }`.

После `type` и `props` все оставшиеся параметры собираются в свойство `children`.
Дочерние элементы (`children`) могут быть любыми из следующих:

- Скалярные значения (string, number, boolean, null, undefined, etc)
- Вложенные элементы Virtual DOM
- Бесконечно вложенные массивы вышеперечисленного

```js
import { h } from 'preact';

h('div', { id: 'foo' }, 'Привет!');
// <div id="foo">Привет!</div>

h('div', { id: 'foo' }, 'Привет, ', null, ['Preact!']);
// <div id="foo">Привет, Preact!</div>

h('div', { id: 'foo' }, h('span', null, 'Привет!'));
// <div id="foo"><span>Привет!</span></div>
```

## toChildArray

Эта вспомогательная функция преобразует значение `props.children` в плоский массив независимо от его структуры или вложенности. Если `props.children` уже является массивом, возвращается его копия. Эта функция полезна в тех случаях, когда `props.children` не может быть массивом, что может произойти с определёнными комбинациями статических и динамических выражений в JSX.

Для элементов Virtual DOM с одним дочерним элементом `props.children` является ссылкой на дочерний элемент. Если дочерних элементов несколько, `props.children` всегда является массивом. Хэлпер `toChildArray` позволяет последовательно обрабатывать все случаи.

```jsx
import { toChildArray } from 'preact';

function Foo(props) {
  const count = toChildArray(props.children).length;
  return <div>У меня {count} дочерних элементов</div>;
}

// props.children это "bar"
render(<Foo>bar</Foo>, container);

// props.children это [<p>A</p>, <p>B</p>]
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

Эта функция позволяет вам создать неглубокую копию элемента Virtual DOM.
Обычно он используется для добавления или перезаписи `props` элемента:

```jsx
function Linkout(props) {
  // добавляем target="_blank" для ссылки:
  return cloneElement(props.children, { target: '_blank' });
}
render(
  <Linkout>
    <a href='/'>главная</a>
  </Linkout>
);
// <a href="/" target="_blank">главная</a>
```

## createContext

См. раздел в [документации по контексту](/guide/v10/context#createcontext).

## createRef

Предоставляет способ ссылки на элемент или компонент после его визуализации.

Дополнительную информацию см. в [документации по рефам](/guide/v10/refs#создание-рефа).

## Fragment

Особый вид компонента, который может иметь дочерние элементы, но не отображается как элемент DOM.
Фрагменты позволяют возвращать несколько одноуровневых дочерних элементов без необходимости заключать их в DOM-контейнер:

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
// Выводит:
// <div id="container>
//   <div>A</div>
//   <div>B</div>
//   <div>C</div>
// </div>
```
