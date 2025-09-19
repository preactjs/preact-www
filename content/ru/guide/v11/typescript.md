---
title: TypeScript
description: Preact имеет встроенную поддержку TypeScript. Узнайте, как ею воспользоваться!
---

# TypeScript

Preact поставляется с определениями типов TypeScript, которые используются самой библиотекой!

При использовании Preact в редакторе с поддержкой TypeScript (например, VSCode), вы можете воспользоваться дополнительной информацией о типах при написании обычного JavaScript. Если вы хотите добавить информацию о типах в свои собственные приложения, вы можете использовать [аннотации JSDoc](https://fettblog.eu/typescript-jsdoc-superpowers/), или писать на TypeScript и транслировать в обычный JavaScript. Этот раздел будет сосредоточен на последнем варианте.

---

<toc></toc>

---

## Конфигурация TypeScript

TypeScript включает полноценный компилятор JSX, который вы можете использовать вместо Babel. Добавьте следующую конфигурацию в ваш `tsconfig.json` для транслирования JSX в совместимый с Preact JavaScript:

```json
// Классическое преобразование
{
	"compilerOptions": {
		"jsx": "react",
		"jsxFactory": "h",
		"jsxFragmentFactory": "Fragment"
		//...
	}
}
```

```json
// Автоматическое преобразование, доступно в TypeScript >= 4.1.1
{
	"compilerOptions": {
		"jsx": "react-jsx",
		"jsxImportSource": "preact"
		//...
	}
}
```

Если вы используете TypeScript в цепочке инструментов Babel, установите `jsx` в `preserve` и позвольте Babel обработать транслирование. Вам всё равно нужно указать `jsxFactory` и `jsxFragmentFactory`, чтобы получить правильные типы.

```json
{
	"compilerOptions": {
		"jsx": "preserve",
		"jsxFactory": "h",
		"jsxFragmentFactory": "Fragment"
		//...
	}
}
```

В вашем `.babelrc`:

```javascript
{
  presets: [
    "@babel/env",
    ["@babel/typescript", { jsxPragma: "h" }],
  ],
  plugins: [
    ["@babel/transform-react-jsx", { pragma: "h" }]
  ],
}
```

Переименуйте файлы `.jsx` в `.tsx`, чтобы TypeScript правильно парсил ваш JSX.

## Конфигурация TypeScript для preact/compat

Вашему проекту может потребоваться поддержка более широкой экосистемы React. Чтобы ваше приложение компилировалось, вам может понадобиться отключить проверку типов на ваших `node_modules` и добавить пути к типам, как эти. Таким образом, ваш алиас будет работать правильно, когда библиотеки импортируют React.

```json
{
  "compilerOptions": {
    ...
    "skipLibCheck": true,
    "baseUrl": "./",
    "paths": {
      "react": ["./node_modules/preact/compat/"],
      "react/jsx-runtime": ["./node_modules/preact/jsx-runtime"],
      "react-dom": ["./node_modules/preact/compat/"],
      "react-dom/*": ["./node_modules/preact/compat/*"]
    }
  }
}
```

## Типизация компонентов

В Preact существует несколько способов типизации компонентов. Классовые компоненты используют обобщённые типы для обеспечения безопасности типов. TypeScript рассматривает функцию как функциональный компонент, если она возвращает JSX. Существует несколько подходов к определению пропсов для функциональных компонентов.

### Функциональные компоненты

Типизация обычных функциональных компонентов так же проста, как добавление информации о типах к аргументам функции.

```tsx
interface MyComponentProps {
	name: string;
	age: number;
}

function MyComponent({ name, age }: MyComponentProps) {
	return (
		<div>
			Меня зовут {name}, мне {age.toString()} лет.
		</div>
	);
}
```

Вы можете установить пропсы по умолчанию, установив нужное значение в сигнатуре функции.

```tsx
interface GreetingProps {
	name?: string; // name является опциональным!
}

function Greeting({ name = 'Петя' }: GreetingProps) {
	// name по крайней мере "Петя"
	return <div>Привет, {name}!</div>;
}
```

Preact также поставляется с типом `FunctionComponent` для аннотации анонимных функций. `FunctionComponent` также добавляет тип для `children`:

```tsx
import { h, FunctionComponent } from 'preact';

const Card: FunctionComponent<{ title: string }> = ({ title, children }) => {
	return (
		<div class="card">
			<h1>{title}</h1>
			{children}
		</div>
	);
};
```

`children` имеет тип `ComponentChildren`. Вы можете указать `children` самостоятельно, используя этот тип:

```tsx
import { h, ComponentChildren } from 'preact';

interface ChildrenProps {
	title: string;
	children: ComponentChildren;
}

function Card({ title, children }: ChildrenProps) {
	return (
		<div class="card">
			<h1>{title}</h1>
			{children}
		</div>
	);
}
```

### Компоненты классов

Класс `Component` Preact типизирован как обобщённый (`generic`) с двумя переменными типов: `Props` и `State`. Оба типа по умолчанию — пустой объект, и вы можете указать их по своим нуждам.

```tsx
// Типы для пропсов
interface ExpandableProps {
	title: string;
}

// Типы для состояния
interface ExpandableState {
	toggled: boolean;
}

// Привязываем generics к ExpandableProps и ExpandableState
class Expandable extends Component<ExpandableProps, ExpandableState> {
	constructor(props: ExpandableProps) {
		super(props);
		// this.state — объект с булевым полем `toggle`
		// благодаря ExpandableState
		this.state = {
			toggled: false
		};
	}
	// `this.props.title` — строка благодаря ExpandableProps
	render() {
		return (
			<div class="expandable">
				<h2>
					{this.props.title}{' '}
					<button
						onClick={() => this.setState({ toggled: !this.state.toggled })}
					>
						Переключить
					</button>
				</h2>
				<div hidden={this.state.toggled}>{this.props.children}</div>
			</div>
		);
	}
}
```

Компоненты классов включают `children` по умолчанию, типизированные как `ComponentChildren`.

## Наследование HTML-свойств

Когда мы пишем компоненты вроде `<Input />`, которые оборачивают HTML `<input>`, большую часть времени мы хотели бы наследовать пропсы, которые можно использовать на нативном HTML-элементе ввода. Для этого мы можем сделать следующее:

```tsx
import { InputHTMLAttributes } from 'preact';

interface InputProperties extends InputHTMLAttributes {
	mySpecialProp: any;
}

const Input = (props: InputProperties) => <input {...props} />;
```

Теперь, когда мы используем `Input`, он будет знать о свойствах вроде `value`, ...

## Типизация событий

Preact испускает регулярные DOM-события. Пока ваш проект TypeScript включает библиотеку `dom` (установите это в `tsconfig.json`), у вас есть доступ ко всем типам событий, которые доступны в вашей текущей конфигурации.

```tsx
import type { TargetedMouseEvent } from "preact";

export class Button extends Component {
  handleClick(event: TargetedMouseEvent<HTMLButtonElement>) {
    alert(event.currentTarget.tagName); // Сообщает BUTTON
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.props.children}
      </button>
    );
  }
}
```

Если вы предпочитаете встроенные функции, вы можете отказаться от явной типизации текущего целевого события, поскольку оно выводится из JSX-элемента:

```tsx
export class Button extends Component {
	render() {
		return (
			<button onClick={event => alert(event.currentTarget.tagName)}>
				{this.props.children}
			</button>
		);
	}
}
```

## Типизация ссылок

Функция `createRef` также является обобщённой (`generic`) и позволяет привязывать ссылки к типам элементов. В этом примере мы обеспечиваем, что ссылка может быть привязана только к `HTMLAnchorElement`. Использование `ref` с любым другим элементом позволит TypeScript выдать ошибку:

```tsx
import { h, Component, createRef } from 'preact';

class Foo extends Component {
	ref = createRef<HTMLAnchorElement>();

	componentDidMount() {
		// current имеет тип HTMLAnchorElement
		console.log(this.ref.current);
	}

	render() {
		return <div ref={this.ref}>Foo</div>;
		//          ~~~
		//       💥 Error! Ref можно использовать только для HTMLAnchorElement
	}
}
```

Это очень помогает, если вы хотите убедиться, что элементы, на которые вы ссылаетесь, являются элементами ввода, которые могут быть, например, сфокусированы.

## Типизация контекста

`createContext` пытается вывести как можно больше из начальных значений, которые вы передаете:

```tsx
import { h, createContext } from 'preact';

const AppContext = createContext({
	authenticated: true,
	lang: 'en',
	theme: 'dark'
});
// AppContext имеет тип preact.Context<{
//   authenticated: boolean;
//   lang: string;
//   theme: string;
// }>
```

Он также требует от вас передать все свойства, которые вы определили в начальном значении:

```tsx
function App() {
	// Этот выдает ошибку 💥, поскольку мы не определили theme
	return (
		<AppContext.Provider
			value={{
	 //    ~~~~~
	 // 💥 Error: theme not defined
				lang: 'de',
				authenticated: true
			}}
		>
			<ComponentThatUsesAppContext />
		</AppContext.Provider>
	);
}
```

Если вы не хотите указывать все свойства, вы можете либо слить значения по умолчанию с переопределениями:

```tsx
const AppContext = createContext(appContextDefault);

function App() {
	return (
		<AppContext.Provider
			value={{
				lang: 'de',
				...appContextDefault
			}}
		>
			<ComponentThatUsesAppContext />
		</AppContext.Provider>
	);
}
```

Или работать без значений по умолчанию и привязать переменную типа `generic` к определённому типу:

```tsx
interface AppContextValues {
  authenticated: boolean;
  lang: string;
  theme: string;
}

const AppContext = createContext<Partial<AppContextValues>>({});

function App() {
  return (
    <AppContext.Provider
      value={{
        lang: "de"
      }}
    >
      <ComponentThatUsesAppContext />
    </AppContext.Provider>
  );
}
```

Все значения становятся опциональными, так что вам придется делать проверки на `null` при их использовании.

## Типизация хуков

Большинство хуков не нуждаются в специальной информации о типизации, но могут выводить типы из использования.

### useState, useEffect, useContext

`useState`, `useEffect` и `useContext` все имеют `generic` типы, так что вам не нужно аннотировать `extra`. Ниже минимальный компонент, который использует `useState`, со всеми типами, выведенными из значений по умолчанию сигнатуры функции.

```tsx
const Counter = ({ initial = 0 }) => {
	// поскольку initial — число (значение по умолчанию!), clicks — число
	// setClicks — функция, которая принимает
	// - число
	// - функцию, возвращающую число
	const [clicks, setClicks] = useState(initial);
	return (
		<>
			<p>Clicks: {clicks}</p>
			<button onClick={() => setClicks(clicks + 1)}>+</button>
			<button onClick={() => setClicks(clicks - 1)}>-</button>
		</>
	);
};
```

`useEffect` делает дополнительные проверки, так что вы возвращаете только функции очистки.

```typescript
useEffect(() => {
	const handler = () => {
		document.title = window.innerWidth.toString();
	};
	window.addEventListener('resize', handler);

	// ✅  если вы возвращаете что-то из колбэка эффекта
	// это ДОЛЖНО быть функцией без аргументов
	return () => {
		window.removeEventListener('resize', handler);
	};
});
```

`useContext` получает информацию о типе из объекта по умолчанию, который вы передаете в `createContext`.

```tsx
const LanguageContext = createContext({ lang: 'en' });

const Display = () => {
	// lang будет иметь тип string
	const { lang } = useContext(LanguageContext);
	return (
		<>
			<p>Ваш выбранный язык: {lang}</p>
		</>
	);
};
```

### useRef

Как и `createRef`, `useRef` выигрывает от привязки переменной типа `generic` к подтипу `HTMLElement`. В примере ниже мы убеждаемся, что `inputRef` может быть передан только `HTMLInputElement`. `useRef` обычно инициализируется с `null`, с флагом `strictNullChecks` включенным, нам нужно проверить, доступен ли `inputRef`.

```tsx
import { h } from 'preact';
import { useRef } from 'preact/hooks';

function TextInputWithFocusButton() {
	// инициализируем с null, но говорим TypeScript, что мы ищем HTMLInputElement
	const inputRef = useRef<HTMLInputElement>(null);
	const focusElement = () => {
		// strict null checks требуют от нас проверить, существуют ли inputEl и current.
		// но как только current существует, оно имеет тип HTMLInputElement, таким образом у него
		// есть метод focus! ✅
		if (inputRef && inputRef.current) {
			inputRef.current.focus();
		}
	};
	return (
		<>
			{/* кроме того, inputEl можно использовать только с input элементами */}
			<input ref={inputRef} type="text" />
			<button onClick={focusElement}>Фокус на input</button>
		</>
	);
}
```

### useReducer

Для хука `useReducer` TypeScript пытается вывести как можно больше типов из функции `reducer`. Посмотрите, например, `reducer` для счётчика.

```typescript
// Тип состояния для функции reducer
interface StateType {
	count: number;
}

// Тип действия, где `type` может быть либо
// "reset", "decrement", "increment"
interface ActionType {
	type: 'reset' | 'decrement' | 'increment';
}

// Начальное состояние. Нет нужды аннотировать
const initialState = { count: 0 };

function reducer(state: StateType, action: ActionType) {
	switch (action.type) {
		// TypeScript убеждается, что мы обрабатываем все возможные
		// типы действий и дает автокомплит для type
		// строк
		case 'reset':
			return initialState;
		case 'increment':
			return { count: state.count + 1 };
		case 'decrement':
			return { count: state.count - 1 };
		default:
			return state;
	}
}
```

Как только мы используем функцию `reducer` в `useReducer`, мы выводим несколько типов и делаем проверки типов для переданных аргументов.

```tsx
function Counter({ initialCount = 0 }) {
	// TypeScript убеждается, что reducer имеет максимум два аргумента, и что
	// начальное состояние имеет тип StateType.
	// Кроме того:
	// - state имеет тип StateType
	// - dispatch — функция для диспетчеризации ActionType
	const [state, dispatch] = useReducer(reducer, { count: initialCount });

	return (
		<>
			Count: {state.count}
			{/* TypeScript обеспечивает, что диспетчеризуемые действия имеют тип ActionType */}
			<button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
			<button onClick={() => dispatch({ type: 'increment' })}>+</button>
			<button onClick={() => dispatch({ type: 'decrement' })}>-</button>
		</>
	);
}
```

Единственная нужная аннотация — в самой функции `reducer`. Типы `useReducer` также обеспечивают, что возвращаемое значение функции `reducer` имеет тип `StateType`.

## Расширение встроенных типов JSX

У вас могут быть [пользовательские элементы](/guide/v10/web-components), которые вы хотели бы использовать в JSX, или вы можете пожелать добавить дополнительные атрибуты ко всем или некоторым HTML-элементам для работы с конкретной библиотекой. Для этого вам нужно использовать «модульное расширение» для расширения и/или изменения типов, которые предоставляет Preact.

### Расширение `IntrinsicElements` для пользовательских элементов

```tsx
function MyComponent() {
	return <loading-bar showing={true}></loading-bar>;
	//      ~~~~~~~~~~~
	//   💥 Error! Property 'loading-bar' does not exist on type 'JSX.IntrinsicElements'.
}
```

```tsx
// global.d.ts

declare global {
	namespace preact.JSX {
		interface IntrinsicElements {
			'loading-bar': { showing: boolean };
		}
	}
}

// Этот пустой export важен! Он говорит TS рассматривать это как модуль
export {};
```

### Расширение `HTMLAttributes` для глобальных пользовательских атрибутов

Если вы хотите добавить пользовательский атрибут ко всем HTML-элементам, вы можете расширить интерфейс `HTMLAttributes`:

```tsx
function MyComponent() {
	return <div custom="foo"></div>;
	//          ~~~~~~
	//       💥 Error! Type '{ custom: string; }' is not assignable to type 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.
	//                   Property 'custom' does not exist on type 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.
}
```

```tsx
// global.d.ts

declare module 'preact' {
	interface HTMLAttributes {
		custom?: string | undefined;
	}
}

// Этот пустой export важен! Он говорит TS рассматривать это как модуль
export {};
```

### Расширение интерфейсов по элементам для пользовательских атрибутов

Иногда вы можете не хотеть добавлять пользовательский атрибут глобально, а только к конкретному элементу. В этом случае вы можете расширить интерфейс конкретного элемента:

```tsx
// global.d.ts

declare module 'preact' {
	interface HeadingHTMLAttributes {
		custom?: string | undefined;
	}
}

// Этот пустой export важен! Он говорит TS рассматривать это как модуль
export {};
```

Есть, однако, в настоящее время 5 специальных элементов (`<a>`, `<area>`, `<img>`, `<input>` и `<select>`), которые вам нужно обрабатывать немного по-другому: в отличие от других элементов, эти элементы имеют их интерфейсы с префиксом `Partial...` и так вам нужно убедиться, что ваши интерфейсы соответствуют этому паттерну:

```ts
// global.d.ts

declare module 'preact' {
	interface PartialAnchorHTMLAttributes {
		custom?: string | undefined;
	}
}

// Этот пустой export важен! Он говорит TS рассматривать это как модуль
export {};
```

> **Примечание**: Мы делаем это, чтобы обеспечить лучшую поддержку типов ARIA/доступности для этих элементов, поскольку их роли ARIA представляют собой дискриминированный объединённый тип согласно спецификации (например, если у `<a>` есть атрибут `href`, он может иметь несколько определённых ролей, но если атрибута нет, роли могут быть другими). Для этого нам нужно использовать ключевое слово `type` в TypeScript, но это нарушает возможность расширения типа, так как он больше не является простым интерфейсом. Однако наши типы для доступности пересекаются с интерфейсами `Partial...`, поэтому мы можем просто расширять их вместо этого.
