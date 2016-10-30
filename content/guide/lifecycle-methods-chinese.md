# 生命周期方法

> _**提示:** 如果你已经用过HTML5的自定义标签，你会发现下面的方法跟 `attachedCallback` 和 `detachedCallback`这些生命周期方法相似._

如果你在Component中定义了下面的方法，Preact将会在生命周期中触发它。

| 生命周期方法           | 触发时机                        |
|-----------------------------|--------------------------------------------------|
| `componentWillMount`        | 在component插入DOM前调用    |
| `componentDidMount`         | 在component插入DOM后调用       |
| `componentWillUnmount`      | 在component移除前调用                   |
| `componentDidUnmount`       | 在component移除后调用                          |
| `componentWillReceiveProps` | 在component获取新的props前调用                    |
| `shouldComponentUpdate`     | 在`render()`返回`false`来跳过渲染前调用 |
| `componentWillUpdate`       | 在 `render()`  调用之前                              |
| `componentDidUpdate`        | 在 `render()` 调用之后                            |