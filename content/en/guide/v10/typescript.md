---
name: TypeScript
description: "Preact has built-in TypeScript support. Learn how to make use of it!"
---

# TypeScript

`preact` and `preact/compat` provide TypeScript type definitions.

> 💁 You can also use Preact's type definitions in plain JavaScript with [JSDoc annotations](https://fettblog.eu/typescript-jsdoc-superpowers/).

---

<div><toc></toc></div>

---

## TypeScript Configuration

TypeScript includes a full-fledged JSX compiler that you can use instead of Babel. Add the following configuration to your `tsconfig.json` to transpile JSX to Preact-compatible JavaScript:

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

If you use TypeScript within a Babel toolchain, set `jsx` to `preserve` and let Babel handle the transpilation. You still need to specify `jsxFactory` and `jsxFragmentFactory` to get the correct types.

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

Rename your `.jsx` files to `.tsx` for TypeScript to correctly parse your JSX.

## Typing Components

### Functional Components

The type corresponding to functional components is `FunctionComponent` type. This is type definition of `FunctionComponent` type:

```ts
interface FunctionComponent<P = {}> {
  (props: RenderableProps<P>, context?: any): VNode<any> | null;
  displayName?: string;
  defaultProps?: Partial<P>;
}
```

> 💁 FunctionalComponent type is alias of FunctionComponent type.

You can implement a functional component in TypeScript, as below.

```tsx
type Props = {
  name: string;
  age: number;
};

const MyComponent: FunctionComponent<Props> = function ({ name, age }) {
  return (
    <div>
      My name is {name}, I am {age} years old.
    </div>
  );
}
```

`children` is `ComponentChildren` type. `children` as `ComponentChildren` type is added to `FunctionComponent`'s `props` by `RenderableProps` type:

```ts
type RenderableProps<P, RefType = any> = P & Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<RefType> }>;
```

You do not need to add `children` as `ComponentChildren` type to `Props` type:

```tsx
type Props = {
  title: string;
}

function Card({ title, children }: Props) {
  return (
    <div class="card">
      <h1>{title}</h1>
      {children}
    </div>
  );
};
```

### Class Components

Preact's `Component` class is a [generic class](https://www.typescriptlang.org/docs/handbook/generics.html#generic-classes). This type has two generic type parameters which correspond Props and State. These generic type parameters are empty objects by default, and can be defined as follows:

```tsx
// Types for props
type ExpandableProps = {
  title: string;
};

// Types for state
type ExpandableState = {
  toggled: boolean;
};


// ExpandableProps and ExpandableState are passed as generic type parameter.
class Expandable extends Component<ExpandableProps, ExpandableState> {
  constructor(props: ExpandableProps) {
    super(props);
    // `this.state` is a object with `toggle` property which is boolean type by ExpandableState.
    this.state = {
      toggled: false
    };
  }
  render() {
    return (
      <div class="expandable">
        <h2>
          // `this.props.title` is string type by ExpandableProps.
          {this.props.title}{" "}
          <button onClick={() => this.setState({ toggled: !this.state.toggled })}>
            Toggle
          </button>
        </h2>
        // `this.props.children` is `ComponentChildren` type by default.
        <div hidden={this.state.toggled}>{this.props.children}</div>
      </div>
    );
  }
}
```

## Typing Events

Preact uses standard DOM events. Include `"DOM"` in TypeScript's [lib](https://www.typescriptlang.org/tsconfig#lib) compiler option to enable standard DOM event types.

```tsx
export class Button extends Component {
  handleClick(event: MouseEvent) {
    event.preventDefault();
    if (event.target instanceof HTMLElement) {
      console.log(event.target.tagName); // "BUTTON"
    }
  }

  render() {
    return <button onClick={this.handleClick}>{this.props.children}</button>;
  }
}
```

You can provide a more specific type than `EventTarget` by using [this parameters](https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters):

```tsx
export class Button extends Component {
  // Define `this parameters`
  handleClick(this: HTMLButtonElement, event: MouseEvent) {
    event.preventDefault();
    console.log(this.tagName); // "BUTTON"
  }

  render() {
    return (
      <button onClick={this.handleClick}>{this.props.children}</button>
    );
  }
}
```

## Typing References

`createRef()`is [generic type](https://www.typescriptlang.org/docs/handbook/generics.html#generic-types). You can specify a reference type by passing it as `createRef()`'s generic type parameter:

```tsx
import { h, Component, createRef } from "preact";

class Foo extends Component {
  // `this.ref.current` is HTMLAnchorElement type.
  ref = createRef<HTMLAnchorElement>();

  render() {
    return <div ref={this.ref}>Foo</div>;
    //          ~~~
    //       💥 Error! `this.ref` can only be passed to Anchor Element's `ref` attribute.
  }
}
```

## Typing Context

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

## Typing Hooks

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

Just like `createRef`, `useRef` benefits from binding a generic type variable to a subtype of `HTMLElement`. In the example below, we make sure that `inputRef` only can be passed to `HTMLInputElement`. `useRef` is usually initialized with `null`, with the `strictNullChecks` flag enabled, we need to check if `inputRef` is actually available. 

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

For the `useReducer` hook, TypeScript tries to infer as many types as possible from the reducer function. See for example a reducer for a counter.

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

The only annotation needed is in the reducer function itself. The `useReducer` types also ensure that the return value of the reducer function is of type `StateType`.
