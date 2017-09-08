---
name: Forms
permalink: '/guide/forms'
---

# 表单

在 Preact 中，表单元素的行为表现和他们在 React 中十分相似，除了不支持一些 "静态"（初始值）的 props/attributes。
**[React 表单文档](https://facebook.github.io/react/docs/forms.html)**


## 受控 & 不受控 组件

React 关于 [『受控』组件](https://facebook.github.io/react/docs/forms.html#controlled-components) 与 [『不受控』组件](https://facebook.github.io/react/docs/forms.html#uncontrolled-components) 的文档可以十分有效地帮助理解以下两点:
1. 如何构建具有双向数据流的 HTML 表单
2. 如何使用从基于组件化的 Virtual DOM 渲染而来的表单，当然通常 Virtual DOM 渲染是单项数据流

通常说来，任何时候你都应该尝试使用受控的组件。然而，当构建独立组件，或者包装第三方 UI 库的时候，需要在非 Preact 环境下，把你的组件仅仅用作为一个挂载点。这种情况下，不受控组件十分适合这项工作。



## 多选框 & 单选框

在构建受控表单的时候, 多选框与单选框 (`<input type="checkbox|radio">`) 刚开始会使人困惑。这是因为在不受控的环境下，我们通常允许浏览器去 "切换" 或者 "勾选" 多选框 / 单选框，我们监听事件并对新的值做出响应。但是，这种处理手法不能平滑的转移到一个世界观。在新世界观中，UI 总是会响应 state 与 props 的变化自动更新。

> ** 提示:** 通常说我们监听一个多选框的 change 事件，事件会在人为选中或者取消选中多选框的时候触发。在 change 事件处理器中，我们会把 `state` 中的某个值置为从多选框接收到的新值。这么做将会使我们的组件再次渲染，并使得多选框的值被再次置为 state 中的值。这并不必要，因为我们刚刚从 DOM 中获取了一个值，却紧接着让 DOM 根据任何我们想要的值再渲染一次。


所以我们应该监听 `click` 事件，来替代监听 `change` 事件。`click` 事件会在任何我们点击多选框或者与多选框相关联的 `<label>` 标签的时候被触发。这样多选框就会在布尔值 `true` 和 `false` 之间切换。所以点击多选框或者标签，我们就可以翻转任何我们在 state 中有的值并触发再次渲染，使得多选框显示的值为我们想要的值。

### 多选框样例

```js
class MyForm extends Component {
    toggle(e) {
        let checked = !this.state.checked;
        this.setState({ checked });
    }
    render({ }, { checked }) {
        return (
            <label>
                <input
                    type="checkbox"
                    checked={checked}
                    onClick={::this.toggle} />
            </label>
        );
    }
}
```
