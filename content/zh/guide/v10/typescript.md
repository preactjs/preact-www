---
title: TypeScript
description: Preact has built-in TypeScript support. Learn how to make use of it!
---

# TypeScript

Preact 自带 TypeScript 类型定义，这些定义也被库本身使用！

当您在支持 TypeScript 的编辑器（如 VSCode）中使用 Preact 时，您可以在编写常规 JavaScript 时受益于附加的类型信息。如果您想为自己的应用程序添加类型信息，可以使用 [JSDoc 注释](https://fettblog.eu/typescript-jsdoc-superpowers/)，或者编写 TypeScript 并将其转译为常规 JavaScript。本节将重点关注后者。

---

<toc></toc>

---

## TypeScript 配置

TypeScript 包含一个功能齐全的 JSX 编译器，您可以用它来代替 Babel。在您的 `tsconfig.json` 中添加以下配置，以将 JSX 转译为与 Preact 兼容的 JavaScript：

```json
// 经典转换
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
    //...
  }
}
```
```json
// 自动转换，TypeScript >= 4.1.1 可用
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    //...
  }
}
```

如果您在 Babel 工具链中使用 TypeScript，请将 `jsx` 设置为 `preserve`，并让 Babel 处理转译。您仍然需要指定 `jsxFactory` 和 `jsxFragmentFactory` 以获得正确的类型。

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
    //...
  }
}
```

在您的 `.babelrc` 中：

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

将您的 `.jsx` 文件重命名为 `.tsx`，以便 TypeScript 正确解析您的 JSX。

## TypeScript preact/compat 配置

您的项目可能需要支持更广泛的 React 生态系统。为了使您的应用程序能够编译，您可能需要禁用对 `node_modules` 的类型检查，并添加类型的路径，如下所示。这样，当库导入 React 时，您的别名将正常工作。

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

## 为组件添加类型

在 Preact 中有不同的方式为组件添加类型。类组件有泛型类型变量以确保类型安全。只要一个函数返回 JSX，TypeScript 就将其视为函数组件。有多种方法可以为函数组件定义 props。

### 函数组件

为常规函数组件添加类型信息就像为函数参数添加类型信息一样简单。

```tsx
interface MyComponentProps {
  name: string;
  age: number;
};

function MyComponent({ name, age }: MyComponentProps) {
  return (
    <div>
      我的名字是 {name}，我今年 {age.toString()} 岁。
    </div>
  );
}
```

您可以通过在函数签名中设置默认值来设置默认 props。

```tsx
interface GreetingProps {
  name?: string; // name 是可选的！
}

function Greeting({ name = "用户" }: GreetingProps) {
  // name 至少是 "用户"
  return <div>你好 {name}！</div>
}
```

Preact 还提供了 `FunctionComponent` 类型来注释匿名函数。`FunctionComponent` 还为 `children` 添加了类型：

```tsx
import { h, FunctionComponent } from "preact";

const Card: FunctionComponent<{ title: string }> = ({ title, children }) => {
  return (
    <div class="card">
      <h1>{title}</h1>
      {children}
    </div>
  );
};
```

`children` 的类型是 `ComponentChildren`。您可以使用此类型自己指定 children：


```tsx
import { h, ComponentChildren } from "preact";

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
};
```

### 类组件

Preact 的 `Component` 类是一个带有两个泛型类型变量的泛型：Props 和 State。这两种类型默认为空对象，您可以根据需要指定它们。

```tsx
// Props 的类型
interface ExpandableProps {
  title: string;
};

// State 的类型
interface ExpandableState {
  toggled: boolean;
};


// 将泛型绑定到 ExpandableProps 和 ExpandableState
class Expandable extends Component<ExpandableProps, ExpandableState> {
  constructor(props: ExpandableProps) {
    super(props);
    // this.state 是一个带有布尔字段 `toggle` 的对象
    // 由于 ExpandableState
    this.state = {
      toggled: false
    };
  }
  // `this.props.title` 是字符串，由于 ExpandableProps
  render() {
    return (
      <div class="expandable">
        <h2>
          {this.props.title}{" "}
          <button
            onClick={() => this.setState({ toggled: !this.state.toggled })}
          >
            切换
          </button>
        </h2>
        <div hidden={this.state.toggled}>{this.props.children}</div>
      </div>
    );
  }
}
```

类组件默认包含 children，类型为 `ComponentChildren`。

## 继承 HTML 属性

当我们编写像 `<Input />` 这样包装 HTML `<input>` 的组件时，大多数情况下我们希望继承可以在原生 HTML input 元素上使用的 props。为此，我们可以这样做：

```tsx
import { InputHTMLAttributes } from 'preact';

interface InputProperties extends InputHTMLAttributes<HTMLInputElement> {
  mySpecialProp: any
}

const Input = (props: InputProperties) => <input {...props} />
```

现在当我们使用 `Input` 时，它会知道 `value` 等属性...

## 为事件添加类型

Preact 会发出常规的 DOM 事件。只要您的 TypeScript 项目包含 `dom` 库（在 `tsconfig.json` 中设置），您就可以访问当前配置中可用的所有事件类型。

```tsx
import type { TargetedMouseEvent } from "preact";

export class Button extends Component {
  handleClick(event: TargetedMouseEvent<HTMLButtonElement>) {
    alert(event.currentTarget.tagName); // 提示 BUTTON
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

如果您更喜欢内联函数，您可以不必显式地为当前事件目标添加类型，因为它是从 JSX 元素推断出来的：

```tsx
export class Button extends Component {
  render() {
    return (
      <button onClick={(event) => alert(event.currentTarget.tagName)}>
        {this.props.children}
      </button>
    );
  }
}
```

## 为引用添加类型

`createRef` 函数也是泛型的，允许您将引用绑定到元素类型。在此示例中，我们确保引用只能绑定到 `HTMLAnchorElement`。使用任何其他元素的 `ref` 都会让 TypeScript 抛出错误：

```tsx
import { h, Component, createRef } from "preact";

class Foo extends Component {
  ref = createRef<HTMLAnchorElement>();

  componentDidMount() {
    // current 的类型是 HTMLAnchorElement
    console.log(this.ref.current);
  }

  render() {
    return <div ref={this.ref}>Foo</div>;
    //          ~~~
    //       💥 错误！Ref 只能用于 HTMLAnchorElement
  }
}
```

如果您想确保您 `ref` 的元素是可以例如被聚焦的输入元素，这将非常有帮助。

## 为上下文添加类型

`createContext` 尝试从您传递给它的初始值中推断尽可能多的内容：

```tsx
import { h, createContext } from "preact";

const AppContext = createContext({
  authenticated: true,
  lang: "en",
  theme: "dark"
});
// AppContext 的类型是 preact.Context<{
//   authenticated: boolean;
//   lang: string;
//   theme: string;
// }>
```

它还要求您传入您在初始值中定义的所有属性：

```tsx
function App() {
  // 这个会报错 💥 因为我们没有定义 theme
  return (
    <AppContext.Provider
      value={{
//    ~~~~~ 
// 💥 错误：未定义 theme
        lang: "de",
        authenticated: true
      }}
    >
    {}
      <ComponentThatUsesAppContext />
    </AppContext.Provider>
  );
}
```

如果您不想指定所有属性，您可以合并默认值和覆盖值：

```tsx
const AppContext = createContext(appContextDefault);

function App() {
  return (
    <AppContext.Provider
      value={{
        lang: "de",
        ...appContextDefault
      }}
    >
      <ComponentThatUsesAppContext />
    </AppContext.Provider>
  );
}
```

或者您可以在没有默认值的情况下工作，并使用绑定泛型类型变量将上下文绑定到特定类型：

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

所有值都变成可选的，所以在使用它们时您必须进行空检查。

## 为 hooks 添加类型

大多数 hooks 不需要任何特殊的类型信息，但可以从使用中推断类型。

### useState, useEffect, useContext

`useState`、`useEffect` 和 `useContext` 都具有泛型类型，所以您不需要额外注释。下面是一个使用 `useState` 的最小组件，所有类型都从函数签名的默认值中推断出来。

```tsx
const Counter = ({ initial = 0 }) => {
  // 由于 initial 是一个数字（默认值！），clicks 是一个数字
  // setClicks 是一个接受以下内容的函数
  // - 一个数字
  // - 一个返回数字的函数
  const [clicks, setClicks] = useState(initial);
  return (
    <>
      <p>点击次数：{clicks}</p>
      <button onClick={() => setClicks(clicks + 1)}>+</button>
      <button onClick={() => setClicks(clicks - 1)}>-</button>
    </>
  );
};
```

`useEffect` 进行额外检查，以确保您只返回清理函数。

```typescript
useEffect(() => {
  const handler = () => {
    document.title = window.innerWidth.toString();
  };
  window.addEventListener("resize", handler);

  // ✅ 如果您从效果回调返回某些内容
  // 它必须是一个没有参数的函数
  return () => {
    window.removeEventListener("resize", handler);
  };
});
```

`useContext` 从您传递给 `createContext` 的默认对象获取类型信息。

```tsx
const LanguageContext = createContext({ lang: 'en' });

const Display = () => {
  // lang 将是字符串类型
  const { lang } = useContext(LanguageContext);
  return <>
    <p>您选择的语言：{lang}</p>
  </>
}
```

### useRef

就像 `createRef` 一样，`useRef` 受益于将泛型类型变量绑定到 `HTMLElement` 的子类型。在下面的示例中，我们确保 `inputRef` 只能传递给 `HTMLInputElement`。`useRef` 通常以 `null` 初始化，启用 `strictNullChecks` 标志后，我们需要检查 `inputRef` 是否实际可用。

```tsx
import { h } from "preact";
import { useRef } from "preact/hooks";

function TextInputWithFocusButton() {
  // 用 null 初始化，但告诉 TypeScript 我们正在寻找一个 HTMLInputElement
  const inputRef = useRef<HTMLInputElement>(null);
  const focusElement = () => {
    // 严格空检查需要我们检查 inputEl 和 current 是否存在。
    // 但一旦 current 存在，它就是 HTMLInputElement 类型，因此它
    // 有 focus 方法！✅
    if(inputRef && inputRef.current) {
      inputRef.current.focus();
    } 
  };
  return (
    <>
      { /* 此外，inputEl 只能与输入元素一起使用 */ }
      <input ref={inputRef} type="text" />
      <button onClick={focusElement}>聚焦输入框</button>
    </>
  );
}
```

### useReducer

对于 `useReducer` hook，TypeScript 尝试从 reducer 函数中推断尽可能多的类型。例如，看一个计数器的 reducer。

```typescript
// reducer 函数的状态类型
interface StateType {
  count: number;
}

// 一个动作类型，其中 `type` 可以是
// "reset"、"decrement"、"increment"
interface ActionType {
  type: "reset" | "decrement" | "increment";
}

// 初始状态。不需要注释
const initialState = { count: 0 };

function reducer(state: StateType, action: ActionType) {
  switch (action.type) {
    // TypeScript 确保我们处理所有可能的
    // 动作类型，并为类型字符串提供自动完成
    case "reset":
      return initialState;
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
}
```

一旦我们在 `useReducer` 中使用 reducer 函数，我们就会推断几种类型并对传递的参数进行类型检查。

```tsx
function Counter({ initialCount = 0 }) {
  // TypeScript 确保 reducer 最多有两个参数，并且
  // 初始状态的类型是 Statetype。
  // 此外：
  // - state 的类型是 StateType
  // - dispatch 是一个调度 ActionType 的函数
  const [state, dispatch] = useReducer(reducer, { count: initialCount });

  return (
    <>
      计数：{state.count}
      {/* TypeScript 确保调度的动作是 ActionType */}
      <button onClick={() => dispatch({ type: "reset" })}>重置</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </>
  );
}
```

唯一需要的注释是在 reducer 函数本身中。`useReducer` 类型还确保 reducer 函数的返回值类型为 `StateType`。

## 扩展内置 JSX 类型

您可能有希望在 JSX 中使用的[自定义元素](/guide/v10/web-components)，或者您可能希望向所有 HTML 元素添加额外的属性以配合特定库工作。为此，您需要分别扩展 `IntrinsicElements` 或 `HTMLAttributes` 接口，以便 TypeScript 能够感知并提供正确的类型信息。

### 扩展 `IntrinsicElements`

```tsx
function MyComponent() {
  return <loading-bar showing={true}></loading-bar>;
  //      ~~~~~~~~~~~
  //   💥 错误！类型 'JSX.IntrinsicElements' 上不存在属性 'loading-bar'。
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

// 这个空导出很重要！它告诉 TS 将此视为模块
export {}
```

### 扩展 `HTMLAttributes`

```tsx
function MyComponent() {
  return <div custom="foo"></div>;
  //          ~~~~~~
  //       💥 错误！类型 '{ custom: string; }' 不能赋值给类型 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'。
  //                   属性 'custom' 不存在于类型 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>' 上。
}
```

```tsx
// global.d.ts

declare global {
  namespace preact.JSX {
    interface HTMLAttributes {
      custom?: string | undefined;
    }
  }
}

// 这个空导出很重要！它告诉 TS 将此视为模块
export {}
``` 
