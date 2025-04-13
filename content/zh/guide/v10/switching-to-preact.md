---
title: 从 React 迁移到 Preact 
description: '从 React 迁移到 Preact 时必要的说明。'
---

# 从 React 切换到 Preact

`preact/compat` 是我们的兼容层，它允许您无需修改现有代码即可利用 React 生态系统中丰富的库。这是现有的 React 应用迁移到 Preact 的推荐选择。

通过这一兼容层，您可以沿用现有的 React/ReactDOM 代码和开发流程。只增加约 2kb 的打包体积，就能无缝兼容 npm 上绝大多数 React 生态模块。该包在 Preact 核心之上完美模拟了 `react` 和 `react-dom` 的完整功能，并将这两个模块整合在一个模块中。

---

<div><toc></toc></div>

---

## 设置 compat

要启用 `preact/compat`，只需在构建工具中将 `react` 和 `react-dom` 的引用重定向到 `preact/compat`。[开始上手](/guide/v10/getting-started#aliasing-react-to-preact)页面提供了主流打包工具的详细配置方法。

## PureComponent

`PureComponent` 是自带性能优化的组件基类：和 `Component` 类不同的是，当新旧 `props` 通过浅层比较（逐个属性值比对）相等时，将自动跳过渲染。这通过默认的 `shouldComponentUpdate` 生命周期钩子实现，能显著提升复杂应用的性能表现。

```jsx
import { render } from 'preact';
import { PureComponent } from 'preact/compat';

class Foo extends PureComponent {
  render(props) {
    console.log("render")
    return <div />
  }
}

const dom = document.getElementById('root');
render(<Foo value="3" />, dom);
// 输出: "render"

// 第二次渲染，不会输出任何内容
render(<Foo value="3" />, dom);
```

> 注意：当组件渲染开销较大时，使用 `PureComponent` 才能体现优势。对于简单组件，直接渲染可能比 `props` 比对更高效。

## memo

`memo` 为函数式组件提供类似 `PureComponent` 的优化能力。您既可以使用默认比较，也可以自定义比对逻辑来满足特定需求。

```jsx
import { memo } from 'preact/compat';

function MyComponent(props) {
  return <div>Hello {props.name}</div>
}

// 使用默认比较函数
const Memoed = memo(MyComponent);

// 使用自定义比较函数
const Memoed2 = memo(MyComponent, (prevProps, nextProps) => {
  // 仅当 `name` 改变时才重新渲染
  return prevProps.name === nextProps.name;
})
```

> 比对函数与 `shouldComponentUpdate` 不同之处在于，前者比较两个 props 是否**相同**（比对函数返回 `true` 表示属性相同），而后者比较两个 props 是否不同。

## forwardRef

当需要暴露内部子元素引用时，`forwardRef` 可将 `ref` 属性透传到指定元素：

```jsx
import { createRef, render } from 'preact';
import { forwardRef } from 'preact/compat';

const MyComponent = forwardRef((props, ref) => {
  return <div ref={ref}>Hello world</div>;
})

// 用法：`ref` 将持有内部 `div` 的引用，而不是 `MyComponent` 的引用
const ref = createRef();
render(<MyComponent ref={ref} />, dom)
```

这个功能对可复用组件库作者尤为重要。

## 跨层级渲染 Portals

当需要将内容渲染到组件树之外的 DOM 节点时，可以使用 `createPortal`。注意目标容器需预先存在。

```html
<html>
  <body>
    <!-- App 在这里渲染 -->
    <div id="app"></div>
    <!-- Modals 应该在这里渲染 -->
    <div id="modals"></div>
  </body>
</html>
```

```jsx
import { createPortal } from 'preact/compat';
import MyModal from './MyModal';

function App() {
  const container = document.getElementById('modals');
  return (
    <div>
      我是 App
      {createPortal(<MyModal />, container)}
    </div>
  )
}
```

> 请记住，由于 Preact 重用了浏览器的原生事件系统，所以 Portal 内事件不会冒泡到父组件树当中。

## Suspense

`Suspense` 允许在子组件加载过程中展示加载状态，常用于代码分割等异步场景。当子组件的加载未完成时显示备用内容。

```jsx
import { Suspense, lazy } from 'preact/compat';

const SomeComponent = lazy(() => import('./SomeComponent'));

// 用法
<Suspense fallback={<div>加载中...</div>}>
  <Foo>
    <SomeComponent />
  </Foo>
</Suspense>
```

在此示例中，界面将显示 `加载中...` 文本，直到 `SomeComponent` 加载完毕并且 Promise 完成。

> React 和 Preact 中的 Suspense 仍处于演进阶段。虽然 React 团队仍然不鼓励用户直接将其用于数据获取，但它已被众多 Preact 开发者成功实践多年。尽管存在部分已知问题（最新动态请参考[我们的问题追踪系统](https://github.com/preactjs/preact/issues)），但普遍认为其稳定性足以满足生产环境需求。
>
> 例如，您现在浏览的 Preact 官方网站，正是采用基于 Suspense 的异步数据加载策略来实现全站内容渲染。
