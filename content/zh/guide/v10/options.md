---
name: 选项钩子
description: 'Preact 提供可附加到对比树差异过程的选项钩子。'
---

# 选项钩子

为修改 Preact 渲染流程的插件提供的回调函数。

Preact 支持多种观察或修改渲染流程的回调函数，即“选项钩子” (请勿与[钩子](/guide/v10/hooks)混淆)。这些函数常用于扩展 Preact 功能和打造专门的测试工具。我们的附加组件 (如 `preact/hooks` 和 `preact/compat`) 和开发工具扩展都基于此功能。

此 API 主要为扩展 Preact 功能的工具或库作者打造。

---

<div><toc></toc></div>

---

## 版本支持

Preact 自带选项钩子，以语义版本控制。但选项钩子的弃用周期与其他库不同，所以当在改变 API 的主要版本更新时，我们不会在其发行前宣布延长公告期。这同样适用于使用选项钩子的内部 API，如 `VNode` 对象。

## 使用选项钩子

您可以通过修改 Preact 导出的 `options` 对象来设置选项钩子。

当您在写钩子函数时，请确保先调用先前存在的相同名称钩子。否则，调用链中依赖其他钩子的功能将会失效，更可能导致 `preact/hooks` 和开发工具无法正常工作。请同时务必确保您的钩子函数匹配原钩子的方法签名——除非您有特别原因需要修改。

```js
import { options } from 'preact';

// 备份原钩子函数
const oldHook = options.vnode;

// 设置您自己的钩子函数
options.vnode = vnode => {
  console.log("Hey I'm a vnode", vnode);

  // 调用备份的钩子函数 (如果有)
  if (oldHook) {
    oldHook(vnode);
  }
}
```

除了 `options.event` 之外，其他钩子均无返回值，所以您无需为大部分钩子处理返回值。

## 选项钩子列表

#### `options.vnode`

**函数签名：** `(vnode: VNode) => void`

该选项钩子会在创建 VNode 后触发。VNode 是 Preact 的中虚拟 DOM 元素节点，又名 “JSX 元素”。

#### `options.unmount`

**函数签名：** `(vnode: VNode) => void`

在虚拟 DOM 节点取消联结前，DOM 节点仍存在于树上时调用。

#### `options.diffed`

**函数签名：** `(vnode: VNode) => void`

虚拟 DOM 节点渲染后，其 DOM 表示已构建完毕或已转化为正确状态时调用。

#### `options.event`

**函数签名：** `(event: Event) => any`

虚拟 DOM 监听器处理 DOM 事件前调用。设置 `options.event` 后，事件监听函数的传入事件将替换为 `options.event` 的返回值。

#### `options.requestAnimationFrame`

**函数签名：** `(callback: () => void) => void`

用于控制效果及 `preact/hooks` 的效果功能调度。

#### `options.debounceRendering`

**函数签名：** `(callback: () => void) => void`

全局组件渲染队列中用于批量定时延后渲染更新的函数。

默认情况下，Preact 使用 `Promise.resolve()` 的微任务计时。若 Promise 不可用，则使用 `setTimeout`。

#### `options.useDebugValue`

**函数签名：** `(value: string | number) => void`

在 `preact/hooks` 的 `useDebugValue` 被调用时调用。
