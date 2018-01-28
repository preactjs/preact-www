---
name: Differences to React
permalink: '/guide/differences-to-react'
---

# 与 React 的不同之处

Preact 本身并没有去重新实现一遍 React。它有些不同之处。大部份的不同都是很细微的，而且可以完全通过 [preact-compat] 去掉。这是一个轻量级的在 Preact 的基础上，尝试 100% 去实现 React 的接口。

Preact 没尝试去包括 React 的每一个特性，是因为它想保持 **轻量** 而 **专注** —— 否则，给 React 项目提交优化方案会更为明智，而 React 本身也已经是一个非常复杂和良好设计的代码库。


## 版本兼容
对于 Preact 和 [preact-compat]， 版本兼容通过 _current_ 和 _previous_ 主要的 React 发布去衡量。当新的特性被 React 团队公布的时候，若考虑到 [项目目标] 也非常合理，它们可能会被添加到 Preact 的核心当中。这是一个相对民主的迭代过程，持续通过公开的使用 issues 和 pull request 来进行的讨论和决策。

> 因此，当讨论兼容性和比较的时候，官网和文档会指明 React `0.14.x` 和 `15.x`。


## 被包含的特性

- [ES6 类]
    - _类提供一个丰富表现力的途径去定义具有状态的组件_
- [高阶组件]  
    - _组件在 `render()` 中返回其它组件，一个高效的封装_
- [无状态的纯函数式组件]  
    - _接收 `props` 作为参数并返回 JSX/VDOM 的函数_
- [场景]: 从 Preact [3.0] 起 支持 `context`
    - _`context` 是 React 实验性的特性，但许多库都已经采纳了_
- [Refs]: 从 Preact [4.0] 起支持 函数 refs 引用。字符串 refs 引用在 `preact-compact` 中支持
    - _Refs 提供一个办法去引用被渲染的元素和子组件_
- 虚拟 DOM 比较
    - _这是一个规定的特性 - Preact 的虚拟 DOM 比较 虽简单但高效 而且 **[特别](http://developit.github.io/js-repaint-perfs/) [快](https://localvoid.github.io/uibench/)**._
- `h()`，一个更为通用的 `React.createElement` 实现版本
    - _这是一个通常被称作 [hyperscript] 的概念，而且它的价值远比 React 的生态强, 所以 Preact 发扬了它本来的规范. ([请阅读: why `h()`?](http://jasonformat.com/wtf-is-jsx))_
    - _而且它更可读一些: `h('a', { href:'/' }, h('span', null, 'Home'))`_


## 新增特性

Preact 实际上添加了几个更为便捷的特性，灵感源于 React 的社区

- `this.props` 和 `this.state` 帮你传进了 `render()` 作为参数
    - _你仍然可以手动地去引用它们，但这个特性更为简洁，尤其是做 [赋值解构] 的时候_
- [Linked State] 当 inputs 输入框改变的时候，会自动更新状态 state
- 批量 DOM 更新，`setTimeout(1)` 进行函数节流 使用 _(也可以使用 requestAnimationFrame)_
- 你可以只用 `class` 作为 CSS 的类。 `className` 也仍然被支持， 但推荐使用 `class`
- 组件和元素循环使用 / 存入池中


## 缺少特性

- [PropType] 验证：并非所有人使用 PropTypes，所以它们并非 Preact 的核心
    - _**PropTypes ** 被 [preact-compat] 完整支持, 或者你可以手动使用它们_
- [Children]: 在 Preact 中并非必要的, 因为  `props.children` _总是一个数组_.
    - _`React.Children` is fully supported in [preact-compat]._
- Synthetic Events: Preact 的浏览器支持并不需要这个开销
    - _一个事件的完整实现意味着更多的维护和性能的考虑，以及更庞大的 API_


## 有什么区别？

Preact 和 React 还有一些细微的差别：

- `render()` 接受第三个参数，这是会被_替换_的根节点，否则，如果没有这个参数，Preact 默认追加。这个将来的版本可能会有小的调整，可能会改成默认替换。


[Project Goals]: /about/project-goals
[hyperscript]: https://github.com/dominictarr/hyperscript
[3.0]: https://github.com/developit/preact/milestones/3.0
[4.0]: https://github.com/developit/preact/milestones/4.0
[preact-compat]: https://github.com/developit/preact-compat
[PropType]: https://github.com/developit/proptypes
[Contexts]: https://facebook.github.io/react/docs/context.html
[Refs]: https://facebook.github.io/react/docs/more-about-refs.html
[Children]: https://facebook.github.io/react/docs/top-level-api.html#react.children
[ES6 Class Components]: https://facebook.github.io/react/docs/reusable-components.html#es6-classes
[High-Order Components]: https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
[Stateless Pure Functional Components]: https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
[destructuring]: http://www.2ality.com/2015/01/es6-destructuring.html
[Linked State]: /guide/linked-state
