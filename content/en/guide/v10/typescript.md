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

## Typing hooks

## Typing events
