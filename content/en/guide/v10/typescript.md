---
name: TypeScript
description: "Preact has built-in TypeScript support. Learn how to make use of it!"
---

# TypeScript

This guide explains how to configure to use Typescript and use Preact's TypeScript type definitions.

> 💁 You can also use Preact's type definitions in plain JavaScript with [JSDoc annotations](https://fettblog.eu/typescript-jsdoc-superpowers/).

---

<div><toc></toc></div>

---

## Configuration

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

## Type Definitions

Preact's packages (preact, preact/compat, hooks, etc.) provide TypeScript type definitions. These type definitions are explained at below.

## Functional Components

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
import { h, FunctionComponent } from 'preact';

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

`children` is `ComponentChildren` type. `children?` as `ComponentChildren` type is added to `FunctionComponent`'s `props` by `RenderableProps` type:

```ts
type RenderableProps<P, RefType = any> = P & Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<RefType> }>;
```

Since `children` in `RenderableProps` type is `children?: ComponentChildren`, `children` need to be specified when `children` is required:

```tsx
import { h, FunctionComponent } from 'preact';

type Props = {
  title: string;
  children: ComponentChildren;
}

const Card: FunctionComponent<Props> = function ({ title, children }) {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
};
```

## Class Components

Preact's `Component` class is a [generic class](https://www.typescriptlang.org/docs/handbook/generics.html#generic-classes). This type has two generic type parameters which correspond `props` and `state`. These generic type parameters are empty objects by default. `children?` as `ComponentChildren` type is added to `Component`'s `props` by `RenderableProps` type:

```ts
interface Component<P = {}, S = {}> {
  componentWillMount?(): void;
  componentDidMount?(): void;
  componentWillUnmount?(): void;
  getChildContext?(): object;
  componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
  shouldComponentUpdate?(
    nextProps: Readonly<P>,
    nextState: Readonly<S>,
    nextContext: any
  ): boolean;
  componentWillUpdate?(
    nextProps: Readonly<P>,
    nextState: Readonly<S>,
    nextContext: any
  ): void;
  getSnapshotBeforeUpdate?(oldProps: Readonly<P>, oldState: Readonly<S>): any;
  componentDidUpdate?(
    previousProps: Readonly<P>,
    previousState: Readonly<S>,
    snapshot: any
  ): void;
  componentDidCatch?(error: any, errorInfo: any): void;
}

abstract class Component<P, S> {
  constructor(props?: P, context?: any);

  static displayName?: string;
  static defaultProps?: any;
  static contextType?: Context<any>;

  static getDerivedStateFromProps?(
    props: Readonly<object>,
    state: Readonly<object>
  ): object | null;
  static getDerivedStateFromError?(error: any): object | null;

  state: Readonly<S>;
  props: RenderableProps<P>;
  context: any;
  base?: Element | Text;

  setState<K extends keyof S>(
    state:
      | ((
          prevState: Readonly<S>,
          props: Readonly<P>
        ) => Pick<S, K> | Partial<S> | null)
      | (Pick<S, K> | Partial<S> | null),
    callback?: () => void
  ): void;

  forceUpdate(callback?: () => void): void;

  abstract render(
    props?: RenderableProps<P>,
    state?: Readonly<S>,
    context?: any
  ): ComponentChild;
}
```

You can implement a class component:

```tsx
import { h, Component } from 'preact';

// Types for props
// in the case `children` is required.
type ExpandableProps = {
  title: string;
  children: ComponentChildren;
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
      <div>
        <h2>
          // `this.props.title` is string type by ExpandableProps.
          {this.props.title}{" "}
          <button onClick={() => this.setState({ toggled: !this.state.toggled })}>
            Toggle
          </button>
        </h2>
        <div hidden={this.state.toggled}>{this.props.children}</div>
      </div>
    );
  }
}
```

## Events

Preact uses standard DOM events. Include `"DOM"` in TypeScript's [lib](https://www.typescriptlang.org/tsconfig#lib) compiler option to enable standard DOM event types.

```tsx
import { h, Component } from 'preact';

export class Button extends Component {
  handleClick(event: MouseEvent) {
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
import { h, Component } from 'preact';

export class Button extends Component {
  // Define `this parameters`
  handleClick(this: HTMLButtonElement, event: MouseEvent) {
    console.log(this.tagName); // "BUTTON"
  }

  render() {
    return <button onClick={this.handleClick}>{this.props.children}</button>;
  }
}
```

You can provide a more specific type than `EventTarget` by using `TargetedEvent`. `TargetedEvent` type has two generic type parameters which corresponds `currentTarget`'s type and Event type:

```tsx
import { h, Component, JSX } from 'preact';

export class Button extends Component {
  handleClick({ currentTarget }: JSX.TargetedEvent<HTMLButtonElement, Event> {
    console.log(currentTarget.tagName); // "BUTTON"
  }

  render() {
    return <button onClick={this.handleClick}>{this.props.children}</button>;
  }
}
```

## References

`createRef()`is [generic type](https://www.typescriptlang.org/docs/handbook/generics.html#generic-types). You can specify a reference type by passing it as `createRef()`'s generic type parameter:

```ts
function createRef<T = any>(): RefObject<T>;
type RefObject<T> = { current: T | null };
```

The following code is usage:

```tsx
import { h, Component, createRef } from "preact";

export class Button extends Component {
  ref = createRef<HTMLButtonElement>();

  componentDidMount() {
    console.log(this.ref.current.tagName); // "BUTTON"
  }

  render() {
    return <button ref={this.ref}>{this.props.children}</button>;
  }
}
```

## Context

## Hooks

### useState

### useReducer

### useMemo 

### useCallback

### useRef

### useContext

### useEffect

### useLayoutEffect

### useErrorBoundary
