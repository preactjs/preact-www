---
title: Рефы
description: 'Рефы — это способ создания стабильных значений, которые локальны для экземпляра компонента и сохраняются между перерисовками.'
---

# Рефы

Ссылки на DOM-элементы, или рефы, — это стабильные локальные значения, которые сохраняются между перерисовками компонента, но не вызывают повторные перерисовки, как это делают состояние или пропсы при их изменении.

Чаще всего рефы используются для императивного управления DOM, но их можно использовать для хранения любых произвольных локальных значений, которые необходимо сохранить стабильными. Вы можете использовать их для отслеживания предыдущего значения состояния, хранения ссылки на идентификатор интервала или таймаута, или просто для хранения значения счётчика. Важно отметить, что рефы не должны использоваться для логики рендеринга; вместо этого их следует использовать только в методах жизненного цикла и обработчиках событий.

---

<toc></toc>

---

## Создание рефа

В Preact есть два способа создания рефов, в зависимости от предпочитаемого вами стиля компонентов: `createRef` (классовые компоненты) и `useRef` (функциональные компоненты/хуки). Оба API по сути работают одинаково: они создают стабильный, простой объект со свойством `current`, которое можно инициализировать значением по желанию.

<tab-group tabstring="Classes, Hooks">

```jsx
import { createRef } from "preact";

class MyComponent extends Component {
  countRef = createRef();
  inputRef = createRef(null);

  // ...
}
```

```jsx
import { useRef } from "preact/hooks";

function MyComponent() {
  const countRef = useRef();
  const inputRef = useRef(null);

  // ...
}
```

</tab-group>

## Использование рефов для доступа к DOM-узлам

Наиболее распространённый случай использования рефов — это доступ к базовому DOM-узлу компонента. Это полезно для императивного управления DOM, такого как измерение элементов, вызов нативных методов на различных элементах (например, `.focus()` или `.play()`), а также интеграция со сторонними библиотеками, написанными на чистом JavaScript. В следующих примерах, после рендеринга, Preact присвоит DOM-узел свойству `current` объекта рефа, что сделает его доступным для использования после монтирования компонента.

<tab-group tabstring="Classes, Hooks">

```jsx
// --repl
import { render, Component, createRef } from "preact";
// --repl-before
class MyInput extends Component {
  ref = createRef(null);

  componentDidMount() {
    console.log(this.ref.current);
    // Logs: [HTMLInputElement]
  }

  render() {
    return <input ref={this.ref} />;
  }
}
// --repl-after
render(<MyInput />, document.getElementById("app"));
```

```jsx
// --repl
import { render } from "preact";
import { useRef, useEffect } from "preact/hooks";
// --repl-before
function MyInput() {
  const ref = useRef(null);

  useEffect(() => {
    console.log(ref.current);
    // Logs: [HTMLInputElement]
  }, []);

  return <input ref={ref} />;
}
// --repl-after
render(<MyInput />, document.getElementById("app"));
```

</tab-group>

### Колбэк-рефы

Другой способ использования рефов — это передача функции в проп `ref`, где DOM-узел будет передан в качестве аргумента.


<tab-group tabstring="Classes, Hooks">

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class MyInput extends Component {
  render() {
    return (
      <input ref={(dom) => {
        console.log('Mounted:', dom);

        // Начиная с Preact 10.23.0, вы можете по желанию вернуть функцию очистки
        return () => {
          console.log('Unmounted:', dom);
        };
      }} />
    );
  }
}
// --repl-after
render(<MyInput />, document.getElementById("app"));
```

```jsx
// --repl
import { render } from "preact";
// --repl-before
function MyInput() {
  return (
    <input ref={(dom) => {
      console.log('Mounted:', dom);

      // Начиная с Preact 10.23.0, вы можете по желанию вернуть функцию очистки
      return () => {
        console.log('Unmounted:', dom);
      };
    }} />
  );
}
// --repl-after
render(<MyInput />, document.getElementById("app"));
```

</tab-group>

> Если предоставленный колбэк рефа нестабилен (например, определённый инлайн, как показано выше) и _не_ возвращает функцию очистки, **он будет вызываться дважды** при каждом повторном рендере: сначала с `null`, а затем с фактической ссылкой. Это распространённая проблема, и API `createRef`/`useRef` немного упрощают это, заставляя пользователя проверять, определено ли `ref.current`.
>
> Сравнительно стабильной функцией может быть метод экземпляра классового компонента, функция, определённая вне компонента, или функция, созданная с помощью `useCallback`, например.

## Использование рефов для хранения локальных значений

Однако рефы не ограничиваются только хранением DOM-узлов; их можно использовать для хранения любого типа значений, которые могут понадобиться.

В следующем примере мы храним идентификатор интервала в рефе, чтобы иметь возможность запускать и останавливать его независимо.

<tab-group tabstring="Classes, Hooks">

```jsx
// --repl
import { render, Component, createRef } from "preact";
// --repl-before
class SimpleClock extends Component {
  state = {
    time: Date.now(),
  };
  intervalId = createRef(null);

  startClock = () => {
    this.setState({ time: Date.now() });
    this.intervalId.current = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  };

  stopClock = () => {
    clearInterval(this.intervalId.current);
  };


  render(_, { time }) {
    const formattedTime = new Date(time).toLocaleTimeString();

    return (
      <div>
        <button onClick={this.startClock}>Start Clock</button>
        <time dateTime={formattedTime}>{formattedTime}</time>
        <button onClick={this.stopClock}>Stop Clock</button>
      </div>
    );
  }
}
// --repl-after
render(<SimpleClock />, document.getElementById("app"));
```

```jsx
// --repl
import { render } from "preact";
import { useState, useRef } from "preact/hooks";
// --repl-before
function SimpleClock() {
  const [time, setTime] = useState(Date.now());
  const intervalId = useRef(null);

  const startClock = () => {
    setTime(Date.now());
    intervalId.current = setInterval(() => {
      setTime(Date.now());
    }, 1000);
  };

  const stopClock = () => {
    clearInterval(intervalId.current);
  };

  const formattedTime = new Date(time).toLocaleTimeString();

  return (
    <div>
      <button onClick={startClock}>Start Clock</button>
      <time dateTime={formattedTime}>{formattedTime}</time>
      <button onClick={stopClock}>Stop Clock</button>
    </div>
  );
}
// --repl-after
render(<SimpleClock />, document.getElementById("app"));
```

</tab-group>
