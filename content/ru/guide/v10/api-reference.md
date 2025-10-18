---
title: Справочник по API
description: Информация обо всех экспортируемых функциях модуля Preact
---

# Справочник по API

Эта страница служит кратким обзором всех экспортируемых функций.

---

<toc></toc>

---

## preact

Модуль `preact` предоставляет только базовую функциональность, такую как создание элементов VDOM и рендеринг компонентов. Дополнительные утилиты предоставляются через различные подмодули, такие как `preact/hooks`, `preact/compat`, `preact/debug` и т. д.

### Component

`Component` — это базовый класс, который можно расширить для создания компонентов Preact с сохранением состояния.

Вместо того, чтобы создавать экземпляры напрямую, компоненты управляются средством визуализации и создаются по мере необходимости.

```js
import { Component } from 'preact';

class MyComponent extends Component {
  // (см. ниже)
}
```

#### Component.render(props, state)

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

### render()

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

Первый аргумент должен быть валидным элементом Virtual DOM, который представляет либо компонент, либо элемент. При передаче компонента важно позволить Preact выполнить инстанцирование, а не вызывать ваш компонент напрямую, что приведет к неожиданным сбоям:

```jsx
const App = () => <div>foo</div>;

// НЕЛЬЗЯ: Прямой вызов компонентов означает, что они не будут считаться
// VNode и, следовательно, не смогут использовать функциональность, связанную с vnodes.
render(App(), rootElement); // ОШИБКА
render(App, rootElement); // ОШИБКА

// МОЖНО: Передача компонентов с использованием h() или JSX позволяет Preact рендерить правильно:
render(h(App), rootElement); // успешно
render(<App />, rootElement); // успешно
```

Если предоставлен необязательный параметр `replaceNode`, он должен быть дочерним элементом `containerNode`. Вместо определения места начала рендеринга Preact будет обновлять или заменять переданный элемент с использованием своего алгоритма сравнения.

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

> ⚠️ Аргумент `replaceNode` будет удалён в Preact `v11`. Он вводит слишком много крайних случаев и ошибок, которые необходимо учитывать в остальной части исходного кода Preact. Если вам всё ещё нужна эта функциональность, мы рекомендуем использовать [`preact-root-fragment`](/guide/v10/preact-root-fragment), небольшую вспомогательную библиотеку, которая предоставляет аналогичную функциональность. Она совместима как с Preact `v10`, так и с `v11`.

### hydrate()

`hydrate(virtualDom, containerNode)`

Если вы уже предварительно отрисовали свое приложение в HTML, Preact может пропустить большую часть работы по отрисовке при загрузке в браузере. Это можно включить, переключившись с `render()` на `hydrate()`, что позволяет пропустить большую часть различий, но при этом подключить прослушиватели событий и настроить дерево компонентов. Это работает только при использовании в сочетании с предварительным рендерингом или [серверным рендерингом](/guide/v10/server-side-rendering).

```jsx
// --repl
import { hydrate } from 'preact';

const Foo = () => <div>foo</div>;
hydrate(<Foo />, document.getElementById('container'));
```

### h() / createElement()

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

### toChildArray

`toChildArray(componentChildren)`

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

### cloneElement

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

### createContext

`createContext(initialState)`

Создаёт новый объект контекста, который можно использовать для передачи данных через дерево компонентов, не передавая пропсы на каждом уровне.

См. раздел в [документации по контексту](/guide/v10/context#createcontext).


```jsx
import { createContext } from 'preact';

const MyContext = createContext(defaultValue);
```

### createRef

`createRef(initialValue)`

Создаёт новый объект Ref, который служит стабильным локальным значением, сохраняющимся между рендерами.  
Может использоваться для хранения ссылок на DOM-элементы, экземпляры компонентов или любые произвольные значения.

Предоставляет способ ссылки на элемент или компонент после его визуализации.

Дополнительную информацию см. в [документации по рефам](/guide/v10/refs#создание-рефа).

```jsx
import { createRef, Component } from 'preact';

class MyComponent extends Component {
    inputRef = createRef(null);

    // ...
}
```

### Fragment

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

### isValidElement

`isValidElement(virtualElement)`

Проверяет, является ли переданное значение допустимым виртуальным элементом (VNode) Preact.

```jsx
import { isValidElement, h } from 'preact';

isValidElement(<div />); // true
isValidElement(h('div')); // true

isValidElement('div'); // false
isValidElement(null); // false
```

### options

Подробнее см. в документации [по опционным хукам]](/guide/v10/options)

## preact/hooks

Подробнее см. в разделе [Хуки](/guide/v10/hooks). Обратите внимание, что на этой странице упомянуты некоторые «хуки, специфичные для Compat», которые недоступны в `preact/hooks`, а есть только в `preact/compat`.

## preact/compat

`preact/compat` — это слой совместимости, позволяющий использовать Preact в качестве полноценной замены React.
Он предоставляет все API из `preact` и `preact/hooks`, а также несколько дополнительных, чтобы соответствовать API React.

### Children

Для совместимости предоставляется объект `Children`, который представляет собой обёртку над функцией [`toChildArray`](#tochildarray) из ядра. В Preact-приложениях его использование, как правило, не требуется.

#### Children.map

`Children.map(children, fn, [context])`

Проходит по всем дочерним элементам и возвращает новый массив, аналогично методу [`Array.prototype.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

```jsx
function List(props) {
  const children = Children.map(props.children, child => (
    <li>{child}</li>
  ));
  return (
    <ul>
      {children}
    </ul>
  );
}
```

> Примечание: можно заменить на `toChildArray(props.children).map(...)`.

#### Children.forEach

`Children.forEach(children, fn, [context])`

Проходит по всем дочерним элементам, но не возвращает новый массив, аналогично методу [`Array.prototype.forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).

```jsx
function List(props) {
  const children = [];
  Children.forEach(props.children, child =>
    children.push(<li>{child}</li>)
  );
  return (
    <ul>
      {children}
    </ul>
  );
}
```

> Примечание: можно заменить на `toChildArray(props.children).forEach(...)`.

#### Children.count

`Children.count(children)`

Возвращает общее количество дочерних элементов.

```jsx
function MyComponent(props) {
  const children = Children.count(props.children);
  return <div>У меня {children.length} дочерних элементов</div>;
}
```

> Примечание: можно заменить на `toChildArray(props.children).length`.

#### Children.only

`Children.only(children)`

Выбрасывает исключение, если количество дочерних элементов не равно точно одному. В противном случае возвращает единственный дочерний элемент.

```jsx
function List(props) {
  const singleChild = Children.only(props.children);
  return (
    <ul>
      {singleChild}
    </ul>
  );
}
```

#### Children.toArray

`Children.count(children)`

Преобразует дочерние элементы в плоский массив. Псевдоним для [`toChildArray`](#tochildarray).

```jsx
function MyComponent(props) {
  const children = Children.toArray(props.children);
  return <div>I have {children.length} children</div>;
}
```

> Примечание: можно заменить на `toChildArray(props.children)`.

### createPortal

`createPortal(virtualDom, containerNode)`

Позволяет рендерить в другом месте в дереве DOM, кроме естественного родителя вашего компонента.

```html
<html>
  <body>
    <!-- Модальные окна должны рендериться здесь -->
    <div id="modal-root"></div>
    <!-- App рендерится здесь -->
    <div id="app"></div>
  </body>
</html>
```

```jsx
import { createPortal } from 'preact/compat';
import { MyModal } from './MyModal.jsx';

function App() {
  const container = document.getElementById('modal-root');
  return (
    <div>
      <h1>My App</h1>
      {createPortal(<MyModal />, container)}
    </div>
  );
}
```

### PureComponent

Класс `PureComponent` работает аналогично `Component`. Разница в том, что `PureComponent` пропустит рендеринг, когда новые пропсы равны старым. Для этого мы сравниваем старые и новые пропсы с помощью поверхностного сравнения, при котором проверяется референциальное равенство каждого свойства пропсов. Это может значительно ускорить приложения за счёт предотвращения ненужных повторных рендерингов. Это достигается путём добавления по умолчанию хука жизненного цикла `shouldComponentUpdate`.

```jsx
import { render } from 'preact';
import { PureComponent } from 'preact/compat';

class Foo extends PureComponent {
  render(props) {
    console.log('render');
    return <div />;
  }
}

const dom = document.getElementById('root');
render(<Foo value="3" />, dom);
// Логирует: "render"

// Рендеринг во второй раз, ничего не логирует
render(<Foo value="3" />, dom);
```

> Обратите внимание, что преимущество `PureComponent` окупается только когда рендеринг дорогой. Для простых деревьев дочерних элементов может быть быстрее просто выполнить `render`, чем тратить время на сравнение пропсов.

### memo

`memo` эквивалентен функциональным компонентам так же, как `PureComponent` — классам. Он использует ту же функцию сравнения под капотом, но позволяет указать свою собственную специализированную функцию, оптимизированную для вашего случая использования.

```jsx
import { memo } from 'preact/compat';

function MyComponent(props) {
  return <div>Hello {props.name}</div>;
}

// Использование с функцией сравнения по умолчанию
const Memoed = memo(MyComponent);

// Использование с пользовательской функцией сравнения
const Memoed2 = memo(MyComponent, (prevProps, nextProps) => {
  // Повторный рендеринг только при изменении `name`
  return prevProps.name === nextProps.name;
});
```

> Функция сравнения отличается от `shouldComponentUpdate` тем, что она проверяет, являются ли два объекта пропсов равными, в то время как `shouldComponentUpdate` проверяет, отличаются ли они.

### forwardRef

В некоторых случаях при написании компонента вы хотите позволить пользователю получить доступ к конкретной ссылке дальше по дереву. С помощью `forwardRef` вы можете, в некотором роде, «передать» свойство `ref`:

```jsx
import { createRef, render } from 'preact';
import { forwardRef } from 'preact/compat';

const MyComponent = forwardRef((props, ref) => {
  return <div ref={ref}>Hello world</div>;
});

// Использование: `ref` будет содержать ссылку на внутренний `div` вместо
// `MyComponent`
const ref = createRef();
render(<MyComponent ref={ref} />, dom);
```

Этот компонент наиболее полезен для авторов библиотек.

### StrictMode

`<StrictMode><App /></StrictMode>`

Предлагается исключительно для обеспечения совместимости, `<StrictMode>` — это просто псевдоним [`Fragment`](#Fragment). Он не предоставляет никаких дополнительных проверок или предупреждений, все из которых обеспечиваются [`preact/debug`](#preactdebug).

```jsx
import { StrictMode } from 'preact/compat';

render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.getElementById('root')
);
```

### Suspense

`<Suspense fallback={...}>...</Suspense>`

Компонент, который можно использовать для «ожидания» завершения некоторой асинхронной операции перед рендерингом своих дочерних элементов. Пока происходит ожидание, он будет рендерить предоставленный контент `fallback`.

```jsx
import { Suspense } from 'preact/compat';

function MyComponent() {
    return (
        <Suspense fallback={<div>Загрузка...</div>}>
            <MyLazyComponent />
        </Suspense>
    );
}
```

### lazy

`lazy(loadingFunction)`

Позволяет отсрочить загрузку компонента до тех пор, пока он действительно не понадобится. Это полезно для разделения кода и ленивой загрузки частей вашего приложения.

```jsx
import { lazy } from 'preact/compat';

const MyLazyComponent = lazy(() => import('./MyLazyComponent.jsx'));
```

## preact/debug

`preact/debug` предоставляет некоторые низкоуровневые утилиты отладки, которые можно использовать для помощи в выявлении проблем тем, кто создаёт очень специфический инструментарий поверх Preact. Крайне маловероятно, что любой обычный пользователь должен напрямую использовать какие-либо из функций ниже; вместо этого вы должны импортировать `preact/debug` в корне вашего приложения, чтобы включить полезные предупреждения и сообщения об ошибках.

### resetPropWarnings

`resetPropWarnings()`

Сбрасывает внутреннюю историю того, какие предупреждения о типах пропсов уже были залогированы. Это полезно при запуске тестов, чтобы обеспечить, что каждый тест начинается с чистого листа.

```jsx
import { resetPropWarnings } from 'preact/debug';
import PropTypes from 'prop-types';

function Foo(props) {
  return <h1>{props.title}</h1>;
}

Foo.propTypes = {
  title: PropTypes.string.isRequired
};

render(<Foo />, document.getElementById('app'));
// Логирует: Предупреждение: Неудачная проверка типа пропса: Проп `title` помечен как обязательный в `Foo`, но его значение равно `undefined`.

expect(console.error).toHaveBeenCalledOnce();

resetPropWarnings();

//...

```

### getCurrentVNode

`getCurrentVNode()`

Возвращает текущий VNode, который рендерится.

```jsx
import { render } from 'preact';
import { getCurrentVNode } from 'preact/debug';

function MyComponent() {
  const currentVNode = getCurrentVNode();
  console.log(currentVNode); // Логирует: Object { type: MyComponent(), props: {}, key: undefined, ref: undefined, ... }

  return <h1>Привет, мир!</h1>
}

render(<MyComponent />, document.getElementById('app'));
```

### getDisplayName

`getDisplayName(vnode)`

Возвращает строковое представление типа элемента Virtual DOM, полезное для отладки и сообщений об ошибках.

```js
import { h } from 'preact';
import { getDisplayName } from 'preact/debug';

getDisplayName(h('div')); // "div"
getDisplayName(h(MyComponent)); // "MyComponent"
getDisplayName(h(() => <div />)); // "<empty string>"
```

### getOwnerStack

`getOwnerStack(vnode)`

Возвращает стек компонентов, который был захвачен на данный момент.

```jsx
import { render, options } from 'preact';
import { getOwnerStack } from 'preact/debug';

const oldVNode = options.diffed;
options.diffed = (vnode) => {
  if (vnode.type === 'h1') {
    console.log(getOwnerStack(vnode));
    // Логирует:
    //
    // в h1 (в /path/to/file.jsx:17)
    // в MyComponent (в /path/to/file.jsx:20)
  }
  if (oldVNode) oldVNode(vnode);
};

function MyComponent() {
  return <h1>Привет, мир!</h1>;
}

render(<MyComponent />, document.getElementById('app'));
```

## preact/devtools

### addHookName

`addHookName(value, name)`

Отображает пользовательскую метку для хука в devtools. Это может быть полезно, когда в одном компоненте имеется несколько хуков одного и того же типа и вы хотите иметь возможность их различать.

```jsx
import { addHookName } from 'preact/devtools';
import { useState } from 'preact/hooks';

function useCount(init) {
  return addHookName(useState(init), 'count');
}

function App() {
  const [count, setCount] = useCount(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count}
    </button>;
  );
}
```

## preact/jsx-runtime

Коллекция функций, которые могут использоваться транспайлерами JSX, такими как [трансформация «automatic runtime» Babel](https://babeljs.io/docs/babel-plugin-transform-react-jsx#react-automatic-runtime) или [трансформация «precompile» Deno](https://docs.deno.com/runtime/reference/jsx/#jsx-precompile-transform). Не обязательно предназначена для прямого использования.

### jsx

`jsx(type, props, [key], [isStaticChildren], [__source], [__self])`

Возвращает элемент Virtual DOM с предоставленными `props`. Аналогичен `h()`, но реализует API «automatic runtime» Babel.

```js
import { jsx } from 'preact/jsx-runtime';

jsx('div', { id: 'foo', children: 'Привет!' });
// <div id="foo">Привет!</div>
```

### jsxs

Псевдоним [`jsx`](#jsx), предоставлен для совместимости.

### jsxDev

Псевдоним [`jsx`](#jsx), предоставлен для совместимости.

### Fragment

Переэкспорт [`Fragment`](#fragment) из ядра.

### jsxTemplate

`jsxTemplate(templates, ...exprs)`

Создаёт шаблонный vnode. Используется трансформацией «precompile» Deno.

### jsxAttr

`jsxAttr(name, value)`

Сериализует HTML-атрибут в строку. Используется трансформацией «precompile» Deno.

### jsxEscape

`jsxEscape(value)`

Экранирует динамического дочернего элемента, переданного в [`jsxTemplate`](#jsxtemplate). Используется трансформацией «precompile» Deno.

## preact/test-utils

Коллекция утилит для облегчения тестирования компонентов Preact. Обычно они используются библиотеками для тестирования, такими как [`enzyme`](/guide/v10/unit-testing-with-enzyme) или [`@testing-library/preact`](/guide/v10/preact-testing-library), а не напрямую пользователями.

### setupRerender

`setupRerender()`

Настраивает функцию повторного рендеринга, которая опустошит очередь ожидающих рендерингов

### act

`act(callback)`

Запускает тестовую функцию и сбрасывает все эффекты и повторные рендеринги после её вызова.

### teardown

`teardown()`

Разбирает тестовую среду и сбрасывает внутреннее состояние Preact
