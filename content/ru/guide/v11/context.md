---
title: Контекст
description: Контекст позволяет вам передавать пропсы через промежуточные компоненты. Этот документ описывает как новый, так и старый API
---

# Контекст

Контекст — это способ передачи данных через дерево компонентов без необходимости передавать их через каждый промежуточный компонент с помощью пропсов. Если кратко, он позволяет компонентам в любой иерархии подписываться на значение и получать уведомления при его изменении, привнося в Preact обновления в стиле «издатель-подписчик» (`pub-sub`).

Нередко возникают ситуации, когда значение от компонента-прародителя (или выше) нужно передать дочернему компоненту, причем промежуточные компоненты часто не нуждаются в этом значении. Этот процесс передачи пропсов вниз часто называют «пробросом пропсов» (`prop drilling`), и он может быть громоздким, подверженным ошибкам и просто повторяющимся, особенно по мере роста приложения и необходимости передавать больше значений через больше слоев. Это одна из ключевых проблем, которую призван решить Context, предоставляя способ для дочернего компонента подписаться на значение выше в дереве компонентов и получать к нему доступ без необходимости передачи через пропсы.

В Preact есть два способа использования контекста: через новый API `createContext` и устаревший context API. В наши дни есть очень мало причин когда-либо обращаться к устаревшему API, но он документирован здесь для полноты.

---

<toc></toc>

---

## Современный Context API

### Создание Контекста

Для создания нового контекста мы используем функцию `createContext`. Эта функция принимает начальное состояние как аргумент и возвращает объект с двумя свойствами компонентов: `Provider`, чтобы сделать контекст доступным для потомков, и `Consumer`, для доступа к значению контекста (в основном в классовых компонентах).

```jsx
import { createContext } from 'preact';

export const Theme = createContext('light');
export const User = createContext({ name: 'Guest' });
export const Locale = createContext(null);
```

### Настройка Provider

Как только мы создали контекст, мы должны сделать его доступным для потомков, используя компонент `Provider`. `Provider` должен получить проп `value`, представляющий начальное значение контекста.

> Начальное значение, установленное в `createContext`, используется только при отсутствии `Provider` выше потребителя в дереве. Это может быть полезно для изолированного тестирования компонентов, так как позволяет избежать необходимости создания обёртки `Provider` вокруг компонента.

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

> **Совет:** Вы можете иметь несколько провайдеров одного и того же контекста в вашем приложении, но только ближайший к потребителю будет использоваться.

### Использование Контекста

Есть три способа потреблять контекст, в основном зависящие от вашего предпочтительного стиля компонента: `static contextType` (классовые компоненты), hook `useContext` (функциональные компоненты/хуки) и `Context.Consumer` (все компоненты).

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
		return <button style={{ background: theme }}>Themed Button</button>;
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
	return <button style={{ background: theme }}>Themed Button</button>;
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

### Обновление Контекста

Статические значения могут быть полезны, но чаще всего мы хотим иметь возможность обновлять значение контекста динамически. Для этого мы используем стандартные механизмы состояния компонента:

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

Этот API считается устаревшим и его следует избегать в новом коде. Он имеет известные проблемы и существует только для обеспечения обратной совместимости.

Одно из ключевых различий между этим API и новым заключается в том, что этот API не может обновить дочерний компонент, когда компонент между ним и провайдером прерывает рендеринг через `shouldComponentUpdate`. В этом случае дочерний компонент **не получит** обновлённое значение контекста, что часто приводит к «разрыву» (часть UI использует новое значение, часть — старое).

Чтобы передать значение через контекст, компонент должен иметь метод `getChildContext`, возвращающий предполагаемое значение контекста. Потомки могут затем получить доступ к контексту через второй аргумент в функциональных компонентах или через `this.context` в компонентах на основе классов.

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
