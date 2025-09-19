---
title: Рефы
description: Рефы — это способ создания стабильных значений, которые локальны для экземпляра компонента и сохраняются через рендеры
---

# Рефы

Рефы — это стабильные, локальные значения, которые сохраняются через рендеры компонентов, но не вызывают повторных рендеров, как состояние или пропсы, когда они изменяются.

Чаще всего вы увидите рефы, используемые для облегчения императивной манипуляции DOM, но они могут быть использованы для хранения любого произвольного локального значения, которое вам нужно сохранить стабильным. Вы можете использовать их для отслеживания предыдущего значения состояния, поддержания ссылки на ID интервала или таймаута, или просто значения счётчика. Важно, что рефы не должны использоваться для логики рендеринга, вместо этого, их следует потреблять только в методах жизненного цикла и обработчиках событий.

---

<toc></toc>

---

## Создание ссылки

Есть два способа создания рефов в Preact, в зависимости от вашего предпочтительного стиля компонента: `createRef` (классовые компоненты) и `useRef` (функциональные компоненты/хуки). Оба API фундаментально работают одинаково: они создают стабильный, обычный объект со свойством `current`, опционально инициализированным значением.

<tab-group tabstring="Классы, Хуки">

```jsx
import { createRef } from 'preact';

class MyComponent extends Component {
	countRef = createRef();
	inputRef = createRef(null);

	// ...
}
```

```jsx
import { useRef } from 'preact/hooks';

function MyComponent() {
	const countRef = useRef();
	const inputRef = useRef(null);

	// ...
}
```

</tab-group>

## Использование рефов для доступа к DOM-узлам

Самый распространённый случай использования рефов — доступ к базовому DOM-узлу компонента. Это полезно для императивной DOM-манипуляции, такой как измерение элементов, вызов нативных методов на различных элементах (таких как `.focus()` или `.play()`), и интеграция со сторонними библиотеками, написанными на чистом JS. В следующих примерах, при рендеринге, Preact присвоит DOM-узел свойству `current` объекта `ref`, делая его доступным для использования после монтирования компонента.

<tab-group tabstring="Классы, Хуки">

```jsx
// --repl
import { render, Component, createRef } from 'preact';
// --repl-before
class MyInput extends Component {
	ref = createRef(null);

	componentDidMount() {
		console.log(this.ref.current);
		// Логирует: [HTMLInputElement]
	}

	render() {
		return <input ref={this.ref} />;
	}
}
// --repl-after
render(<MyInput />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
// --repl-before
function MyInput() {
	const ref = useRef(null);

	useEffect(() => {
		console.log(ref.current);
		// Логирует: [HTMLInputElement]
	}, []);

	return <input ref={ref} />;
}
// --repl-after
render(<MyInput />, document.getElementById('app'));
```

</tab-group>

### Колбэк-рефы

Другой способ использования рефов — передача функции пропу `ref`, где DOM-узел будет передан как аргумент.

<tab-group tabstring="Классы, Хуки">

```jsx
// --repl
import { render, Component } from 'preact';
// --repl-before
class MyInput extends Component {
	render() {
		return (
			<input
				ref={dom => {
					console.log('Монтирован:', dom);

					// Начиная с Preact 10.23.0, вы можете опционально вернуть функцию очистки
					return () => {
						console.log('Демонтирован:', dom);
					};
				}}
			/>
		);
	}
}
// --repl-after
render(<MyInput />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
// --repl-before
function MyInput() {
	return (
		<input
			ref={dom => {
				console.log('Монтирован:', dom);

				// Начиная с Preact 10.23.0, вы можете опционально вернуть функцию очистки
				return () => {
					console.log('Демонтирован:', dom);
				};
			}}
		/>
	);
}
// --repl-after
render(<MyInput />, document.getElementById('app'));
```

</tab-group>

> Если предоставленный колбек-реф нестабилен (такой как определённый inline, как показано выше), и _не_ возвращает функцию очистки, **он будет вызван дважды** при всех повторных рендерах: один раз с `null` и затем один раз с актуальной ссылкой. Это распространённая проблема, и API `createRef`/`useRef` делают это немного проще, заставляя пользователя проверять, определен ли `ref.current`.
>
> Стабильная функция, для сравнения, могла бы быть методом на экземпляре классового компонента, функцией, определённой вне компонента, или функцией, созданной с `useCallback`, например.

## Использование рефов для хранения локальных значений

Refs не ограничены хранением DOM-узлов, однако; они могут быть использованы для хранения любого типа значения, которое вам может понадобиться.

В следующем примере мы храним ID интервала в ref, чтобы иметь возможность запускать и останавливать его независимо.

<tab-group tabstring="Классы, Хуки">

```jsx
// --repl
import { render, Component, createRef } from 'preact';
// --repl-before
class SimpleClock extends Component {
	state = {
		time: Date.now()
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
				<button onClick={this.startClock}>Запустить часы</button>
				<time dateTime={formattedTime}>{formattedTime}</time>
				<button onClick={this.stopClock}>Остановить часы</button>
			</div>
		);
	}
}
// --repl-after
render(<SimpleClock />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { useState, useRef } from 'preact/hooks';
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
			<button onClick={startClock}>Запустить часы</button>
			<time dateTime={formattedTime}>{formattedTime}</time>
			<button onClick={stopClock}>Остановить часы</button>
		</div>
	);
}
// --repl-after
render(<SimpleClock />, document.getElementById('app'));
```

</tab-group>
