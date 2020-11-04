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
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
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

Rename your `jsx` files to `tsx` for TypeScript to correctly parse your JSX.

## Typing components

tbd

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
  constructor() {
    super();
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
      alert(event.target.tagName); // Alerts BUTTON
    }
  }

  render() {
    return (
      <>
        <button onClick={this.handleClick}>{this.props.children}</button>;
      </>
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
    console.log(this.ref.current);
  }

  render() {
    return <div ref={this.ref}>Foo</div>;
    //          ~~~
    //       💥 Error! Ref only can be used for HTMLAnchorELement
  }
}
```

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
        lang: "de",
        authenticated: true
      }}
      {/* ~~~ Error: theme not defined */}
    >
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

### useState

### useEffect

### useContext

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

### useMemo and useCallback

### useReducer

## Exposed types
