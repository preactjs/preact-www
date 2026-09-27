---
title: События
prev: /tutorial/01-vdom
next: /tutorial/03-components
solvable: true
---

# События

События — это то, с помощью чего мы делаем приложения интерактивными, реагируя на вводимые данные, такие как клавиатура и мышь, и на изменения, например, загрузку изображения. События в Preact работают так же, как и в DOM — любой тип события или поведение, которые вы можете найти в [MDN], могут быть использованы в Preact. В качестве примера приведем, как обычно регистрируются обработчики событий с использованием императивного DOM API:

```js
function clicked() {
	console.log('clicked');
}
const myButton = document.getElementById('my-button');
myButton.addEventListener('click', clicked);
```

Отличием Preact от DOM API является способ регистрации обработчиков событий. В Preact обработчики событий регистрируются декларативно как атрибуты элемента, подобно `style` и `class`. В общем случае любой атрибут, имя которого начинается с
с _on_ является обработчиком событий. Значение параметра обработчика события — это функция-обработчик, которая будет вызываться при наступлении данного события.

Например, мы можем прослушать событие «клика» на кнопке, добавив атрибут `onClick` с нашей функцией-обработчиком в качестве его значения:

```jsx
function clicked() {
  console.log('clicked')
}
<button onClick={clicked}>
```

Имена обработчиков событий, как и все имена атрибутов, чувствительны к регистру. Однако Preact определяет, когда вы регистрируете стандартный тип события на элементе (клик, изменение, перемещение и т. д.), и использует правильный регистр за кулисами. Именно поэтому `<button onClick={..}>` работает, несмотря на то, что событие имеет вид `"click"` (нижний регистр).

---

## Попробуйте!

В завершение этой главы попробуйте добавить свой собственный обработчик нажатия в JSX для элемента кнопки справа. В обработчике отобразите в консоли любое сообщение с помощью `console.log()`, как мы делали это выше.

После выполнения кода кликните на кнопке, чтобы вызвать обработчик события, и переходите к следующей главе.

<solution>
  <h4>🎉 Поздравляем!</h4>
  <p>Вы только что узнали, как работать с событиями в Preact.</p>
</solution>

```js:setup
useRealm(function (realm) {
  var win = realm.globalThis;
  var prevConsoleLog = win.console.log;
  win.console.log = function() {
    solutionCtx.setSolved(true);
    return prevConsoleLog.apply(win.console, arguments);
  };

  return function () {
    win.console.log = prevConsoleLog;
  };
}, []);
```

```jsx:repl-initial
import { render } from "preact";

function App() {
  return (
    <div>
      <p class="count">Счётчик:</p>
      <button>Нажми меня!</button>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from "preact";

function App() {
  const clicked = () => {
    console.log('hi')
  }

  return (
    <div>
      <p class="count">Счётчик:</p>
      <button onClick={clicked}>Нажми меня!</button>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

[MDN]: https://developer.mozilla.org/ru/docs/Learn/JavaScript/Building_blocks/Events
