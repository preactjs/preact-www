---
title: 介绍 Signals
date: 2022-09-06
authors:
  - Marvin Hagemeister
  - Jason Miller
translation_by:
  - Louis Tsang (Adjusted based on ChatGPT translation)
---

# 介绍 Signals

Signals 是一种表示状态的方式，它能确保应用程序即便在复杂度提升时依然保持高性能。Signals 的设计基于响应性原则，并提供了出色的开发者体验，其独特的实现是为虚拟 DOM 优化的。

在其核心，signal 是一个带有 `.value` 属性的对象，该属性保存了某个值。在组件内部访问 signal 的 value 属性会在该 signal 的值改变时自动更新该组件。

除了直接和易写，这也确保了状态更新保持快速，无论你的应用有多少组件。Signals 默认就是快速的，自动在后台为你优化更新。

```jsx
// --repl
import { render } from "preact";
// --repl-before
import { signal, computed } from "@preact/signals";
 
const count = signal(0);
const double = computed(() => count.value * 2);
 
function Counter() {
  return (
    <button onClick={() => count.value++}>
      {count} x 2 = {double}
    </button>
  );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

与 hooks 不同，Signals 可以在组件内部或外部使用。同时，Signals 与 hooks 和 类组件一起工作得很好，所以你可以按照自己的步伐引入它们，并带着你现有的知识。在几个组件中试试看，然后逐步采用它们。

顺便说一下，我们始终秉持使库尽可能小巧的原则。在 Preact 中使用 signals 只会增加 **1.6kB** 到你的包大小。

如果你想直接深入，可以前往我们的 [文档](/guide/v10/signals) 深入了解 signals。

## Signals 解决了哪些问题？

在过去的几年里，我们在各种应用和团队上工作，范围从小型创业公司到有数百名开发者同时提交的大型企业。在此期间，核心团队的每个人都注意到了应用状态管理方式的反复出现的问题。

虽然已经创建了一些很好的解决方案来解决这些问题，但即使是最好的解决方案仍然需要手动集成到框架中。结果，我们看到开发者在采用这些解决方案时有所犹豫，他们更愿意使用框架提供的状态原语进行构建。

我们创建了 Signals，这是一个吸引人的解决方案，它将卓越性能、开发者工作效率和无缝框架集成相结合。

## 全局状态管理的困扰

应用状态通常以小而简单的方式开始，可能只有几个简单的 `useState` 钩子。随着应用的增长和更多的组件需要访问相同的状态片段，该状态最终会被提升到一个公共的祖先组件。这种模式重复多次，直到大部分状态都靠近组件树的根部。

![Image showing how the depth of the component tree directly affects rendering performance when using standard state updates.](/signals/state-updates.png)

这种情况对于传统的基于虚拟 DOM 的框架来说是一个挑战，因为它们必须更新由状态无效化影响的整个树。本质上，渲染性能是树中组件数量的函数。我们可以通过使用 `memo` 或 `useMemo` 对组件树的部分进行记忆化来解决这个问题，这样框架就会接收到相同的对象。当没有任何变化时，这让框架可以跳过渲染树的一部分。

虽然这在理论上听起来合理，但现实往往更加混乱。实际上，随着代码库的增长，确定应该在哪里放置这些优化变得困难。经常，即使是出于好意的记忆化也会被不稳定的依赖值所破坏。由于钩子没有可以分析的明确依赖树，工具无法帮助开发者诊断**_为什么依赖项不稳定。_**

## Context 混乱

团队寻求状态共享的另一个常见解决方案是将状态放入 context 中。这允许通过可能跳过对 context provider 和 consumers 之间的组件的渲染来缩短渲染时间。但是有个问题：只有传递给 context provider的值可以被更新，而且只能整体更新。更新通过 context 暴露的对象上的一个属性并不会更新该 context 的 consumers - 无法进行粒度更新。处理这个问题的可用选项是将状态分割成多个 context，或者在其任何属性更改时通过克隆它来过度使 context 对象失效。

![Context can skip updating components until you read the value out of it. Then it's back to memoization.](/signals/context-chaos.png)

把值放入 context 一开始看起来是有意义的，但是为了共享值而增加组件树大小的缺点最终会成为问题。业务逻辑不可避免地依赖于多个 context 值，这可能会强迫它在树中的特定位置实现。在树的中间添加一个订阅 context 的组件是代价高昂的，因为它减少了在更新 context 时可以跳过的组件数量。更糟糕的是，订阅者下面的任何组件现在都必须重新渲染。解决这个问题的唯一方法是大量使用 memoization，这将我们带回到 memoization 所固有的问题。

## 寻找更好的状态管理方式

我们重新审视问题，寻找下一代的状态管理机制。我们希望创造一种同时解决当前解决方案中的问题的东西。手动框架集成、过度依赖 memoization、对 context 的次优使用和缺乏程序可观察性感觉像是倒退。

开发者需要用这些策略来"选择"性能。如果我们能反过来提供一个**高性能**的系统，使得最优性能成为你必须努力才能选择不采用的选项，会怎样呢？

我们对这些问题的解答是 Signals。这是一个高性能的系统，无需在你的应用中实施 memoization 或使用任何技巧。Signals 提供了细粒度状态更新的好处，无论该状态是全局的，通过 props 或 context 传递的，还是组件的本地状态。

## Signals的未来

Signals背后的主要理念是，我们不直接通过组件树传递值，而是传递一个包含值的 signal 对象（类似于 `ref`）。当一个 signal 的值改变时，signal 本身保持不变。因此，signals 可以在不重新渲染它们已经传递过的组件的情况下更新，因为组件看到的是 signal 而不是它的值。这让我们跳过渲染组件的昂贵工作，直接跳到实际访问 signal 值的树中的特定组件。

![Signals can continue to skip Virtual DOM diffing, regardless of where in the tree they are accessed.](/signals/signals-update.png)

我们正在利用一个事实，那就是应用程序的状态图通常比其组件树要浅得多。这导致了更快的渲染，因为更新状态图所需的工作远少于更新组件树。这种差异在浏览器中测量时最为明显 - 下面的屏幕截图显示了相同应用的 DevTools Profiler 跟踪两次测量：一次使用 hooks 作为状态管理机制，第二次使用 signals：

![Showing a comparison of profiling Virtual DOM updates vs updates through signals which bypasses nearly all of the Virtual DOM diffing.](/signals/virtual-dom-vs-signals-update.png)

使用 signals 的版本在性能上远超任何传统的基于 Virtual DOM 的框架的更新机制。在我们测试的一些应用程序中，Signals 的运行速度快到在火焰图中难以找到它们。

Signals 为性能设定了新的标准：不再需要通过 memoization 或 Selector 来"选择"性能，因为它们本身就是高性能的。使用 Signals，你要做的就是选择是否需要离开这种高性能（即不使用 signals）。

为了达到这个性能级别，signals 基于以下关键原则构建：

- 默认惰性：只有当前被使用的 signals 会被观察和更新 - 未连接的 signals 不会影响性能。
- 更新优化：如果一个 signal 的值没有改变，即使 signal 的依赖项发生了变化，也不会更新使用该 signal 值的组件和效果。
- 依赖跟踪优化：框架为你跟踪所有内容依赖的 signals - 不像 hooks 那样有依赖数组。
- 直接访问：在组件中访问 signal 的值会自动订阅更新，无需 Selector 或 hooks。

这些原则使得 signals 适应广泛的应用场景，甚至包括一些与渲染用户界面无关的情况。

## 将 Signals 集成到 Preact

确定了合适的状态管理机制后，我们开始将其集成到 Preact 中。我们一直很喜欢 hooks 的一点是，它们可以直接在组件内部使用。这比第三方状态管理解决方案更具优势，这些解决方案通常依赖于“Selector”函数，或者需要通过特殊的函数来包装组件以订阅状态更新，这让 Hooks 更具优势。

```js
// 基于 Selector 的订阅 :(
function Counter() {
  const value = useSelector(state => state.count);
  // ...
}
 
// 基于包装函数的订阅 :(
const counterState = new Counter();
 
const Counter = observe(props => {
  const value = counterState.count;
  // ...
});
```

我们对这两种方法都不太满意。Selector 方法需要将所有状态访问包装在一个 Selector 中，这对于复杂或嵌套的状态来说会变得很繁琐。另一方面，需要手动使用函数包装组件的方法可能会引发一系列问题，如丢失组件名称和静态属性等。

过去几年里，我们有机会与许多开发者密切合作。一个常见的挑战，尤其是对于那些新接触(p)react的人来说，是 Selector 和包装器这类需要在掌握每种状态管理解决方案之前必须要学习的额外范例。

在理想情况下，我们无需了解 Selector 或包装函数，而是可以直接在组件内部访问状态：

```jsx
// 假设这是一些全局状态，整个应用都需要访问：
let count = 0;
 
function Counter() {
 return (
   <button onClick={() => count++}>
     value: {count}
   </button>
 );
}
```

虽然这段代码很清晰，很容易理解其运作过程，但遗憾的是，它并不起作用。当点击按钮时，组件不会更新，因为没有办法知道 `count` 已经改变。

然而，这种情况让我们无法忽视。我们能做些什么来实现这种清晰的模型呢？我们开始使用 Preact 的 [可插拔渲染器](/guide/v10/options) 原型化各种想法和实现。虽然花了一些时间，但我们最终找到了一种方法：

```jsx
// --repl
import { render } from "preact";
import { signal } from "@preact/signals";
// --repl-before
// 假设这是一些全局状态，整个应用都需要访问：
const count = signal(0);
 
function Counter() {
 return (
   <button onClick={() => count.value++}>
     Value: {count.value}
   </button>
 );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

这里没有 Selector，没有包装函数，什么都没有。只要访问 signal 的值，组件就会知道当 signal 的值改变时，它需要进行更新。在几个应用中测试原型后，我们深切感觉到我们已经找到了新的可能性。这种编码方式直观易懂，并且几乎不需要增加任何心智负担就能保持最佳的运行状态。

## 我们能更快吗？

我们本可以在此停下，并发布 signals 作为现有功能，但是我们是 Preact 团队：我们希望看到我们能把 Preact 集成推向何种程度。在上面的 Counter 示例中，`count`的值仅用于显示文本，这实际上不应该需要重新渲染整个组件。如果我们在 signal 的值改变时，并不自动重新渲染组件，而是只重新渲染文本会怎样呢？更好的是，如果我们完全绕过 Virtual DOM，直接在 DOM 中更新文本会怎样呢？

```jsx
const count = signal(0);
 
// 而不是这样：
<p>Value: {count.value}</p>
 
// … 我们可以直接将 signal 传入 JSX：
<p>Value: {count}</p>
 
// … 或者甚至将它们作为 DOM 属性传递：
<input value={count} onInput={...} />
```

是的，我们也做了这个。您可以直接将 signal 传入您通常会使用字符串的 JSX 任何地方。signal 的值将被渲染为文本，并且当 signal 改变时，它将自动更新自己。这对 props 也同样有效。

## 下一步

如果你感到好奇并想立即尝试，可以前往我们的[文档](/guide/v10/signals)查看有关 signals 的内容。我们很想听听你将如何使用它们。

请记住，无需急于切换到 signals。Hooks 将继续得到支持，并且它们与 signals 也很好地协同工作！我们建议你逐步尝试使用 signals，从几个组件开始，以熟悉这些概念。
