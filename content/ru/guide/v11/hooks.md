---
title: Хуки
description: Хуки в Preact позволяют комбинировать поведение и повторно использовать эту логику в различных компонентах
---

# Хуки

Hooks API — это альтернативный способ написания компонентов в Preact. Хуки позволяют компоновать состояние и побочные эффекты, упрощая повторное использование логики с состоянием по сравнению с классовыми компонентами.

Если вы долго работали с классовыми компонентами в Preact, вы, возможно, знакомы с шаблонами, такими как «рендер-пропсы» и «компоненты высшего порядка», которые пытаются решать эти проблемы. Эти решения, как правило, усложняют чтение кода и делают его более абстрактным. Hooks API позволяет аккуратно выделять логику для состояния и побочных эффектов, а также упрощает модульное тестирование этой логики независимо от компонентов, которые от нее зависят.

Хуки можно использовать в любом компоненте, что позволяет избежать многих ошибок, связанных с ключевым словом `this`, на которое опирается API классовых компонентов. Вместо доступа к свойствам из экземпляра компонента хуки полагаются на замыкания. Это делает их привязанными к значениям и устраняет ряд проблем с устаревшими данными, которые могут возникнуть при асинхронном обновлении состояния.

Есть два способа импорта хуков: из `preact/hooks` или `preact/compat`.

---

<toc></toc>

---

## Введение

Самый простой способ понять хуки — сравнить их с эквивалентными компонентами на основе классов.

В качестве примера мы будем использовать простой компонент счётчика, который отображает число, и кнопку, увеличивающую его на единицу:

```jsx
// --repl
import { render, Component } from 'preact';
// --repl-before
class Counter extends Component {
  state = {
    value: 0,
  };

  increment = () => {
    this.setState((prev) => ({ value: prev.value + 1 }));
  };

  render(props, state) {
    return (
      <div>
        <p>Счётчик: {state.value}</p>
        <button onClick={this.increment}>Увеличить</button>
      </div>
    );
  }
}
// --repl-after
render(<Counter />, document.getElementById('app'));
```

Теперь приведем эквивалентный функциональный компонент, построенный с использованием хуков:

```jsx
// --repl
import { useState, useCallback } from 'preact/hooks';
import { render } from 'preact';
// --repl-before
function Counter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => {
    setValue(value + 1);
  }, [value]);

  return (
    <div>
      <p>Счётчик: {value}</p>
      <button onClick={increment}>Увеличить</button>
    </div>
  );
}
// --repl-after
render(<Counter />, document.getElementById('app'));
```

На данный момент они кажутся довольно похожими, однако мы можем ещё больше упростить версию с хуками.

Вынесем логику работы счётчика в пользовательский хук, что позволит легко использовать его в разных компонентах:

```jsx
// --repl
import { useState, useCallback } from 'preact/hooks';
import { render } from 'preact';
// --repl-before
function useCounter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => {
    setValue(value + 1);
  }, [value]);
  return { value, increment };
}

// Первый счётчик
function CounterA() {
  const { value, increment } = useCounter();
  return (
    <div>
      <p>Счётчик A: {value}</p>
      <button onClick={increment}>Увеличить</button>
    </div>
  );
}

// Second counter which renders a different output.
function CounterB() {
  const { value, increment } = useCounter();
  return (
    <div>
      <h1>Счётчик B: {value}</h1>
      <p>Я хороший счётчик</p>
      <button onClick={increment}>Увеличить</button>
    </div>
  );
}
// --repl-after
render(
  <div>
    <CounterA />
    <CounterB />
  </div>,
  document.getElementById('app')
);
```

Заметим, что и `CounterA`, и `CounterB` полностью независимы друг от друга. Оба они используют пользовательский хук `useCounter()`, но каждый из них имеет свой собственный экземпляр связанного с этим хуком состояния.

> Вам кажется, что это выглядит несколько странно? Вы не одиноки!
>
> Многим из нас потребовалось время, чтобы привыкнуть к такому подходу.

## Аргумент зависимостей

Многие хуки принимают аргумент, который можно использовать для ограничения времени обновления хука. Preact проверяет каждое значение в массиве зависимостей и проверяет, изменилось ли оно с момента последнего вызова хука. Если аргумент зависимости не указан, хук выполняется всегда.

В нашей реализации `useCounter()`, описанной выше, мы передали массив зависимостей в `useCallback()`:

```jsx
function useCounter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => {
    setValue(value + 1);
  }, [value]); // <-- массив зависимостей
  return { value, increment };
}
```

Передача `value` здесь заставляет `useCallback` возвращать новую ссылку на функцию при каждом изменении `value`.
Это необходимо для того, чтобы избежать «устаревших закрытий», когда обратный вызов всегда будет ссылаться на переменную `value` первой отрисовки с момента его создания, в результате чего `increment` всегда будет устанавливать значение `1`.

> Это создает новый обратный вызов `increment` каждый раз, когда изменяется `value`.
> Из соображений производительности часто лучше использовать [обратный вызов](#usestate) для обновления значений состояния, а не сохранять текущее значение с помощью зависимостей.

## Хуки с сохранением состояния

Здесь мы увидим, как можно внедрить логику с отслеживанием состояния в функциональные компоненты.

До появления хуков компоненты классов требовались везде, где требовалось состояние.

### useState

Этот хук принимает аргумент, который будет являться начальным состоянием. При вызове этот хук возвращает массив из двух переменных. Первый — это текущее состояние, а второй — сеттер нашего состояния.

Наш сеттер ведет себя аналогично сеттеру нашего классического состояния. В качестве аргумента она принимает значение или функцию с текущим состоянием.

Когда вы вызовете сеттер и состояние будет другим, это вызовет перерисовку, начиная с компонента, в котором использовался этот useState.

```jsx
// --repl
import { render } from 'preact';
// --repl-before
import { useState } from 'preact/hooks';

const Counter = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  // Также можно передать сеттеру обратный вызов
  const decrement = () => setCount((currentCount) => currentCount - 1);

  return (
    <div>
      <p>Счётчик: {count}</p>
      <button onClick={increment}>Увеличить</button>
      <button onClick={decrement}>Уменьшить</button>
    </div>
  );
};
// --repl-after
render(<Counter />, document.getElementById('app'));
```

> Когда наше начальное состояние дорого, лучше передавать не значение, а функцию.

### useReducer

Хук `useReducer` имеет близкое сходство с [redux](https://redux.js.org/). По сравнению с [useState](#usestate) его удобнее использовать при сложной логике состояний, когда следующее состояние зависит от предыдущего.

```jsx
// --repl
import { render } from 'preact';
// --repl-before
import { useReducer } from 'preact/hooks';

const initialState = 0;
const reducer = (state, action) => {
  switch (action) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state - 1;
    case 'reset':
      return 0;
    default:
      throw new Error('Неожиданное действие');
  }
};

function Counter() {
  // Возвращает текущее состояние и функцию диспетчеризации для
  // триггера действия
  const [count, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      {count}
      <button onClick={() => dispatch('increment')}>+1</button>
      <button onClick={() => dispatch('decrement')}>-1</button>
      <button onClick={() => dispatch('reset')}>сбросить</button>
    </div>
  );
}
// --repl-after
render(<Counter />, document.getElementById('app'));
```

## Мемоизация

При программировании пользовательского интерфейса часто возникает некоторое состояние или результат, вычисление которого требует больших затрат. Мемоизация может кэшировать результаты вычислений, что позволяет использовать их повторно при использовании тех же входных данных.

### useMemo

С помощью хука `useMemo` мы можем запомнить результаты этого вычисления и пересчитывать их только при изменении одной из зависимостей.

```jsx
const memoized = useMemo(
  () => expensive(a, b),
  // Повторное выполнение дорогостоящей функции происходит только в том случае, если любая из этих
  // зависимостей изменяется
  [a, b]
);
```

> Не запускайте никакой эффективный код внутри `useMemo`. Побочные эффекты относятся к `useEffect`.

### useCallback

Хук `useCallback` может быть использован для того, чтобы гарантировать, что возвращаемая функция будет оставаться ссылочно равной до тех пор, пока не изменятся зависимости. Это может быть использовано для оптимизации обновления дочерних компонентов, когда они полагаются на ссылочное равенство для пропуска обновлений (например, `shouldComponentUpdate`).

```jsx
const onClick = useCallback(() => console.log(a, b), [a, b]);
```

> Интересный факт: `useCallback(fn, deps)` эквивалентно `useMemo(() => fn, deps)`.

## Рефы

**Рефы** — это стабильные, локальные значения, которые сохраняются между перерисовками, но не вызывают их сами по себе. См. [Рефы](/guide/v11/refs) для получения дополнительной информации и примеров.

## useRef

Для получения стабильной ссылки на узел DOM или значение, которое сохраняется между перерисовками, мы можем использовать хук `useRef`. Он работает аналогично [createRef](/guide/v11/refs#создание-рефа).

```jsx
// --repl
import { useRef } from 'preact/hooks';
import { render } from 'preact';
// --repl-before
function Foo() {
  // Инициализировать useRef с начальным значением `null`.
  const input = useRef(null);
  const onClick = () => input.current && input.current.focus();

  return (
    <>
      <input ref={input} />
      <button onClick={onClick}>Сфокусироваться на input</button>
    </>
  );
}
// --repl-after
render(<Foo />, document.getElementById('app'));
```

> Будьте внимательны и не путайте `useRef` с `createRef`.

> См. [Рефы](/guide/v11/refs) для получения дополнительной информации и примеров.

### useImperativeHandle

Чтобы изменить реф, переданный в дочерний компонент, мы можем использовать хук `useImperativeHandle`. Он принимает три аргумента: реф для изменения, функцию, которая будет выполнена и вернет новое значение рефа, и массив зависимостей, для определения необходимости повторного выполнения.

```jsx
// --repl
import { render } from "preact";
import { useRef, useImperativeHandle, useState } from "preact/hooks";
// --repl-before
function MyInput({ inputRef }) {
  const ref = useRef(null);
  useImperativeHandle(inputRef, () => {
    return {
      // Раскрываем только метод `.focus()`, не предоставляя прямого доступа к узлу DOM
      focus() {
        ref.current.focus();
      },
    };
  }, []);

  return (
    <label>
      Name: <input ref={ref} />
    </label>
  );
}

function App() {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <MyInput inputRef={inputRef} />
      <button onClick={handleClick}>Нажмите для редактирования</button>
    </div>
  );
}
// --repl-after
render(<App />, document.getElementById("app"));
```

## useContext

Для доступа к контексту в функциональном компоненте мы можем использовать хук `useContext`, без каких-либо вышестоящих компонентов или компонентов-обёрток. Первым аргументом должен быть объект контекста, созданный в результате вызова `createContext`.

```jsx
// --repl
import { render, createContext } from 'preact';
import { useContext } from 'preact/hooks';

const OtherComponent = (props) => props.children;
// --repl-before
const Theme = createContext('light');

function DisplayTheme() {
  const theme = useContext(Theme);
  return <p>Активная тема: {theme}</p>;
}

// ...later
function App() {
  return (
    <Theme.Provider value='light'>
      <OtherComponent>
        <DisplayTheme />
      </OtherComponent>
    </Theme.Provider>
  );
}
// --repl-after
render(<App />, document.getElementById('app'));
```

## Побочные эффекты

Побочные эффекты лежат в основе многих современных приложений. Независимо от того, хотите ли вы получить данные из API или запустить эффект на документе, вы обнаружите, что `useEffect` подходит практически для всех ваших нужд. Это одно из главных преимуществ Hooks API — перестройка мышления на эффекты, а не на жизненный цикл компонента.

### useEffect

Как следует из названия, `useEffect` является основным способом запуска различных побочных эффектов. Вы даже можете вернуть функцию очистки из своего эффекта, если она необходима.

```jsx
useEffect(() => {
  // Запуск эффекта
  return () => {
    // Дополнительно: Любой код очистки
  };
}, []);
```

Начнем с компонента `Title`, который должен отражать заголовок документа, чтобы мы могли видеть его в адресной строке нашей вкладки в браузере.

```jsx
function PageTitle(props) {
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  return <h1>{props.title}</h1>;
}
```

Первым аргументом `useEffect` является обратный вызов, не содержащий аргументов, который запускает эффект. В нашем случае мы хотим, чтобы он срабатывал только тогда, когда заголовок действительно изменился. Не было бы смысла обновлять его, если бы он оставался прежним. Именно поэтому мы используем второй аргумент для указания нашего [массива зависимостей](#the-dependency-argument).

Но иногда мы сталкиваемся с более сложными ситуациями. Представьте себе компонент, который должен подписаться на некоторые данные при монтировании и отписаться от них при размонтировании. Этого можно добиться и с помощью `useEffect`. Для выполнения любого кода очистки нам достаточно вернуть функцию в обратный вызов.

```jsx
// --repl
import { useState, useEffect } from 'preact/hooks';
import { render } from 'preact';
// --repl-before
// Компонент, который всегда будет отображать текущую ширину окна
function WindowWidth(props) {
  const [width, setWidth] = useState(0);

  function onResize() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return <p>Ширина окна: {width}</p>;
}
// --repl-after
render(<WindowWidth />, document.getElementById('app'));
```

> Функция очистки является необязательной. Если вам не нужно выполнять код очистки, то не нужно ничего возвращать в обратном вызове, передаваемом в `useEffect`.

### useLayoutEffect

Как и [`useEffect`](#useeffect), `useLayoutEffect` запускает дополнительные действия, но делает это сразу после обновления компонента, до того, как браузер перерисует страницу. Обычно используется для измерения элементов на странице, чтобы избежать мерцания или резкого появления, которые могут случиться при использовании `useEffect` для таких задач.

```jsx
import { useLayoutEffect, useRef } from 'preact/hooks';

function App() {
  const hintRef = useRef(null);

  useLayoutEffect(() => {
    const hintWidth = hintRef.current.getBoundingClientRect().width;

    // Мы можем использовать эту ширину, чтобы расположить и отцентрировать подсказку на экране:
    hintRef.current.style.left = `${(window.innerWidth - hintWidth) / 2}px`;
  }, []);

  return (
    <div style="display: inline; position: absolute" ref={hintRef}>
      <p>Это подсказка</p>
    </div>
  );
}
```

### useErrorBoundary

Всякий раз, когда дочерний компонент выдает ошибку, вы можете использовать этот хук, чтобы перехватить её и отобразить пользователю пользовательский интерфейс ошибки.

```jsx
// error = Ошибка, которая была поймана, или `undefined`, если ничего не произошло.
// resetError = Вызвать эту функцию, чтобы пометить ошибку как решенную.
// Ваше приложение должно решить, что это значит и возможно ли это
// для восстановления после ошибок.
const [error, resetError] = useErrorBoundary();
```

В целях мониторинга часто бывает невероятно полезно уведомлять службу о любых ошибках. Для этого мы можем использовать необязательный обратный вызов и передать его в качестве первого аргумента в `useErrorBoundary`.

```jsx
const [error] = useErrorBoundary((error) => callMyApi(error.message));
```

Полный пример использования может выглядеть так:

```jsx
const App = (props) => {
  const [error, resetError] = useErrorBoundary((error) => callMyApi(error.message));

  // Отображение красивого сообщения об ошибке
  if (error) {
    return (
      <div>
        <p>{error.message}</p>
        <button onClick={resetError}>Попробовать снова</button>
      </div>
    );
  } else {
    return <div>{props.children}</div>;
  }
};
```

> Если вы раньше использовали API компонентов на основе классов, то этот хук, по сути, является альтернативой методу жизненного цикла [componentDidCatch](/guide/v11/whats-new/#componentdidcatch).
> Этот хук был представлен в Preact 10.2.0.

## Утилитарные хуки

### useId

Этот хук будет генерировать уникальный идентификатор для каждого вызова и гарантирует, что они будут согласованы при рендеринге как [на сервере](/guide/v11/server-side-rendering), так и на клиенте. Распространённым вариантом использования согласованных идентификаторов являются формы, в которых элементы `<label>` используют [атрибут `for`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/label#for), чтобы связать их с определённым элементом `<input>`. Однако хук `useId` не привязан только к формам и может использоваться всякий раз, когда вам нужен уникальный идентификатор.

> Чтобы сделать перехват согласованным, вам нужно будет использовать Preact как на сервере, так и на клиенте.

Полный пример использования может выглядеть так:

```jsx
const App = props => {
  const mainId = useId();
  const inputId = useId();

  useLayoutEffect(() => {
    document.getElementById(inputId).focus()
  }, [])

  // Отображение элемента input с уникальным ID
  return (
    <main id={mainId}>
      <input id={inputId}>
    </main>
  )
};
```

> Этот хук был представлен в Preact 10.11.0 и требует preact-render-to-string 5.2.4.

### useDebugValue

Отображает пользовательскую метку для использования в браузерном расширении Preact DevTools. Полезно для пользовательских хуков, чтобы предоставить дополнительный контекст о состоянии или значении, которое они представляют.

```jsx
import { useDebugValue, useState } from 'preact/hooks';

function useCount() {
  const [count, setCount] = useState(0);
  useDebugValue(count > 0 ? 'Положительное' : 'Отрицательное');
  return [count, setCount];
}
```

В инструментах разработчика это будет отображаться как `useCount: "Positive"` или `useCount: "Negative"`, тогда как раньше отображалось бы просто `useCount`.

При желании в качестве второго аргумента `useDebugValue` можно передать функцию, которая будет использоваться как «форматтер».

```jsx
import { useDebugValue, useState } from 'preact/hooks';

function useCount() {
  const [count, setCount] = useState(0);
  useDebugValue(count, c => `Счётчик: ${c}`);
  return [count, setCount];
}
```

## Хуки, специфичные для Compat

Мы предоставляем некоторые дополнительные хуки только через пакет `preact/compat`, поскольку они либо являются заглушками, либо не входят в основной API хуков.

### useSyncExternalStore

Позволяет подписываться на внешний источник данных, например глобальную библиотеку управления состоянием, браузерные API или любой другой внешний по отношению к Preact источник данных.

```jsx
import { useSyncExternalStore } from 'preact/compat';

function subscribe(cb) {
  addEventListener('scroll', cb);
  return () => removeEventListener('scroll', cb);
}

function App() {
  const scrollY = useSyncExternalStore(subscribe, () => window.scrollY, () => 0);
}
```

### useDeferredValue

Реализация-заглушка, немедленно возвращает значение, поскольку Preact не поддерживает конкурентный рендеринг.

```jsx
import { useDeferredValue } from 'preact/compat';

function App() {
  const deferredValue = useDeferredValue('Привет, мир!');
}
```

### useTransition

Реализация-заглушка, поскольку Preact не поддерживает конкурентный рендеринг.

```jsx
import { useTransition } from 'preact/compat';

function App() {
  // `isPending` всегда будет иметь значение `false`
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // Немедленно выполняет callback — ничего не делает.
    startTransition(() => {
      // Код перехода здесь
    });
  };
}
```

### useInsertionEffect

Реализация-заглушка, по функциональности соответствует [`useLayoutEffect`](#uselayouteffect).

```jsx
import { useInsertionEffect } from 'preact/compat';

function App() {
  useInsertionEffect(() => {
    // Код эффекта здесь
  }, [dependencies]);
}
```

### use

Позволяет получить значение промиса, приостанавливая выполнение, пока промис не завершится, или прочитать значение контекста. Примечательно, что `use` — единственный хук, который можно вызывать условно.

> Context
```jsx
import { createContext } from 'preact';
import { use } from 'preact/compat';

const Theme = createContext('light');

function DisplayTheme() {
  const theme = use(Theme);
  return <p>Active theme: {theme}</p>;
}
```

> Promises
```jsx
import { Suspense, use } from 'preact/compat';

const promise = new Promise(r => setTimeout(() => r('Hello World!'), 5000));

function Message() {
    return <span>Сообщение: {use(promise)}</span>
}

export function App() {
  return (
    <div>
            <Suspense fallback={<span>Загрузка...</span>}>
                <Message />
            </Suspense>
    </div>
  );
}
```

> **Примечание:** Используемый промис должен кэшироваться, чтобы оставаться неизменным между рендерами. Можно хранить промисы в `Map` и других подобных структурах данных, чтобы для одного и того же ключа кэша возвращался тот же промис или разрешённое значение. Например:

```js
const CACHE = new Map();

function asyncData(cacheKey) {
  if (!CACHE.has(cacheKey)) {
    CACHE.set(cacheKey, fetchData(cacheKey));
  }

  return CACHE.get(cacheKey);
}
```

### useEffectEvent

Оборачивает функцию, чтобы обеспечить стабильную ссылку на неё между рендерами, при этом позволяя ей обращаться к актуальным значениям всех используемых ею переменных. Кроме того, такую функцию можно не указывать в массиве зависимостей `useEffect` без ошибок линтера, если вы используете линтер, который проверяет соблюдение правил хуков.

```jsx
import { useState } from 'preact/hooks';
import { useEffectEvent } from 'preact/compat';

function App() {
  const [breakpoint, setBreakpoint] = useState('mobile');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleResize = useEffectEvent(() => {
    const width = window.innerWidth;

    // При каждом вызове требуется актуальное значение `breakpoint`
    if (window.innerWidth > 768 && breakpoint === 'mobile') {
      setBreakpoint('desktop');
      if (width < 1200) setSidebarOpen(false);
    }
  });

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Не нужно указывать `handleResize` в качестве зависимости
}
```
