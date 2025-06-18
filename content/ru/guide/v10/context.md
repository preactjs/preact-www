---
title: Контекст
description: Контекст позволяет передавать параметры через промежуточные компоненты. В этой документации описывается как новый, так и старый API
---

# Контекст

Контекст — это способ передачи данных через дерево компонентов без необходимости передавать их через каждый промежуточный компонент с помощью пропсов. Проще говоря, он позволяет компонентам в любой части иерархии подписываться на значение и получать уведомления о его изменениях, обеспечивая обновления в стиле pub-sub для Preact.

Не редкость сталкиваться с ситуациями, когда значение из компонента-прародителя (или выше) нужно передать дочернему компоненту, часто без необходимости в промежуточном компоненте. Этот процесс передачи пропсов часто называют «проп-дриллингом», и он может быть громоздким, подверженным ошибкам и просто утомительным, особенно по мере роста приложения и необходимости передавать больше значений через большее количество слоёв. Это одна из ключевых проблем, которую контекст стремится решить, предоставляя способ для дочернего компонента подписаться на значение, находящееся выше в дереве компонентов, получая доступ к значению без его передачи в качестве пропа.

В Preact есть два способа использования контекста: через новый API `createContext` и устаревший context API. В настоящее время существует очень мало причин использовать устаревший API, но он документирован здесь для полноты.

---

<toc></toc>

---

## Современный Context API

### Создание контекста

Чтобы создать новый контекст, мы используем функцию `createContext`. Эта функция принимает начальное состояние в качестве аргумента и возвращает объект с двумя свойствами компонентов: `Provider`, чтобы сделать контекст доступным для потомков, и `Consumer`, чтобы получить доступ к значению контекста (в основном в классовых компонентах).

```jsx
import { createContext } from "preact";

export const Theme = createContext("light");
export const User = createContext({ name: "Guest" });
export const Locale = createContext(null);
```

### Настройка провайдера

После того как мы создали контекст, мы должны сделать его доступным для потомков, используя компонент `Provider`. Провайдеру необходимо передать проп `value`, представляющий начальное значение контекста.

> Начальное значение, установленное с помощью `createContext`, используется только в отсутствие `Provider` выше потребителя в дереве. Это может быть полезно для тестирования компонентов в изоляции, так как позволяет избежать необходимости создания обёртки `Provider` вокруг вашего компонента.

```jsx
import { createContext } from 'preact';

export const Theme = createContext('light');

function App() {
	return (
		<Theme.Provider value="dark">
			<SomeComponent />
		</Theme.Provider>
	);
}
```

> **Совет:** Вы можете иметь несколько провайдеров одного и того же контекста в вашем приложении, но будет использоваться только ближайший к потребителю.

### Использование контекста

Существуют три способа использования контекста, в значительной степени в зависимости от предпочитаемого вами стиля компонентов: `static contextType` (классовые компоненты), хук `useContext` (функциональные компоненты/хуки), и `Context.Consumer` (все компоненты).

<tab-group tabstring="contextType, useContext, Context.Consumer">

```jsx
// --repl
import { render, createContext, Component } from 'preact';

const SomeComponent = props => props.children;
// --repl-before
const ThemePrimary = createContext('#673ab8');

class ThemedButton extends Component {
	static contextType = ThemePrimary;

	render() {
		const theme = this.context;
		return <button style={{ background: theme }}>Стилизованная кнопка</button>;
	}
}

function App() {
	return (
		<ThemePrimary.Provider value="#8f61e1">
			<SomeComponent>
				<ThemedButton />
			</SomeComponent>
		</ThemePrimary.Provider>
	);
}
// --repl-after
render(<App />, document.getElementById('app'));
```

```jsx
// --repl
import { render, createContext } from 'preact';
import { useContext } from 'preact/hooks';

const SomeComponent = props => props.children;
// --repl-before
const ThemePrimary = createContext('#673ab8');

function ThemedButton() {
	const theme = useContext(ThemePrimary);
	return <button style={{ background: theme }}>Стилизованная кнопка</button>;
}

function App() {
	return (
		<ThemePrimary.Provider value="#8f61e1">
			<SomeComponent>
				<ThemedButton />
			</SomeComponent>
		</ThemePrimary.Provider>
	);
}
// --repl-after
render(<App />, document.getElementById('app'));
```

```jsx
// --repl
import { render, createContext } from 'preact';

const SomeComponent = props => props.children;
// --repl-before
const ThemePrimary = createContext('#673ab8');

function ThemedButton() {
	return (
		<ThemePrimary.Consumer>
			{theme => <button style={{ background: theme }}>Стилизованная кнопка</button>}
		</ThemePrimary.Consumer>
	);
}

function App() {
	return (
		<ThemePrimary.Provider value="#8f61e1">
			<SomeComponent>
				<ThemedButton />
			</SomeComponent>
		</ThemePrimary.Provider>
	);
}
// --repl-after
render(<App />, document.getElementById('app'));
```

</tab-group>

### Обновление контекста

Статические значения могут быть полезны, но чаще всего мы хотим иметь возможность динамически обновлять значение контекста. Для этого мы используем стандартные механизмы состояния компонентов:

```jsx
// --repl
import { render, createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';

const SomeComponent = props => props.children;
// --repl-before
const ThemePrimary = createContext(null);

function ThemedButton() {
	const { theme } = useContext(ThemePrimary);
	return <button style={{ background: theme }}>Стилизованная кнопка</button>;
}

function ThemePicker() {
	const { theme, setTheme } = useContext(ThemePrimary);
	return (
		<input
			type="color"
			value={theme}
			onChange={e => setTheme(e.currentTarget.value)}
		/>
	);
}

function App() {
	const [theme, setTheme] = useState('#673ab8');
	return (
		<ThemePrimary.Provider value={{ theme, setTheme }}>
			<SomeComponent>
				<ThemedButton />
				{' - '}
				<ThemePicker />
			</SomeComponent>
		</ThemePrimary.Provider>
	);
}
// --repl-after
render(<App />, document.getElementById('app'));
```

## Устаревший Context API

Этот API считается устаревшим и должен быть избегаем в новом коде, так как у него есть известные проблемы, и он существует только для обеспечения обратной совместимости.

Одно из ключевых отличий этого API от нового заключается в том, что этот API не может обновить дочерний компонент, когда компонент между дочерним компонентом и провайдером отменяет рендеринг с помощью `shouldComponentUpdate`. Когда это происходит, дочерний компонент **не получит** обновлённое значение контекста, что часто приводит к разрыву (часть интерфейса использует новое значение, а часть — старое).

Чтобы передать значение через контекст, компонент должен иметь метод `getChildContext`, возвращающий предполагаемое значение контекста. Потомки могут получить доступ к контексту через второй аргумент в функциональных компонентах или `this.context` в классовых компонентах.

```jsx
// --repl
import { render } from 'preact';

const SomeOtherComponent = props => props.children;
// --repl-before
function ThemedButton(_props, context) {
	return <button style={{ background: context.theme }}>Стилизованная кнопка</button>;
}

class App extends Component {
	getChildContext() {
		return {
			theme: '#673ab8'
		};
	}

	render() {
		return (
			<div>
				<SomeOtherComponent>
					<ThemedButton />
				</SomeOtherComponent>
			</div>
		);
	}
}
// --repl-after
render(<App />, document.getElementById('app'));
```
