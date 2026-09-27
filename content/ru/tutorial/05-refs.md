---
title: Refs
prev: /tutorial/04-state
next: /tutorial/06-context
solvable: true
---

# Refs

Как мы узнали в первой главе, DOM предоставляет императивный API, позволяющий вносить изменения путём вызова функций для элементов. Одним из примеров, когда нам может потребоваться доступ к императивному DOM API из компонента Preact, является автоматическое перемещение фокуса на элемент ввода.

Свойство `autoFocus` (или атрибут `autofocus`) может быть использовано для фокусировки ввода при первом его отображении, однако бывают ситуации, когда мы хотим переместить фокус на ввод в определённое время или в ответ на определённое событие.

Для таких случаев, когда нам необходимо напрямую взаимодействовать с элементами DOM, мы можем использовать функцию, называемую «refs». Ссылка `ref` — это обычный JavaScript-объект со свойством `current`, которое указывает на любое значение. Объекты JavaScript передаются по ссылке, что означает, что любая функция, имеющая доступ к объекту `ref`, может получить или установить его значение с помощью свойства `current`. Preact не отслеживает изменения объектов `ref`, поэтому они могут использоваться для хранения информации во время рендеринга, к которой впоследствии может обратиться любая функция, имеющая доступ к объекту `ref`.

Мы можем увидеть, как выглядит прямое использование `ref` без отрисовки чего-либо:

```js
import { createRef } from 'preact';

// создание ref:
const ref = createRef('initial value');
// { current: 'initial value' }

// чтение текущего значения ref:
ref.current === 'initial value';

// обновление текущего значения ref:
ref.current = 'new value';

// передача ref:
console.log(ref); // { current: 'new value' }
```

Полезность использования ссылок в Preact заключается в том, что объект ссылки может быть передан элементу Virtual DOM во время рендеринга, и Preact установит значение ссылки (её свойство `current`) в соответствующий HTML-элемент. После установки мы можем использовать текущее значение ссылки для доступа и модификации HTML-элемента:

```jsx
import { createRef } from 'preact';

// создание ref:
const input = createRef();

// передача ref в качестве атрибута элемента Virtual DOM
render(<input ref={input} />, document.body);

// доступ к ассоциированному элементу DOM:
input.current; // элемент HTML <input>
input.current.focus(); // фокусировка ввода
```

Использовать `createRef()` глобально не рекомендуется, так как при многократном рендеринге текущее значение ссылки будет перезаписано. Вместо этого лучше всего хранить ссылки как свойства класса:

```jsx
import { createRef, Component } from 'preact';

export default class App extends Component {
	input = createRef();

	// эта функция запускается после рендеринга <App>
	componentDidMount() {
		// доступ к ассоциированному элементу DOM:
		this.input.current.focus();
	}

	render() {
		return <input ref={this.input} />;
	}
}
```

Для функциональных компонентов хук `useRef()` обеспечивает удобный способ создания ссылки и доступа к ней при последующих отрисовках. В следующем примере также показано использование хука `useEffect()` для выполнения обратного вызова после рендеринга нашего компонента, в котором текущим значением `ref` станет HTML-элемент `input`:

```jsx
import { useRef, useEffect } from 'preact/hooks';

export default function App() {
	// создание или получение ref
	const input = useRef();

	// здесь обратный вызов будет выполняться после рендеринга <App>:
	useEffect(() => {
		// доступ к ассоциированному элементу DOM:
		input.current.focus();
	}, []);

	return <input ref={input} />;
}
```

Помните, что _refs_ не ограничиваются хранением только элементов DOM. Они могут использоваться для хранения информации между рендерингами компонента без установки состояния, вызывающего дополнительный рендеринг. В одной из следующих глав мы увидим, как это можно использовать.

## Попробуйте!

Теперь давайте применим это на практике, создав кнопку, которая при щелчке мыши фокусирует поле ввода, обращаясь к нему по ссылке.

<solution>
  <h4>🎉 Поздравляем!</h4>
  <p><code>pro = createRef()</code> → <code>pro.current = 'вы'</code></p>
</solution>

```js:setup
function patch(input) {
  if (input.__patched) return;
  input.__patched = true;
  var old = input.focus;
  input.focus = function() {
    solutionCtx.setSolved(true);
    return old.call(this);
  };
}

useResult(function (result) {
  var expectedInput;
  var timer;
  [].forEach.call(result.output.querySelectorAll('input'), patch);

  var options = require('preact').options;

  var oe = options.event;
  options.event = function(e) {
    if (e.currentTarget.localName !== 'button') return;
    clearTimeout(timer);
    var input = e.currentTarget.parentNode.parentNode.querySelector('input');
    expectedInput = input;
    if (input) patch(input);
    timer = setTimeout(function() {
      if (expectedInput === input) {
        expectedInput = null;
      }
    }, 10);
    if (oe) return oe.apply(this, arguments);
  }

  return function () {
    options.event = oe;
  };
}, []);
```

```jsx:repl-initial
import { render } from 'preact';
import { useRef } from 'preact/hooks';

function App() {
  function onClick() {

  }

  return (
    <div>
      <input defaultValue="Привет, мир!" />
      <button onClick={onClick}>Передать фокус элементу ввода</button>
    </div>
  );
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from 'preact';
import { useRef } from 'preact/hooks';

function App() {
  const input = useRef();

  function onClick() {
    input.current.focus();
  }

  return (
    <div>
      <input ref={input} defaultValue="Привет, мир!" />
      <button onClick={onClick}>Передать фокус элементу ввода</button>
    </div>
  );
}

render(<App />, document.getElementById("app"));
```
