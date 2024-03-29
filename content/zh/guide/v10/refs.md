---
name: 引用
description: '引用可用于访问 Preact 渲染的 DOM 节点'
---

# 引用

您可能需要直接使用 Preact 所渲染的 DOM 元素或组件，引用正是为此而打造。

引用的用例之一是测量 DOM 节点的实际大小。虽然您也可以通过 `ref` 获取组件示例的引用，但我们通常不推荐此方式。此方式会导致子元素和父元素之间产生硬耦合，破坏组件模型的可组合性。大多数情况下，您仅需要在组件属性中传递回调函数即可，而不必直接调用类组件的方法。

---

<div><toc></toc></div>

---

## createRef

`createRef` 函数将返回只有一个 `current` 属性的对象。当调用 `render` 方法时，Preact 会自动为 `current` 属性赋值当前 DOM 节点或组件。

```jsx
// --repl
import { render, Component, createRef } from "preact";
// --repl-before
class Foo extends Component {
  ref = createRef();

  componentDidMount() {
    console.log(this.ref.current);
    // Logs: [HTMLDivElement]
  }
  
  render() {
    return <div ref={this.ref}>foo</div>
  }
}
// --repl-after
render(<Foo />, document.getElementById("app"));
```

## 回调引用

获取元素引用的另一种方式是传递回调函数。您可能需要写更多的代码，但大致上与 `createRef` 类似。

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class Foo extends Component {
  ref = null;
  setRef = (dom) => this.ref = dom;

  componentDidMount() {
    console.log(this.ref);
    // Logs: [HTMLDivElement]
  }
  
  render() {
    return <div ref={this.setRef}>foo</div>
  }
}
// --repl-after
render(<Foo />, document.getElementById("app"));
```

> 若引用的回调函数是内联函数，则此函数会被调用两次。第一次调用时引用为 `null`，另一次时传入实际的引用。这是一个常见错误，使用 `createRef` API 可自动为您检查 `ref.current` 是否存在。

## 拼在一起

假设我们需要获取 DOM 节点的引用来测量其宽和高，我们需要将组件中的占位值替换为实际测量值。

```jsx
class Foo extends Component {
  // 我们需要在此处使用 DOM 节点的实际宽度替换
  state = {
    width: 0,
    height: 0,
  };

  render(_, { width, height }) {
    return <div>宽：{width}，高：{height}</div>;
  }
}
```

您只能在调用 `render` 方法且组件挂载进 DOM 后才能测量元素的宽和高。

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class Foo extends Component {
  state = {
    width: 0,
    height: 0,
  };

  ref = createRef();

  componentDidMount() {
    // 为安全考量检测是否存在引用
    if (this.ref.current) {
      const dimensions = this.ref.current.getBoundingClientRect();
      this.setState({
        width: dimensions.width,
        height: dimensions.height,
      });
    }
  }

  render(_, { width, height }) {
    return (
      <div ref={this.ref}>
        宽：{width}，高：{height}
      </div>
    );
  }
}
// --repl-after
render(<Foo />, document.getElementById("app"));
```

大功告成！现在的组件会在挂载进 DOM 后显示宽和高。
