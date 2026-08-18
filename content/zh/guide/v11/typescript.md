---
title: TypeScript
description: Preact 内置 TypeScript 支持。学习如何使用它！
---

# TypeScript

Preact 附带 TypeScript 的类型定义，库本身也在使用这些类型定义！

在支持 TypeScript 的编辑器（例如 VSCode）中使用 Preact 时，即使编写常规 JavaScript，也能受益于额外的类型信息。如果你想为自己的应用添加类型信息，可以使用 JSDoc 注释（例如：https://fettblog.eu/typescript-jsdoc-superpowers/），或者直接编写 TypeScript 并将其转译为普通 JavaScript。本节重点介绍后一种方式。

---

<toc></toc>

---

## TypeScript 配置

TypeScript 自带完整的 JSX 编译器，可以替代 Babel 使用。将以下配置添加到你的 `tsconfig.json`，以将 JSX 转译为与 Preact 兼容的 JavaScript：

```json
// 经典转换
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
// 自动转换，TypeScript >= 4.1.1 可用
{
	"compilerOptions": {
		"jsx": "react-jsx",
		"jsxImportSource": "preact"
		//...
	}
}
```

如果你在 Babel 工具链中使用 TypeScript，请将 `jsx` 设置为 `preserve` 并让 Babel 处理转译。你仍需指定 `jsxFactory` 和 `jsxFragmentFactory` 以获得正确的类型信息。

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

In your `.babelrc`:

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

将你的 `.jsx` 文件重命名为 `.tsx`，以便 TypeScript 正确解析 JSX。

## TypeScript 的 `preact/compat` 配置

如果你的项目需要支持更广泛的 React 生态，在编译时可能需要对 `node_modules` 禁用类型检查并为类型添加路径映射。如下配置可以在库导入 `react` 时让别名正常工作：

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

## 组件的类型定义

在 Preact 中为组件添加类型有多种方式。类组件使用泛型类型变量来确保类型安全。只要函数返回 JSX，TypeScript 就会将其视为函数式组件。对于函数式组件的 props，有多种定义方案。

### 函数组件

为普通函数组件添加类型非常简单，只需在函数参数处添加类型信息。

```tsx
interface MyComponentProps {
	name: string;
	age: number;
}

function MyComponent({ name, age }: MyComponentProps) {
	return (
		<div>
			My name is {name}, I am {age.toString()} years old.
		</div>
	);
}
```

你可以在函数签名中为参数设置默认值来实现默认 props。

```tsx
interface GreetingProps {
	name?: string; // name is optional!
}

function Greeting({ name = 'User' }: GreetingProps) {
	// name 至少为 "User"
	return <div>Hello {name}!</div>;
}
```

Preact 还提供了 `FunctionComponent` 类型用于注释匿名函数。`FunctionComponent` 会为 `children` 添加类型：

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

`children` 的类型为 `ComponentChildren`。你也可以使用该类型自行指定 children：

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

### 类组件

Preact 的 `Component` 类是一个带有两个泛型类型变量（Props 和 State）的泛型类。两个类型默认都是空对象，你可以根据需要指定它们。

```tsx
// Types for props
interface ExpandableProps {
	title: string;
}

// Types for state
interface ExpandableState {
	toggled: boolean;
}

// Bind generics to ExpandableProps and ExpandableState
class Expandable extends Component<ExpandableProps, ExpandableState> {
	constructor(props: ExpandableProps) {
		super(props);
		// this.state is an object with a boolean field `toggle`
		// due to ExpandableState
		this.state = {
			toggled: false
		};
	}
	// `this.props.title` is string due to ExpandableProps
	render() {
		return (
			<div class="expandable">
				<h2>
					{this.props.title}{' '}
					<button
						onClick={() => this.setState({ toggled: !this.state.toggled })}
					>
						Toggle
					</button>
				</h2>
				<div hidden={this.state.toggled}>{this.props.children}</div>
			</div>
		);
	}
}
```

类组件默认包含 children，其类型为 `ComponentChildren`。

## 继承 HTML 属性

当我们编写像 `<Input />` 这样的组件来包裹原生 `<input>` 元素时，通常希望继承原生 HTML input 元素可用的属性。可以按如下方式实现：

```tsx
import { InputHTMLAttributes } from 'preact';

interface InputProperties extends InputHTMLAttributes {
	mySpecialProp: any;
}

const Input = (props: InputProperties) => <input {...props} />;
```

现在使用 `Input` 时，它会识别诸如 `value` 等属性。

## 事件的类型定义

Preact 会触发常规的 DOM 事件。只要你的 TypeScript 项目在 `tsconfig.json` 中包含了 `dom` 库，就可以使用当前配置下所有事件类型。

```tsx
import type { TargetedMouseEvent } from "preact";

export class Button extends Component {
    handleClick(event: TargetedMouseEvent<HTMLButtonElement>) {
    alert(event.currentTarget.tagName); // 会弹出 BUTTON
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

如果你偏好内联函数，可以不显式标注当前事件目标的类型，因为它会从 JSX 元素推断出来：

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

## 引用（refs）的类型定义

`createRef` 函数也是泛型的，允许你将引用绑定到特定的元素类型。在下面的示例中，我们确保引用只能绑定到 `HTMLAnchorElement`。若对其他元素使用该 `ref`，TypeScript 会报错：

```tsx
import { h, Component, createRef } from 'preact';

class Foo extends Component {
	ref = createRef<HTMLAnchorElement>();

	componentDidMount() {
		// current 的类型为 HTMLAnchorElement
		console.log(this.ref.current);
	}

	render() {
		return <div ref={this.ref}>Foo</div>;
		//          ~~~
		//       💥 错误！该 ref 只可用于 HTMLAnchorElement
	}
}
```

如果你想确保引用的元素是可聚焦（focusable）的输入元素，这点非常有用。

## 上下文（context）的类型定义

`createContext` 会尽可能从你传入的初始值推断出类型：

```tsx
import { h, createContext } from 'preact';

const AppContext = createContext({
	authenticated: true,
	lang: 'en',
	theme: 'dark'
});
// AppContext 的类型为 preact.Context<{
//   authenticated: boolean;
//   lang: string;
//   theme: string;
// }>
```

它同时要求你在提供 value 时包含初始值中定义的所有属性：

```tsx
function App() {
	// 这里会报错 💥 因为我们没有定义 theme
	return (
		<AppContext.Provider
			value={{
				//    ~~~~~
				// 💥 错误：theme 未定义
				lang: 'de',
				authenticated: true
			}}
		>
			{}
			<ComponentThatUsesAppContext />
		</AppContext.Provider>
	);
}
```

如果你不想指定所有属性，可以将默认值与覆盖值合并：

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

或者你可以不使用默认值，而是在创建 context 时通过泛型类型变量为 context 绑定特定类型：

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
```

所有值将变为可选，因此在使用时需要进行空值检查。

## Hooks 的类型定义

大多数 hooks 不需要特殊的类型声明，通常可从使用方式中推断类型。

### useState、useEffect、useContext

`useState`、`useEffect` 和 `useContext` 都支持泛型类型，因此通常无需额外注解。下面是一个最小示例，展示了 `useState` 如何从函数签名的默认值推断出类型。

```tsx
const Counter = ({ initial = 0 }) => {
	// 由于 initial 是数字（默认值），所以 clicks 是数字
	// setClicks 是一个接受以下参数的函数
	// - 一个数字
	// - 或者返回数字的函数
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

`useEffect` 会做额外检查，因此你从 effect 回调返回的只能是一个没有参数的清理函数。

```typescript
useEffect(() => {
	const handler = () => {
		document.title = window.innerWidth.toString();
	};
	window.addEventListener('resize', handler);

	// ✅  if you return something from the effect callback
	// it HAS to be a function without arguments
	return () => {
		window.removeEventListener('resize', handler);
	};
});
```

`useContext` gets the type information from the default object you pass into `createContext`.

```tsx
const LanguageContext = createContext({ lang: 'en' });

const Display = () => {
	// lang 的类型将为 string
	const { lang } = useContext(LanguageContext);
	return (
		<>
			<p>Your selected language: {lang}</p>
		</>
	);
};
```

### useRef

与 `createRef` 类似，`useRef` 通过为泛型类型变量指定 HTMLElement 的子类型来收获类型优势。在下面的示例中，我们确保 `inputRef` 只用于 `HTMLInputElement`。`useRef` 通常用 `null` 初始化；在启用 `strictNullChecks` 的情况下，需要检查 `inputRef` 是否存在。

```tsx
import { h } from 'preact';
import { useRef } from 'preact/hooks';

function TextInputWithFocusButton() {
	// initialise with null, but tell TypeScript we are looking for an HTMLInputElement
	const inputRef = useRef<HTMLInputElement>(null);
	const focusElement = () => {
		// 在 strict null checks 下需要检查 ref 和 current 是否存在。
		// 但一旦 current 存在，它的类型为 HTMLInputElement，因此它
		// 因此它有 focus 方法 ✅
		if (inputRef && inputRef.current) {
			inputRef.current.focus();
		}
	};
	return (
		<>
			{/* 此外，inputRef 仅可用于 input 元素 */}
			<input ref={inputRef} type="text" />
			<button onClick={focusElement}>Focus the input</button>
		</>
	);
}
```

### useReducer

对于 `useReducer`，TypeScript 会尽可能从 reducer 函数中推断出类型。例如，下面展示了计数器的 reducer：

```typescript
// reducer 函数的 state 类型
interface StateType {
	count: number;
}

// action 的类型，`type` 可以是
// "reset", "decrement", "increment"
interface ActionType {
	type: 'reset' | 'decrement' | 'increment';
}

// 初始 state。无需注解
const initialState = { count: 0 };

function reducer(state: StateType, action: ActionType) {
	switch (action.type) {
		// TypeScript 会确保我们处理所有可能的 action 类型，并为类型字符串提供自动完成
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

Once we use the reducer function in `useReducer`, we infer several types and do type checks for passed arguments.

```tsx
function Counter({ initialCount = 0 }) {
	// TypeScript 会确保 reducer 最多接收两个参数，并且初始 state 与 StateType 匹配。
	// 此外：
	// - state 的类型为 StateType
	// - dispatch 是用于发送 ActionType 的函数
	const [state, dispatch] = useReducer(reducer, { count: initialCount });

	return (
		<>
			Count: {state.count}
			{/* TypeScript ensures that the dispatched actions are of ActionType */}
			<button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
			<button onClick={() => dispatch({ type: 'increment' })}>+</button>
			<button onClick={() => dispatch({ type: 'decrement' })}>-</button>
		</>
	);
}
```

唯一需要显式标注的地方通常是在 reducer 函数本身。`useReducer` 的类型还会确保 reducer 的返回值符合 `StateType`。

## 扩展内置的 JSX 类型

你可能会在 JSX 中使用自定义元素（参见 /guide/v11/web-components），或者想为所有或某些 HTML 元素添加额外属性以配合特定库使用。为此，需要使用“模块扩展（Module augmentation）”来扩展或修改 Preact 提供的类型。

### 为自定义元素扩展 `IntrinsicElements`

```tsx
function MyComponent() {
	return <loading-bar showing={true}></loading-bar>;
	//      ~~~~~~~~~~~
	//   💥 错误！属性 'loading-bar' 在类型 'JSX.IntrinsicElements' 中不存在。
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

// 这个空导出很重要！它告诉 TypeScript 将此文件视为模块
export {};
```

### 为全局自定义属性扩展 `HTMLAttributes`

如果你想向所有 HTML 元素添加自定义属性，可以扩展 `HTMLAttributes` 接口：

```tsx
function MyComponent() {
	return <div custom="foo"></div>;
	//          ~~~~~~
	//       💥 错误！类型 '{ custom: string; }' 无法赋值给类型 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'。
	//                   属性 'custom' 在类型 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>' 中不存在。
}
```

```tsx
// global.d.ts

declare module 'preact' {
	interface HTMLAttributes {
		custom?: string | undefined;
	}
}

// 这个空导出很重要！它告诉 TypeScript 将此文件视为模块
export {};
```

### 为单个元素扩展属性接口

有时你可能不想全局添加自定义属性，而仅针对特定元素扩展。这种情况下可以扩展该元素对应的接口：

```tsx
// global.d.ts

declare module 'preact' {
	interface HeadingHTMLAttributes {
		custom?: string | undefined;
	}
}

// 这个空导出很重要！它告诉 TypeScript 将此文件视为模块
export {};
```

但是，目前有 5 个特殊元素（`<a>`、`<area>`、`<img>`、`<input>` 和 `<select>`）需要稍作不同的处理：与其他元素不同，这些元素的接口以 `Partial...` 为前缀，因此你需要确保你的接口符合这一模式：

```ts
// global.d.ts

declare module 'preact' {
	interface PartialAnchorHTMLAttributes {
		custom?: string | undefined;
	}
}

// 这个空导出很重要！它告诉 TypeScript 将此文件视为模块
export {};
```

> **注意**：我们这样做是为了支持这些元素更完善的 ARIA/无障碍类型，因为根据规范这些元素的 ARIA 角色是判别联合类型（例如，如果 `<a>` 有 `href` 属性，它可以具有几种特定角色；如果没有，它又可能具有另一组角色）。为实现这点，我们需要在 TypeScript 中使用 `type` 关键字，但这会阻止类型被扩展，因为它不再是简单的接口。不过，我们的无障碍类型与 `Partial...` 接口相交，因此可以通过扩展这些接口来实现需要的功能。
