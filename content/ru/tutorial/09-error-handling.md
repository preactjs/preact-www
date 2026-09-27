---
title: Обработка ошибок
prev: /tutorial/08-keys
next: /tutorial/10-links
solvable: true
---

# Обработка ошибок

JavaScript — гибкий интерпретируемый язык, а значит, на нём можно очень легко встретить ошибки во время выполнения. Будь то результат непредвиденного сценария или ошибка в написанном нами коде, важно уметь отслеживать ошибки и реализовывать некоторую форму восстановления или изящной обработки ошибок.

В Preact для этого используется перехват ошибок и сохранение их в виде состояния. Это позволяет компоненту перехватить неожиданный или неработающий рендеринг и переключиться на рендеринг чего-то другого в качестве запасного варианта.

### Превращение ошибок в состояние

Для перехвата ошибок и превращения их в состояние доступны два API: `componentDidCatch` и `getDerivedStateFromError`. Функционально они похожи, и оба являются методами, которые можно реализовать в классовом компоненте.

**componentDidCatch** получает аргумент `Error` и может решать, что делать в ответ на эту ошибку в каждом конкретном случае. Он может вызвать метод `this.setState()` для отрисовки запасного или альтернативного дерева, который «поймает» ошибку и пометит её как обработанную. Или же метод может просто записать ошибку в журнал и продолжить работу без обработки (аварийно завершить работу).

**getDerivedStateFromError** — статический метод, принимающий `Error`, и возвращающий объект обновления состояния, который применяется к компоненту через `setState()`. Поскольку этот метод всегда производит изменение состояния, приводящее к перерендерингу компонента, он всегда помечает ошибки как обработанные.

В следующем примере показано, как использовать любой из этих методов для перехвата ошибок и вывода изящного сообщения об ошибке вместо аварийного завершения:

```jsx
import { Component } from 'preact';

class ErrorBoundary extends Component {
	state = { error: null };

	static getDerivedStateFromError(error) {
		return { error: error.message };
	}

	componentDidCatch(error) {
		console.error(error);
		this.setState({ error: error.message });
	}

	render() {
		if (this.state.error) {
			return <p>О нет! Мы столкнулись с ошибкой: {this.state.error}</p>;
		}
		return this.props.children;
	}
}
```

Приведённый выше компонент является достаточно распространённым примером реализации обработки ошибок в приложениях Preact, часто называемым _Error Boundary_ («граница ошибки» или «предохранитель»).

### Вложенность и всплывание ошибок

Ошибки, возникающие при рендеринге дерева Virtual DOM в Preact, «всплывают», подобно событиям DOM. Начиная с компонента, встретившего ошибку, каждому родительскому компоненту в дереве предоставляется возможность обработать ошибку.

В результате _предохранители_ могут быть вложенными, если они реализованы с использованием `componentDidCatch`. Если метод `componentDidCatch()` компонента _не_ вызывает `setState()`, ошибка будет продолжать распространяться по дереву Virtual DOM до тех пор, пока не достигнет компонента с методом `componentDidCatch`, который _вызывает_ `setState()`.

## Попробуйте!

Чтобы проверить наши знания в области обработки ошибок, давайте добавим обработку ошибок в простой компонент _App_. Один из компонентов внутри _App_ может выдать ошибку в каком-либо сценарии, и мы хотим перехватить её, чтобы выдать дружелюбное сообщение пользователю, что мы столкнулись с непредвиденной ошибкой.

<solution>
  <h4>🎉 Поздравляем!</h4>
  <p>Вы узнали, как обрабатывать ошибки в коде Preact!</p>
</solution>

```js:setup
useResult(function(result) {
  var options = require('preact').options;

  var oe = options.__e;
  options.__e = function(error, s) {
    if (/objects are not valid/gi.test(error)) {
      throw Error('Похоже, что вы пытаетесь вывести объект Error напрямую: попробуйте сохранять `error.message` вместо самого `error`..');
    }
    oe.apply(this, arguments);
    setTimeout(function() {
      if (result.output.textContent.match(/ошибка/i)) {
        solutionCtx.setSolved(true);
      }
    }, 10);
  };

  return function () {
    options.__e = oe;
  };
}, []);
```

```jsx:repl-initial
import { render, Component } from 'preact';
import { useState } from 'preact/hooks';

function Clicker() {
  const [clicked, setClicked] = useState(false);

  if (clicked) {
    throw new Error('Ошибка');
  }

  return <button onClick={() => setClicked(true)}>Нажми меня</button>;
}

class App extends Component {
  state = { error: null };

  render() {
    return <Clicker />;
  }
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render, Component } from 'preact';
import { useState } from 'preact/hooks';

function Clicker() {
  const [clicked, setClicked] = useState(false);

  if (clicked) {
    throw new Error('Ошибка');
  }

  return <button onClick={() => setClicked(true)}>Нажми меня</button>;
}

class App extends Component {
  state = { error: null };

  componentDidCatch(error) {
    this.setState({ error: error.message });
  }

  render() {
    const { error } = this.state;
    if (error) {
      return <p>О нет! Произошла ошибка: {error}</p>
    }
    return <Clicker />;
  }
}

render(<App />, document.getElementById("app"));
```
