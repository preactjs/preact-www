---
title: Компоненты
prev: /tutorial/02-events
next: /tutorial/04-state
solvable: true
---

# Компоненты

Как мы уже упоминали в первой части этого учебника, ключевым элементом приложений Virtual DOM является компонент. Компонент — это самостоятельная часть приложения, которая может быть отображена как часть дерева Virtual DOM, подобно элементу HTML. Компонент можно рассматривать как вызов функции: оба являются механизмами, обеспечивающими повторное использование и перенаправление кода.

Для иллюстрации создадим простой компонент `MyButton`, который возвращает дерево Virtual DOM, описывающее элемент HTML `<button>`:

```jsx
function MyButton(props) {
  return <button class='my-button'>{props.text}</button>;
}
```

Мы можем использовать этот компонент в приложении, ссылаясь на него в JSX:

```js
let vdom = <MyButton text='Нажми меня!' />;

// помните createElement? Вот во что компилируется приведенная выше строка:
let vdom = createElement(MyButton, { text: 'Нажми меня!' });
```

Везде, где вы используете JSX для описания деревьев HTML, вы также можете описывать деревья компонентов. Разница заключается в том, что компонент описывается в JSX с помощью имени, начинающегося с заглавного символа, который соответствует имени компонента (переменной JavaScript).

По мере того как Preact отображает дерево Virtual DOM, описанное вашим JSX, каждая функция компонента, которую он встречает, будет вызываться в этом месте дерева. В качестве примера мы можем вывести наш компонент `MyButton` в тело веб-страницы, передав ему JSX-элемент, описывающий этот компонент, для `render()`:

```jsx
import { render } from 'preact';

render(<MyButton text='Нажми меня!' />, document.body);
```

### Вложенные компоненты

Компоненты могут ссылаться на другие компоненты в возвращаемом ими дереве Virtual DOM. При этом создается дерево компонентов:

```jsx
function MediaPlayer() {
  return (
    <div>
      <MyButton text='Играть' />
      <MyButton text='Стоп' />
    </div>
  );
}

render(<MediaPlayer />, document.body);
```

Мы можем использовать эту технику для визуализации различных деревьев компонентов для разных сценариев. Давайте сделаем так, чтобы `MediaPlayer` показывал «Играть», если звук не воспроизводится, и кнопку «Стоп» во время воспроизведения звука:

```jsx
function MediaPlayer(props) {
  return <div>{props.playing ? <MyButton text='Стоп' /> : <MyButton text='Играть' />}</div>;
}

render(<MediaPlayer playing={false} />, document.body);
// выведет <button>Играть</button>

render(<MediaPlayer playing={true} />, document.body);
// выведет <button>Стоп</button>
```

> **Запомните:** фигурные скобки — `{curly}` — в JSX позволяют нам вернуться в обычный JavaScript.
> Здесь мы используем [условный тернарный оператор][ternary] для отображения различных кнопок в зависимости от значения параметра `playing`.

### Дочерние компоненты

Компоненты также могут быть вложенными, как и элементы HTML. Одна из причин, по которой компоненты являются мощным примитивом, заключается в том, что они позволяют нам применять пользовательскую логику для управления отображением элементов Virtual DOM, вложенных в компонент.

Принцип работы этой системы обманчиво прост: любые элементы Virtual DOM вложенные в компонент в JSX, передаются этому компоненту в виде специального свойства `children`. Компонент может выбирать, куда поместить свои дочерние компоненты, ссылаясь на них в JSX с использованием выражения `{children}`. Или же компоненты могут просто возвращать значение `children`, и Preact отрисует эти элементы Virtual DOM прямо в том месте, где этот компонент был размещен в дереве Virtual DOM.

```jsx
<Foo>
  <a />
  <b />
</Foo>;

function Foo(props) {
  return props.children; // [<a />, <b />]
}
```

Вспоминая предыдущий пример, можно сказать, что наш компонент `MyButton` ожидал в качестве отображаемого текста атрибут `text`, который был вставлен в элемент `<button>`. Что если мы хотим вывести на экран изображение вместо текста?

Перепишем `MyButton`, чтобы разрешить вложенность с помощью свойства `children`:

```jsx
function MyButton(props) {
  return <button class='my-button'>{props.children}</button>;
}

function App() {
  return (
    <MyButton>
      <img src='icon.png' />
      Нажми меня!
    </MyButton>
  );
}

render(<App />, document.body);
```

Теперь, когда мы рассмотрели несколько примеров рендеринга компонентов другими компонентами, надеюсь, стало понятно, как вложенные компоненты позволяют нам собирать сложные приложения из множества небольших отдельных частей.

---

### Типы компонентов

<!--
До сих пор мы видели компоненты, которые являются функциями. Функциональные компоненты принимают на вход `props`, а на выходе возвращают дерево Virtual DOM. Что если мы захотим написать компонент, который будет отображать различные деревья Virtual DOM на основе входных данных, отличных от `props`?

Помимо того, что компоненты могут отображать `props` в дерево Virtual DOM, они также могут обновляться _сами_. Это можно сделать двумя способами: компоненты класса и хуки. Мы рассмотрим хуки
-->

До сих пор мы видели компоненты, которые являются функциями. Функциональные компоненты принимают на вход `props`, а на выходе возвращают дерево Virtual DOM. Компоненты также могут быть написаны в виде JavaScript-классов, которые инстанцируются Preact и предоставляют метод `render()`, работающий подобно функции компонента.

Компоненты классов создаются путём расширения базового класса Preact `Component`. В приведённом ниже примере обратите внимание на то, как `render()` принимает на вход `props`, а на выходе возвращает дерево Virtual DOM — прямо как компонент функции!

```jsx
import { Component } from 'preact';

class MyButton extends Component {
  render(props) {
    return <button class='my-button'>{props.children}</button>;
  }
}

render(<MyButton>Нажми меня!</MyButton>, document.body);
```

Причина, по которой мы можем использовать класс для определения компонента, заключается в том, чтобы отслеживать _жизненный цикл_ нашего компонента. Каждый раз, когда Preact встречает компонент при рендеринге дерева Virtual DOM, он будет создавать новый экземпляр нашего класса (`new MyButton()`).

Однако, если вы помните из первой главы, Preact может многократно получать новые деревья Virtual DOM. Каждый раз, когда мы передаем Preact новое дерево, оно сравнивается с предыдущим деревом, чтобы определить, что изменилось между ними, и эти изменения применяются к странице.

Если компонент определен с помощью класса, то при любом _обновлении_ этого компонента в дереве будет повторно использоваться один и тот же экземпляр класса. Это означает, что внутри компонента класса можно хранить данные, которые будут доступны в следующий раз, когда вызывается его метод `render()`.

Компоненты класса также могут реализовывать ряд [методов жизненного цикла][lifecycle methods], которые Preact будет вызывать в ответ на изменения в дереве Virtual DOM:

```jsx
class MyButton extends Component {
  componentDidMount() {
    console.log('Привет из компонента <MyButton>!');
  }
  componentDidUpdate() {
    console.log('Компонент <MyButton> был обновлён!');
  }
  render(props) {
    return <button class='my-button'>{props.children}</button>;
  }
}

render(<MyButton>Click Me!</MyButton>, document.body);
// logs: "Привет из компонента <MyButton>!"

render(<MyButton>Click Me!</MyButton>, document.body);
// logs: "Компонент <MyButton> был обновлён!"
```

Жизненный цикл компонентов класса делает их полезным инструментом для создания частей приложения, реагирующих на изменения, а не для строгого отображения `props` на деревья. Они также предоставляют возможность хранить информацию отдельно в каждом месте, где они размещены в дереве Virtual DOM. В следующей главе мы рассмотрим, как компоненты могут обновлять свой участок дерева, когда они хотят его изменить.

---

## Попробуйте!

Чтобы попрактиковаться, давайте объединим то, что мы узнали о компонентах, с нашими навыками работы с событиями, полученными в предыдущих двух главах!

Создайте компонент `MyButton`, который принимает параметры `style`, `children` и `onClick` и возвращает HTML-элемент `<button>` с применёнными атрибутами, принимающими значения входных параметров.

<solution>
  <h4>🎉 Поздравляем!</h4>
  <p>Вы на пути к тому, чтобы стать профессионалом в области компонентов!</p>
</solution>

```js:setup
useRealm(function (realm) {
  var options = require('preact').options;
  var win = realm.globalThis;
  var prevConsoleLog = win.console.log;
  var hasComponent = false;
  var check = false;

  win.console.log = function() {
    if (hasComponent && check) {
      solutionCtx.setSolved(true);
    }
    return prevConsoleLog.apply(win.console, arguments);
  };

  var e = options.event;
  options.event = function(e) {
    if (e.type === 'click') {
      check = true;
      setTimeout(() => check = false);
    }
  };

  var r = options.__r;
  options.__r = function(vnode) {
    if (typeof vnode.type === 'function' && /MyButton/.test(vnode.type)) {
      hasComponent = true;
    }
  }

  return function () {
    options.event = e;
    options.__r = r;
    win.console.log = prevConsoleLog;
  };
}, []);
```

```jsx:repl-initial
import { render } from "preact";

function MyButton(props) {
  // начните здесь!
}

function App() {
  const clicked = () => {
    console.log('Привет!')
  }

  return (
    <div>
      <p class="count">Счётчик:</p>
      <button style={{ color: 'purple' }} onClick={clicked}>Нажми меня</button>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from "preact";

function MyButton(props) {
  return <button style={props.style} onClick={props.onClick}>{props.children}</button>
}

function App() {
  const clicked = () => {
    console.log('Привет!')
  }

  return (
    <div>
      <p class="count">Счётчик:</p>
      <MyButton style={{ color: 'purple' }} onClick={clicked}>Нажми меня</MyButton>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

[ternary]: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
[lifecycle methods]: /guide/v11/components#lifecycle-methods
