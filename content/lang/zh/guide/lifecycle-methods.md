---
name: Lifecycle Methods
permalink: '/guide/lifecycle-methods'
---

# 生命周期方法

> _** 提示:** 如果你已经用过 HTML5 的自定义标签，你会发现下面的方法跟 `attachedCallback` 和 `detachedCallback` 这些生命周期方法相似._

如果你在 Component 中定义了下面的方法，Preact 将会在生命周期中触发它。

| 生命周期方法           | 触发时机                        |
|-----------------------------|--------------------------------------------------|
| `componentWillMount`        | 在 component 插入 DOM 前调用    |
| `componentDidMount`         | 在 component 插入 DOM 后调用       |
| `componentWillUnmount`      | 在 component 移除前调用                   |
| `componentDidUnmount`       | 在 component 移除后调用                          |
| `componentWillReceiveProps` | 在 component 获取新的 props 前调用                    |
| `shouldComponentUpdate`     | 在 `render()` 返回 `false` 来跳过渲染前调用 |
| `componentWillUpdate`       | 在 `render()`  调用之前                              |
| `componentDidUpdate`        | 在 `render()` 调用之后                            |
