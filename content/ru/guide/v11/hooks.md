---
title: Хуки
description: Хуки в Preact позволяют вам составлять поведения вместе и повторно использовать эту логику в разных компонентах
---

# Хуки

Hooks API — это новая концепция, которая позволяет компоновать состояние и побочные эффекты. Хуки позволяют повторно использовать логику с состоянием между компонентами.

Если вы работали с Preact некоторое время, вы, возможно, знакомы с паттернами, такими как «рендер-пропсы» и «компоненты высшего порядка», которые пытаются решить эти задачи. Эти решения, как правило, усложняют понимание кода и делают его более абстрактным. API хуков позволяет аккуратно выделить логику для состояния и побочных эффектов, а также упрощает модульное тестирование этой логики независимо от компонентов, которые от неё зависят.

Хуки могут использоваться в любом компоненте и позволяют избежать многих проблем, связанных с ключевым словом `this`, используемым в API компонентов на основе классов. Вместо доступа к свойствам экземпляра компонента хуки используют замыкания. Это делает их привязанными к значению и устраняет ряд проблем с устаревшими данными, которые могут возникать при асинхронных обновлениях состояния.

Существует два способа импорта хуков: из `preact/hooks` или `preact/compat`.

---

<toc></toc>

---

## Введение

Самый простой способ понять хуки — сравнить их с эквивалентными компонентами, основанными на классах.

Мы будем использовать простой компонент `Counter` в качестве примера, который рендерит число и кнопку, при нажатии увеличивающую число на единицу:

```jsx
// --repl
import { render, Component } from 'preact';
// --repl-before
class Counter extends Component {
	state = {
		value: 0
	};

	increment = () => {
		this.setState(prev => ({ value: prev.value + 1 }));
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

Теперь, вот эквивалентный функциональный компонент, построенный с хуками:

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

На этом этапе они кажутся довольно похожими, однако мы можем далее упростить версию с хуками.

Давайте извлечём логику счётчика в пользовательский хук, сделав её легко повторно используемой через компоненты:

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

// Второй счётчик, с другим выводом
function CounterB() {
	const { value, increment } = useCounter();
	return (
		<div>
			<h1>Счётчик B: {value}</h1>
			<p>I'm a nice counter</p>
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

Обратите внимание, что и `CounterA` и `CounterB` полностью независимы друг от друга. Они оба используют пользовательский хук `useCounter()`, но каждый имеет свой собственный экземпляр состояния, связанного с этим хуком.

> Думаете, это выглядит немного странно? Вы не одни!

> Многие из нас потратили время, чтобы привыкнуть к этому подходу.

## Аргумент зависимостей

Многие хуки принимают аргумент, который можно использовать для ограничения того, когда хук должен обновляться. Preact проверяет каждое значение в массиве зависимостей и определяет, изменилось ли оно с момента последнего вызова хука. Если аргумент зависимостей не указан, хук выполняется всегда.

В нашей реализации `useCounter()` выше мы передали массив зависимостей в `useCallback()`:

```jsx
function useCounter() {
	const [value, setValue] = useState(0);
	const increment = useCallback(() => {
		setValue(value + 1);
	}, [value]); // <-- массив зависимостей
	return { value, increment };
}
```

Передача `value` здесь приводит к тому, что `useCallback` возвращает новую ссылку на функцию при каждом изменении `value`.
Это необходимо, чтобы избежать «устаревших замыканий», когда обратный вызов всегда ссылается на переменную `value` из первого рендера, в результате чего `increment` всегда устанавливает значение `1`.

> Это создаёт новый обратный вызов `increment` каждый раз, когда изменяется `value`.
> По соображениям производительности часто лучше использовать [обратный вызов](#usestate) для обновления значений состояния, вместо хранения текущего значения с использованием зависимостей.

## Хуки с состоянием

Здесь мы рассмотрим, как можно внедрить логику с состоянием в функциональные компоненты.

До появления хуков для работы с состоянием требовались компоненты на основе классов.

### useState

Этот хук принимает аргумент, который будет начальным состоянием. При вызове
этот хук возвращает массив из двух переменных. Первая —
это текущее состояние, а вторая — функция-установщик для нашего состояния.

Наша функция-установщик работает аналогично установщику классического состояния.
Она принимает значение или функцию с текущим состоянием в качестве аргумента.

Когда вы вызываете функцию-установщик и состояние отличается, это вызывает
повторный рендеринг, начиная с компонента, в котором использовался `useState`.

```jsx
// --repl
import { render } from 'preact';
// --repl-before
import { useState } from 'preact/hooks';

const Counter = () => {
	const [count, setCount] = useState(0);
	const increment = () => setCount(count + 1);
	// Вы также можете передать обратный вызов в сеттер
	const decrement = () => setCount(currentCount => currentCount - 1);

	return (
		<div>
			<p>Число: {count}</p>
			<button onClick={increment}>Увеличить</button>
			<button onClick={decrement}>Уменьшить</button>
		</div>
	);
};
// --repl-after
render(<Counter />, document.getElementById('app'));
```

> Когда наше начальное состояние дорогостоящее, лучше передать функцию вместо значения.

### useReducer

Хук `useReducer` имеет близкое сходство с [redux](https://redux.js.org/). По сравнению с [useState](#usestate) его легче использовать, когда у вас есть сложная логика состояния, где следующее состояние зависит от предыдущего.

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
			throw new Error('Unexpected action');
	}
};

function Counter() {
	// Возвращает текущее состояние и функцию диспетчеризации для
	// запуска действия
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

## Memoization

В программировании UI часто есть какое-то состояние или результат, который дорого рассчитывать. Memoization может кэшировать результаты этого расчёта, позволяя повторно использовать его, когда используется тот же элемент ввода.

### useMemo

С хуком `useMemo` мы можем мемоизировать результаты этого расчёта и пересчитывать его только тогда, когда одна из зависимостей изменяется.

```jsx
const memoized = useMemo(
	() => expensive(a, b),
	// Перезапускает затратную функцию только при изменении
	// любой из этих зависимостей
	[a, b]
);
```

> Не выполняйте код с побочными эффектами внутри `useMemo`. Побочные эффекты должны быть в `useEffect`.

### useCallback

Хук `useCallback` можно использовать для обеспечения того, чтобы возвращаемая функция оставалась референтно равной, пока не изменятся зависимости. Это может быть использовано для оптимизации обновлений дочерних компонентов, когда они полагаются на референтное равенство для пропуска обновлений (например, `shouldComponentUpdate`).

```jsx
const onClick = useCallback(() => console.log(a, b), [a, b]);
```

> Забавный факт: `useCallback(fn, deps)` эквивалентно `useMemo(() => fn, deps)`.

## Рефы

**Рефы** — это стабильные локальные значения, которые сохраняются между повторными рендерами, но сами по себе не вызывают рендеринг. Подробности и примеры см. в разделе [Рефы](/guide/v10/refs).

### useRef

Для создания стабильной ссылки на узел DOM или значение, которое сохраняется между рендерами, мы можем использовать хук `useRef`. Он работает аналогично [createRef](/guide/v10/refs#createref).

```jsx
// --repl
import { useRef } from 'preact/hooks';
import { render } from 'preact';
// --repl-before
function Foo() {
	// Инициализируем useRef с начальным значением `null`
	const input = useRef(null);
	const onClick = () => input.current && input.current.focus();

	return (
		<>
			<input ref={input} />
			<button onClick={onClick}>Передать фокус элементу ввода</button>
		</>
	);
}
// --repl-after
render(<Foo />, document.getElementById('app'));
```

> Будьте осторожны, не путайте `useRef` с `createRef`.

### useImperativeHandle

Чтобы мутировать ref, который передан в дочерний компонент, мы можем использовать хук `useImperativeHandle`. Он принимает три аргумента: ref для мутации, функция для выполнения, которая вернёт новое значение ref, и массив зависимостей для определения, когда возвращать.

```jsx
// --repl
import { render } from 'preact';
import { useRef, useImperativeHandle, useState } from 'preact/hooks';
// --repl-before
function MyInput({ inputRef }) {
	const ref = useRef(null);
	useImperativeHandle(
		inputRef,
		() => {
			return {
				// Предоставляйте только метод `.focus()`, не давайте прямой доступ к узлу DOM
				focus() {
					ref.current.focus();
				}
			};
		},
		[]
	);

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
render(<App />, document.getElementById('app'));
```

## useContext

Для доступа к контексту в функциональном компоненте мы можем использовать хук `useContext` без каких-либо компонентов высшего порядка или обёрток. Первый аргумент должен быть объектом контекста, созданным с помощью вызова `createContext`.

```jsx
// --repl
import { render, createContext } from 'preact';
import { useContext } from 'preact/hooks';

const OtherComponent = props => props.children;
// --repl-before
const Theme = createContext('light');

function DisplayTheme() {
	const theme = useContext(Theme);
	return <p>Активная тема: {theme}</p>;
}

// ...later
function App() {
	return (
		<Theme.Provider value="light">
			<OtherComponent>
				<DisplayTheme />
			</OtherComponent>
		</Theme.Provider>
	);
}
// --repl-after
render(<App />, document.getElementById('app'));
```

## Side-Effects

Побочные эффекты находятся в сердце многих современных приложений. Будь то получение данных из API или триггер эффекта на документе, вы найдёте, что `useEffect` подходит для почти всех ваших нужд. Это одно из главных преимуществ Hooks API, что он перестраивает ваш разум на мышление в эффектах вместо жизненного цикла компонента.

### useEffect

Как следует из названия, `useEffect` — основной способ триггера различных побочных эффектов. Вы даже можете вернуть функцию очистки из вашего эффекта, если она нужна.

```jsx
useEffect(() => {
	// Вызываем эффект
	return () => {
		// Любой код очистки (если нужно)
	};
}, []);
```

Мы начнём с компонента `Title`, который должен отражать заголовок в документе, так чтобы мы могли видеть его в адресной строке нашей вкладки в браузере.

```jsx
function PageTitle(props) {
	useEffect(() => {
		document.title = props.title;
	}, [props.title]);

	return <h1>{props.title}</h1>;
}
```

Первый аргумент для `useEffect` — это обратный вызов без аргументов, который запускает эффект. В нашем случае мы хотим запускать его только тогда, когда заголовок действительно изменился. Нет смысла обновлять его, если он остался прежним. Поэтому мы используем второй аргумент, чтобы указать наш [массив зависимостей](#the-dependency-argument).

Но иногда у нас есть более сложный случай использования. Представьте компонент, который должен подписаться на какие-то данные при монтировании и отписаться при размонтировании. Это также можно реализовать с помощью `useEffect`. Чтобы выполнить код очистки, нам просто нужно вернуть функцию в нашем обратном вызове.

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

> Функция очистки является необязательной. Если вам не нужно выполнять какой-либо код очистки, вам не нужно ничего возвращать в обратном вызове, переданном в `useEffect`.

### useLayoutEffect

Сигнатура идентична [useEffect](#useeffect), но она срабатывает сразу после того, как компонент обработан и браузер получает возможность отрисовки.

### useErrorBoundary

Когда дочерний компонент выбрасывает ошибку, вы можете использовать этот хук, чтобы перехватить её и отобразить пользователю настраиваемый интерфейс ошибки.

```jsx
// error = Ошибка, которая была перехвачена, или `undefined`, если ошибок не было.
// resetError = Вызовите эту функцию, чтобы пометить ошибку как решённую.
// От вашего приложения зависит, что это означает и возможно ли
// восстановление после ошибок.
const [error, resetError] = useErrorBoundary();
```

Для целей мониторинга часто невероятно полезно уведомлять сервис о любых ошибках. Для этого мы можем использовать опциональный обратный вызов и передать его как первый аргумент `useErrorBoundary`.

```jsx
const [error] = useErrorBoundary(error => callMyApi(error.message));
```

Полный пример использования может выглядеть так:

```jsx
const App = props => {
	const [error, resetError] = useErrorBoundary(error =>
		callMyApi(error.message)
	);

	// Отображаем красивое сообщение об ошибке
	if (error) {
		return (
			<div>
				<p>{error.message}</p>
				<button onClick={resetError}>Попробовать ещё раз</button>
			</div>
		);
	} else {
		return <div>{props.children}</div>;
	}
};
```

> Если вы ранее использовали API компонентов на основе классов, то этот хук, по сути, является альтернативой методу жизненного цикла [componentDidCatch](/guide/v10/whats-new/#componentdidcatch).
> Этот хук был представлен в Preact 10.2.0.

## Утилитарные хуки

### useId

Этот хук генерирует уникальный идентификатор для каждого вызова и гарантирует, что они будут согласованными при рендеринге как [на сервере](/guide/v10/server-side-rendering), так и на клиенте. Распространённый случай использования согласованных идентификаторов — это формы, где элементы `<label>` используют атрибут [`for`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label#attr-for) для связи с конкретным элементом `<input>`. Однако хук `useId` не ограничивается только формами и может использоваться везде, где требуется уникальный идентификатор.

> Чтобы хук был согласованным, вам нужно использовать Preact как на сервере,
> так и на клиенте.

Полный пример использования может выглядеть следующим образом:

```jsx
const App = props => {
  const mainId = useId();
  const inputId = useId();

  useLayoutEffect(() => {
    document.getElementById(inputId).focus()
  }, [])

  // Отображаем элемент ввода с уникальным ID.
  return (
    <main id={mainId}>
      <input id={inputId}>
    </main>
  )
};
```

> Этот хук был введён с Preact 10.11.0 и нуждается в пакете preact-render-to-string 5.2.4.
