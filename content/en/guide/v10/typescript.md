---
name: TypeScript
description: "Preact has built-in TypeScript support. Learn how to make use of it!"
---

# TypeScript

Preact ships TypeScript type definitions, which are used by the library itself! 

When you use Preact in a TypeScript-aware editor (like VSCode), you can benefit from the added type information while writing regular JavaScript. If you want to add type information to your own applications, you can use [JSDoc annotations](https://fettblog.eu/typescript-jsdoc-superpowers/), or write TypeScript and transpile to regular JavaScript. This section will focus on the latter.

---

<div><toc></toc></div>

---

## TypeScript configuration

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

Rename your `.jsx` files to `.tsx` for TypeScript to correctly parse your JSX.

## TypeScript preact/compat configuration

Your project could need support for the wider React ecosystem.  To make your application
compile, you might need to disable type checking on your `node_modules` and add paths to the types
like this.  This way, your alias will work properly when libraries import React.

```json
{
  "compilerOptions": {
    ...
    "skipLibCheck": true,
    "baseUrl": "./",
    "paths": {
      "react": ["./node_modules/preact/compat/"],
      "react-dom": ["./node_modules/preact/compat/"]
    }
  }
}
```

## Typing components

There are different ways to type components in Preact. Class components have generic type variables to ensure type safety. TypeScript sees a function as functional component as long as it returns JSX. There are multiple solutions to define props for functional components.

### Function components

Typing regular function components is as easy as adding type information to the function arguments.

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

You can set default props by setting a default value in the function signature.

```tsx
type GreetingProps = {
  name?: string; // name is optional!
}

function Greeting({ name = "User" }: GreetingProps) {
  // name is at least "User"
  return <div>Hello {name}!</div>
}
```

Preact also ships a `FunctionComponent` type to annotate anonymous functions. `FunctionComponent` also adds a type for `children`:

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

`children` is of type `ComponentChildren`. You can specify children on your own using this type:


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

### Class components

Preact's `Component` class is typed as a generic with two generic type variables: Props and State. Both types default to the empty object, and you can specify them according to your needs.

```tsx
// Types for props
type ExpandableProps = {
  title: string;
};

// Types for state
type ExpandableState = {
  toggled: boolean;
};


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
          {this.props.title}{" "}
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

Class components include children by default, typed as `ComponentChildren`.

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

You can restrict event handlers by adding a type annotation for `this` to the function signature as the first argument. This argument will be erased after transpilation.

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

The `createRef` function is also generic, and lets you bind references to element types. In this example, we ensure that the reference can only be bound to `HTMLAnchorElement`. Using `ref` with any other element lets TypeScript thrown an error:

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
  // - dispatch is a function to dispatch ActionType
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
