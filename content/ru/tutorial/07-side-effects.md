---
title: Побочные эффекты
prev: /tutorial/06-context
next: /tutorial/08-keys
solvable: true
---

# Побочные эффекты

Побочные эффекты — это фрагменты кода, которые выполняются при изменениях в дереве Virtual DOM. Они не следуют стандартному подходу, заключающемуся в приеме `props` и возврате нового дерева Virtual DOM, и часто выходят за пределы дерева для изменения состояния или вызова императивного кода, например, для обращения к API DOM. Побочные эффекты также часто используются в качестве способа инициирования выборки данных.

### Эффекты: побочные эффекты у функциональных компонентов

Один пример побочных эффектов в действии мы уже видели в предыдущей главе, когда изучали рефссылки и хук `useRef()`. После того как наш ref был заполнен свойством `current`, указывающим на элемент DOM, нам потребовался способ «запуска» кода, который затем будет взаимодействовать с этим элементом.

Для запуска кода после рендеринга мы использовали хук `useEffect()`, который является наиболее распространённым способом создания побочного эффекта из функционального компонента:

```jsx
import { useRef, useEffect } from 'preact/hooks';

export default function App() {
  const input = useRef();

  // здесь обратный вызов будет выполняться после рендеринга <App>:
  useEffect(() => {
    // доступ к ассоциированному элементу DOM:
    input.current.focus();
  }, []);

  return <input ref={input} />;
}
```

Обратите внимание на пустой массив, передаваемый в качестве второго аргумента в `useEffect()`. Обратные вызовы эффектов запускаются, когда любое значение в этом массиве «зависимостей» меняется от одной отрисовки к другой. Например, при первой визуализации компонента запускаются все обратные вызовы эффектов, поскольку нет предыдущих значений в массиве «зависимостей» для сравнения.

Мы можем добавить значения в массив «зависимостей» для запуска обратного вызова эффекта в зависимости от условий, а не только при первом отображении компонента. Обычно это используется для выполнения кода в ответ на изменение данных или при удалении компонента со страницы («размонтировании»).

Рассмотрим пример:

```js
import { useEffect, useState } from 'preact/hooks';

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('<App> только что был впервые представлен');
  }, []);

  useEffect(() => {
    console.log('count value was changed to: ', count);
  }, [count]);
  //  ^ Выполнять это при каждом изменении `count`, и при первом рендере

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Методы жизненного цикла: побочные эффекты классовых компонентов

Классовые компоненты также могут определять побочные эффекты, реализуя любой из доступных [методов жизненного цикла][lifecycle methods], предоставляемых Preact. Вот несколько наиболее часто используемых методов жизненного цикла:

| Метод жизненного цикла      | Когда он работает:                                   |
| :-------------------------- | :--------------------------------------------------- |
| `componentWillMount`        | непосредственно перед первым отображением компонента |
| `componentDidMount`         | после первого отображения компонента                 |
| `componentWillReceiveProps` | перед повторным рендерингом компонента               |
| `componentDidUpdate`        | после повторного рендеринга компонента               |

Одним из наиболее распространённых примеров использования побочных эффектов в классовых компонентах является получение данных при первом рендеринге компонента, а затем сохранение этих данных в состоянии. В следующем примере показан компонент, который после первого рендеринга запрашивает информацию о пользователе из JSON API, а затем отображает эту информацию.

```jsx
import { Component } from 'preact';

export default class App extends Component {
  // вызывается после первого рендеринга компонента:
  componentDidMount() {
    // получение JSON информации о пользователе, хранение в `state.user`:
    fetch('/api/user')
      .then((response) => response.json())
      .then((user) => {
        this.setState({ user });
      });
  }

  render(props, state) {
    const { user } = state;

    // если данные ещё не получены, показываем индикатор загрузки:
    if (!user) return <div>Загрузка...</div>;

    // у нас есть данные! показываем имя пользователя, полученное через API:
    return (
      <div>
        <h2>Привет, {user.username}!</h2>
      </div>
    );
  }
}
```

## Попробуйте!

Мы не будем усложнять это упражнение: измените пример кода справа, чтобы лог осуществлялся каждый раз при изменении `count`, а не только при первом рендеринге `<App>`.

<solution>
  <h4>🎉 Поздравляем!</h4>
  <p>Вы узнали, как использовать побочные эффекты в Preact.</p>
</solution>

```js:setup
useRealm(function (realm) {
  var win = realm.globalThis;
  var prevConsoleLog = win.console.log;
  win.console.log = function(m, s) {
    if (/Счётчик: /.test(m) && s === 1) {
      solutionCtx.setSolved(true);
    }
    return prevConsoleLog.apply(win.console, arguments);
  };

  return function () {
    win.console.log = prevConsoleLog;
  };
}, []);
```

```jsx:repl-initial
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Счётчик: ', count)
  }, []);
  // ^^ начните здесь!

  return <button onClick={() => setCount(count + 1)}>{count}</button>
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Счётчик: ', count)
  }, [count]);
  // ^^ начните здесь!

  return <button onClick={() => setCount(count + 1)}>{count}</button>
}

render(<App />, document.getElementById("app"));
```

[lifecycle methods]: /guide/v11/components#lifecycle-methods
