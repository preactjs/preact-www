---
name: TypeScript
description: "Preactは初期状態でTypeScriptをサポートしています。それの使い方を学びましょう。"
---

# TypeScript

Preactは自身のTypeScriptの型定義を提供します。

---

<div><toc></toc></div>

---

## TypeScriptの設定

TypeScriptにはBabelの代わりに使うことができる完全なJSXコンパイラがあります。
JSXをPreactが実行可能なJavaScriptに変換するために、以下の設定を`tsconfig.json`に加えます。

```json
// TypeScript < 4.1.1
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
// TypeScript >= 4.1.1
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    //...
  }
}
```

Babelのツールチェーン内でTypeScriptを使う場合は、以下のように`jsx`に`preserve`をセットしてBabelに変換処理を行わせます。
更に、正しい型を取得するために`jsxFactory`と`jsxFragmentFactory`を指定する必要があります。

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

TypeScriptがJSXを正しくパースするために、ファイルの拡張子を`.jsx`から`.tsx`に変更します。

## コンポーネントの型

Preactでは、コンポーネントの種類ごとに型を加える方法が異なります。
クラスコンポーネントには型安全を保証するためのジェネリック型変数があります。
TypeScriptは、関数がJSXを返す場合に限り、それを関数コンポーネントと判定します。
関数コンポーネントの`props`を定義する方法は複数あります。

### 関数コンポーネント

関数コンポーネントに型を加えることは関数の引数に型を加えることと同じくらい簡単です。

```tsx
type MyComponentProps = {
  name: string;
  age: number;
};

function MyComponent({ name, age }: MyComponentProps) {
  return (
    <div>
      My name is {name}, I am {age.toString()} years old.
    </div>
  );
}
```

関数の定義にデフォルトの値を設定することで、デフォルトの`props`を設定することができます。

```tsx
type GreetingProps = {
  name?: string; // nameはオプションです。
}

function Greeting({ name = "User" }: GreetingProps) {
  // nameのデフォルトの値は"User"になります。
  return <div>Hello {name}!</div>
}
```

Preactは無名関数に対応する`FunctionComponent`型を提供します。
`FunctionComponent`は`children`に対応する型を`props`に追加します。

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

`children`の型は`ComponentChildren`です。
この型を使って、`children`を判別させることができます。


```tsx
import { h, ComponentChildren } from "preact";

type ChildrenProps = {
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

### クラスコンポーネント

Preactの`Component`クラスはジェネリック型です。
その型はPropsとStateに対応するジェネリック型変数を持ちます。
デフォルトでは、ジェネリック型変数は空のオブジェクトです。
以下のように、必要に応じて型を定義してジェネリック型変数として渡すことができます

```tsx
// Propsに対応する型
type ExpandableProps = {
  title: string;
};

// Stateステートに対応する型
type ExpandableState = {
  toggled: boolean;
};


// ExpandablePropsとExpandableStateをジェネリック型変数として渡します。
class Expandable extends Component<ExpandableProps, ExpandableState> {
  constructor(props: ExpandableProps) {
    super(props);
    // ExpandableStateによって、this.stateはboolean型の`toggle`プロパティを持つオブジェクトになりました。
    this.state = {
      toggled: false
    };
  }
  // ExpandablePropsによって、`this.props.title`はstring型になりました。
  render() {
    return (
      <div class="expandable">
        <h2>
          {this.props.title}{" "}
          <button
            onClick={() => this.setState({ toggled: !this.state.toggled })}
          >
            Toggle
          </button>
        </h2>
        // デフォルトで、`props`は`children`プロパティを`ComponentChildren`型として持ちます。
        <div hidden={this.state.toggled}>{this.props.children}</div>
      </div>
    );
  }
}
```

## Typing events

Preact emits regular DOM events. As long as your TypeScript project includes the `dom` library (set it in `tsconfig.json`), you have access to all event types that are available in your current configuration.

```tsx
export class Button extends Component {
  handleClick(event: MouseEvent) {
    event.preventDefault();
    if (event.target instanceof HTMLElement) {
      alert(event.target.tagName); // Alerts BUTTON
    }
  }

  render() {
    return <button onClick={this.handleClick}>{this.props.children}</button>;
  }
}
```

You can restrict event handlers by adding a type annotation for `this` to the function signature as the first argument.
This argument will be erased after transpilation.

```tsx
export class Button extends Component {
  // Adding the this argument restricts binding
  handleClick(this: HTMLButtonElement, event: MouseEvent) {
    event.preventDefault();
    if (event.target instanceof HTMLElement) {
      console.log(event.target.localName); // "button"
    }
  }

  render() {
    return (
      <button onClick={this.handleClick}>{this.props.children}</button>
    );
  }
}
```

## Typing references

The `createRef` function is also generic, and lets you bind references to element types.
In this example, we ensure that the reference can only be bound to `HTMLAnchorElement`.
Using `ref` with any other element lets TypeScript thrown an error:

```tsx
import { h, Component, createRef } from "preact";

class Foo extends Component {
  ref = createRef<HTMLAnchorElement>();

  componentDidMount() {
    // current is of type HTMLAnchorElement
    console.log(this.ref.current);
  }

  render() {
    return <div ref={this.ref}>Foo</div>;
    //          ~~~
    //       💥 Error! Ref only can be used for HTMLAnchorElement
  }
}
```

This helps a lot if you want to make sure that the elements you `ref` to are input elements that can be e.g. focussed.

## Typing context

`createContext` tries to infer as much as possible from the intial values you pass to:

```tsx
import { h, createContext } from "preact";

const AppContext = createContext({
  authenticated: true,
  lang: "en",
  theme: "dark"
});
// AppContext is of type preact.Context<{
//   authenticated: boolean;
//   lang: string;
//   theme: string;
// }>
```

It also requires you to pass in all the properties you defined in the initial value:

```tsx
function App() {
  // This one errors 💥 as we haven't defined theme
  return (
    <AppContext.Provider
      value={{
//    ~~~~~ 
// 💥 Error: theme not defined
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

If you don't want to specify all properties, you can either merge default values with overrides:

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

Or you work without default values and use bind the generic type variable to bind context to a certain type:

```tsx
type AppContextValues = {
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

All values become optional, so you have to do null checks when using them.

## Typing hooks

Most hooks don't need any special typing information, but can infer types from usage.

### useState, useEffect, useContext

`useState`, `useEffect` and `useContext` all feature generic types so you don't need to annotate extra. Below is a minimal component that uses `useState`, with all types infered from the function signature's default values.

```tsx
const Counter = ({ initial = 0 }) => {
  // since initial is a number (default value!), clicks is a number
  // setClicks is a function that accepts 
  // - a number 
  // - a function returning a number
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

`useEffect` does extra checks so you only return cleanup functions.

```typescript
useEffect(() => {
  const handler = () => {
    document.title = window.innerWidth.toString();
  };
  window.addEventListener("resize", handler);

  // ✅  if you return something from the effect callback
  // it HAS to be a function without arguments
  return () => {
    window.removeEventListener("resize", handler);
  };
});
```

`useContext` gets the type information from the default object you pass into `createContext`.

```tsx
const LanguageContext = createContext({ lang: 'en' });

const Display = () => {
  // lang will be of type string
  const { lang } = useContext(LanguageContext);
  return <>
    <p>Your selected language: {lang}</p>
  </>
}
```

### useRef

Just like `createRef`, `useRef` benefits from binding a generic type variable to a subtype of `HTMLElement`.
In the example below, we make sure that `inputRef` only can be passed to `HTMLInputElement`.
`useRef` is usually initialized with `null`, with the `strictNullChecks` flag enabled, we need to check if `inputRef` is actually available.

```tsx
import { h } from "preact";
import { useRef } from "preact/hoooks";

function TextInputWithFocusButton() {
  // initialise with null, but tell TypeScript we are looking for an HTMLInputElement
  const inputRef = useRef<HTMLInputElement>(null);
  const focusElement = () => {
    // strict null checks need us to check if inputEl and current exist.
    // but once current exists, it is of type HTMLInputElement, thus it
    // has the method focus! ✅
    if(inputRef && inputRef.current) {
      inputRef.current.focus();
    } 
  };
  return (
    <>
      { /* in addition, inputEl only can be used with input elements */ }
      <input ref={inputRef} type="text" />
      <button onClick={focusElement}>Focus the input</button>
    </>
  );
}
```

### useReducer

For the `useReducer` hook, TypeScript tries to infer as many types as possible from the reducer function.
See for example a reducer for a counter.

```typescript
// The state type for the reducer function
type StateType = {
  count: number;
}

// An action type, where the `type` can be either
// "reset", "decrement", "increment"
type ActionType = {
  type: "reset" | "decrement" | "increment";
}

// The initial state. No need to annotate
const initialState = { count: 0 };

function reducer(state: StateType, action: ActionType) {
  switch (action.type) {
    // TypeScript makes sure we handle all possible
    // action types, and gives auto complete for type
    // strings
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

Once we use the reducer function in `useReducer`, we infer several types and do type checks for passed arguments.

```tsx
function Counter({ initialCount = 0 }) {
  // TypeScript makes sure reducer has maximum two arguments, and that
  // the initial state is of type Statetype.
  // Furthermore:
  // - state is of type StateType
  // - dispatch is a function to dispath ActionType
  const [state, dispatch] = useReducer(reducer, { count: initialCount });

  return (
    <>
      Count: {state.count}
      {/* TypeScript ensures that the dispatched actions are of ActionType */}
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </>
  );
}
```

The only annotation needed is in the reducer function itself.
The `useReducer` types also ensure that the return value of the reducer function is of type `StateType`.