---
title: Preact X，稳定性的故事
date: 2024-05-24
authors:
  - Jovi De Croock
translator:
  - SisyphusZheng
---

# Preact X，稳定性的故事

你们中的很多人一直在等待 [Preact 11](https://github.com/preactjs/preact/issues/2621)，这件事最先在 2020 年 7 月开启的 issue被提起，说实话我是最兴奋的人之一。
当我们开始考虑 Preact 11 时，我们认为在 Preact X 中引入我们想要的变更是不可能不带来破坏性变更的，我们当时考虑的一些事情包括：

- 使用支撑 VNode 结构来减少 GC，通过这样做我们只使用 `h()` 的结果来更新我们的支撑节点。
- 协调器性能，为挂载/卸载等提供优化路径
- 一些变更如移除 `px` 后缀、`forwardRef` 和停止 IE11 支持。
- 在 props 中保留 ref。
- 解决事件/子元素 diffing 的 bug。

这些是我们对 v11 的最初目标，但在走这条路的过程中，我们意识到其中许多变更实际上并不是破坏性变更，可以直接在 v10 中以非破坏性的方式发布。只有第三点，移除 `px` 后缀和直接在 props 中传递 `ref` 以及放弃 IE11，属于破坏性变更类别。我们选择在稳定的 v10 发布线中发布其他功能，这使得任何 Preact 用户都可以立即受益，而无需更改他们的代码。

与我们最初制定 v11 计划时，Preact 今天拥有更大的用户群。它在许多小到大的公司中广泛用于关键任务软件。我们真的想确保我们可能引入的任何破坏性变更都绝对值得整个生态系统迁移到它的成本。

当我们进行[实验](https://github.com/preactjs/preact/tree/v11)时，我们尝试了一种新的 diffing 类型，名为
[基于倾斜的 diffing](https://github.com/preactjs/preact/pull/3388)，我们看到了真正的性能
改进，并且它修复了一堆长期存在的 bug。随着时间的推移，我们在 Preact 11 的这些实验上投入了更多时间，我们开始注意到我们实现的改进不需要是 Preact 11 独有的。

## 版本发布

自从上述 Preact 11 issue 以来，Preact X 已经有了 18 个(!!) 次要版本。
其中许多都直接受到 Preact 11 工作的启发。让我们回顾一些并看看影响。

### 10.5.0

[恢复水合](https://github.com/preactjs/preact/pull/2754)的引入 -- 这个功能基本上允许在组件树的重新水合期间暂停。这意味着例如在以下组件树中，我们将重新水合并使 `Header` 可交互，而 `LazyArticleHeader` 暂停，与此同时服务器渲染的 DOM 将保留在屏幕上。当懒加载完成时，我们将继续重新水合，我们的 `Header` 和 `LazyArticleHeader` 可以交互，而我们的 `LazyContents` 解析。这是一个非常强大的功能，可以使您最重要的内容可交互，同时不会过载初始包的包大小/下载大小。

```jsx
const App = () => {
  return (
    <>
      <Header>
      <main>
        <Suspense>
          <LazyArticleHeader />
          <Suspense>
            <article>
              <LazyContents />
            </article>
          </Suspense>
        </Suspense>
      </main>
    </>
  )
}
```

### 10.8.0

在 10.8.0 中我们引入了 [状态稳定](https://github.com/preactjs/preact/pull/3553)，这确保了如果组件在渲染期间更新 hook 状态，我们会捕获到这一点，取消之前的 effects 并继续渲染。当然我们必须确保这不会循环，但这个功能减少了因渲染中状态调用而排队的渲染数量，这个功能还增加了我们与 React 生态系统的兼容性，因为许多库依赖于由于渲染中状态更新而不会多次调用 effects。

### 10.11.0

经过大量研究，我们找到了一种将 [useId](https://github.com/preactjs/preact/pull/3583) 引入 Preact 的方法，这需要大量研究如何为给定的树结构添加唯一值。我们的一位维护者写了关于[我们当时的研究](https://www.jovidecroock.com/blog/preact-use-id)，我们从那时起一直在迭代它，试图使其尽可能地避免冲突...

### 10.15.0

我们发现，通过重新渲染导致多个新组件重新渲染可能会导致我们的 `rerenderQueue` 乱序，这可能导致我们的（上下文）更新传播到随后会再次使用过时值渲染的组件，您可以查看[the commit message](https://github.com/preactjs/preact/commit/672782adbf9ccefa7a4d7c175f0adf8580f73c92)获得非常详细的解释！这样做既批量处理了这些更新，也增加了我们与 React 库的对齐。

### 10.16.0

在我们对 v11 的研究中，我们深入研究了子元素 diffing，因为我们意识到有一些情况下我们当前的算法会不足，仅列出其中几个问题：

- [在另一个元素之前移除元素会导致重新插入](https://github.com/preactjs/preact/issues/3973)
- [移除超过 1 个子元素时的重新插入](https://github.com/preactjs/preact/issues/2622)
- [keyed 节点的不必要卸载](https://github.com/preactjs/preact/issues/2783)

并非所有这些都导致了坏状态，有些只是意味着性能下降... 当我们发现可以将基于倾斜的 diffing 移植到 Preact X 时，我们非常兴奋，我们不仅会修复很多情况，还可以看到这个算法在野外的表现！回顾起来，它表现得很好，有时我希望我们首先有好的测试平台来运行这些，而不是我们的社区必须报告问题。我确实想借此机会感谢你们所有人，总是通过提供重现的周到 issues 来帮助我们，你们都是最棒的！

### 10.19.0

在 10.19.0 中，Marvin 将他从 [fresh](https://fresh.deno.dev/) 的研究应用到添加[预编译 JSX 函数](https://github.com/preactjs/preact/pull/4177)，这基本上允许您在转译期间预编译组件，当运行 render-to-string 时，我们只需要连接字符串而不是为整个 VNode 树分配内存。这个转换目前只在 Deno 中可用，但一般概念在 Preact 中存在！

### 10.20.2

我们面临了许多问题，其中事件可能冒泡到新插入的 VNode，这会导致不希望的行为，这通过[添加事件时钟](https://github.com/preactjs/preact/pull/4322)得到了修复。在以下场景中，您会点击设置状态的按钮，浏览器将事件冒泡与微任务交错，这也是 Preact 用来调度更新的。这种组合意味着 Preact 将更新 UI，意味着 `<div>` 将获得那个 `onClick` 处理程序，我们将冒泡到并再次调用 `click`，立即再次切换这个状态。

```jsx
const App = () => {
  const [toggled, setToggled] = useState(false);

  return toggled ? (
    <div onClick={() => setToggled(false)}>
      <span>clear</span>
    </div> 
  ) : (
    <div>
      <button
        onClick={() => setToggled(true)}
      >toggle on</button>
    </div>
  )
}
```

## 稳定性

以上是我们社区在没有破坏性变更的情况下收到的一些精选版本，但还有更多... 添加新的主要版本总是会让一部分社区落后，我们不想这样做。如果我们看看 Preact 8 发布线，我们可以看到在过去一周仍有 100,000 次下载，最后一个 8.x 版本是 5 年前发布的，这说明一部分社区会被抛在后面。

稳定性很好，作为 Preact 团队我们热爱稳定性。我们实际上在其他生态系统项目上发布了多个主要功能：

- [Signals](https://github.com/preactjs/signals)
- [异步渲染](https://github.com/preactjs/preact-render-to-string/pull/333)
- [流式渲染](https://github.com/preactjs/preact-render-to-string/pull/354)
- [Prefresh](https://github.com/preactjs/prefresh)
- [带预渲染的 vite 预设](https://github.com/preactjs/preset-vite#prerendering-configuration)
- [新的异步路由器](https://github.com/preactjs/preact-iso)
- [Create Preact](https://github.com/preactjs/create-preact)

我们重视我们的生态系统，我们重视通过我们的 [`options API`](https://marvinh.dev/blog/preact-options/) 构建的扩展，这是我们不想引入这些破坏性变更的主要驱动因素之一，而是允许你们所有人从我们的研究中受益，而无需痛苦的迁移路径。

这并不意味着 Preact 11 不会发生，但它可能不是我们最初认为的那样。相反，我们可能只是放弃 IE11 支持并为您提供这些性能改进，同时为您提供 Preact X 的稳定性。还有很多想法在浮现，我们对在提供开箱即用路由等功能的元框架背景下的更广泛 Preact 体验非常感兴趣。我们正在 vite 预设以及 [Fresh](https://fresh.deno.dev/) 中探索这个角度，以很好地感受 Preact 优先的元框架应该是什么样子。
