---
title: 表单
description: 表单和表单控件允许您在应用程序中收集用户输入，是大多数Web应用程序的基础构建块。
---

# 表单

Preact中的表单与HTML和JS中的工作方式相同：您渲染控件，添加事件监听器，并提交信息。

---

<toc></toc>

---

## 基本表单控件

通常，您需要在应用程序中收集用户输入，这时`<input>`、`<textarea>`和`<select>`元素就派上用场了。这些元素是HTML和Preact中表单的常见构建块。

### 输入框（文本）

首先，我们将创建一个简单的文本输入字段，它会在用户输入时更新状态值。我们将使用`onInput`事件来监听输入字段值的变化，并在每次按键时更新状态。然后，这个状态值会被渲染在`<p>`元素中，以便我们可以看到结果。

<tab-group tabstring="Classes, Hooks">

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class BasicInput extends Component {
  state = { name: '' };

  onInput = e => this.setState({ name: e.currentTarget.value });

  render(_, { name }) {
    return (
      <div class="form-example">
        <label>
          姓名:{' '}
          <input onInput={this.onInput} />
        </label>
        <p>你好 {name}</p>
      </div>
    );
  }
}
// --repl-after
render(<BasicInput />, document.getElementById("app"));
```

```jsx
// --repl
import { render } from "preact";
import { useState } from "preact/hooks";
// --repl-before
function BasicInput() {
  const [name, setName] = useState('');

  return (
    <div class="form-example">
      <label>
        姓名:{' '}
        <input onInput={(e) => setName(e.currentTarget.value)} />
      </label>
      <p>你好 {name}</p>
    </div>
  );
}
// --repl-after
render(<BasicInput />, document.getElementById("app"));
```

</tab-group>

### 输入框（复选框和单选按钮）

<tab-group tabstring="Classes, Hooks">

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class BasicRadioButton extends Component {
  state = {
    allowContact: false,
    contactMethod: ''
  };

  toggleContact = () => this.setState({ allowContact: !this.state.allowContact });
  setRadioValue = e => this.setState({ contactMethod: e.currentTarget.value });

  render(_, { allowContact }) {
    return (
      <div class="form-example">
        <label>
          允许联系:{' '}
          <input type="checkbox" onClick={this.toggleContact} />
        </label>
        <label>
          电话:{' '}
          <input type="radio" name="contact" value="phone" onClick={this.setRadioValue} disabled={!allowContact} />
        </label>
        <label>
          电子邮件:{' '}
          <input type="radio" name="contact" value="email" onClick={this.setRadioValue} disabled={!allowContact} />
        </label>
        <label>
          邮件:{' '}
          <input type="radio" name="contact" value="mail" onClick={this.setRadioValue} disabled={!allowContact} />
        </label>
        <p>
          您{allowContact ? '已允许' : '尚未允许'}联系{allowContact && `，通过${this.state.contactMethod}`}
        </p>
      </div>
    );
  }
}
// --repl-after
render(<BasicRadioButton />, document.getElementById("app"));
```

```jsx
// --repl
import { render } from "preact";
import { useState } from "preact/hooks";
// --repl-before
function BasicRadioButton() {
  const [allowContact, setAllowContact] = useState(false);
  const [contactMethod, setContactMethod] = useState('');

  const toggleContact = () => setAllowContact(!allowContact);
  const setRadioValue = (e) => setContactMethod(e.currentTarget.value);

  return (
    <div class="form-example">
      <label>
        允许联系:{' '}
        <input type="checkbox" onClick={toggleContact} />
      </label>
      <label>
        电话:{' '}
        <input type="radio" name="contact" value="phone" onClick={setRadioValue} disabled={!allowContact} />
      </label>
      <label>
        电子邮件:{' '}
        <input type="radio" name="contact" value="email" onClick={setRadioValue} disabled={!allowContact} />
      </label>
      <label>
        邮件:{' '}
        <input type="radio" name="contact" value="mail" onClick={setRadioValue} disabled={!allowContact} />
      </label>
      <p>
        您{allowContact ? '已允许' : '尚未允许'}联系{allowContact && `，通过${contactMethod}`}
      </p>
    </div>
  );
}
// --repl-after
render(<BasicRadioButton />, document.getElementById("app"));
```

</tab-group>

### 选择框

<tab-group tabstring="Classes, Hooks">

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class MySelect extends Component {
  state = { value: '' };

  onChange = e => {
    this.setState({ value: e.currentTarget.value });
  }

  render(_, { value }) {
    return (
      <div class="form-example">
        <select onChange={this.onChange}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
        <p>您选择了: {value}</p>
      </div>
    );
  }
}
// --repl-after
render(<MySelect />, document.getElementById("app"));
```

```jsx
// --repl
import { render } from "preact";
import { useState } from "preact/hooks";
// --repl-before
function MySelect() {
  const [value, setValue] = useState('');

  return (
    <div class="form-example">
      <select onChange={(e) => setValue(e.currentTarget.value)}>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>
      <p>您选择了: {value}</p>
    </form>
  );
}
// --repl-after
render(<MySelect />, document.getElementById("app"));
```

</tab-group>

## 基本表单

虽然单独的输入控件很有用，并且可以满足很多需求，但通常我们会看到输入控件组合成可以将多个控件组合在一起的_表单_。为了帮助管理这些，我们使用`<form>`元素。

为了演示，我们将创建一个新的`<form>`元素，其中包含两个`<input>`字段：一个用于用户的名字，一个用于用户的姓氏。我们将使用`onSubmit`事件来监听表单提交并用用户的全名更新状态。

<tab-group tabstring="Classes, Hooks">

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class FullNameForm extends Component {
  state = { fullName: '' };

  onSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    this.setState({
      fullName: formData.get("firstName") + " " + formData.get("lastName")
    });
    e.currentTarget.reset(); // 清除输入框，为下一次提交做准备
  }

  render(_, { fullName }) {
    return (
      <div class="form-example">
        <form onSubmit={this.onSubmit}>
          <label>
            名字:{' '}
            <input name="firstName" />
          </label>
          <label>
            姓氏:{' '}
            <input name="lastName" />
          </label>
          <button>提交</button>
        </form>
        {fullName && <p>你好 {fullName}</p>}
      </div>
    );
  }
}
// --repl-after
render(<FullNameForm />, document.getElementById("app"));
```

```jsx
// --repl
import { render } from "preact";
import { useState } from "preact/hooks";
// --repl-before
function FullNameForm() {
  const [fullName, setFullName] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setFullName(formData.get("firstName") + " " + formData.get("lastName"));
    e.currentTarget.reset(); // 清除输入框，为下一次提交做准备
  };

  return (
    <div class="form-example">
      <form onSubmit={onSubmit}>
        <label>
          名字:{' '}
          <input name="firstName" />
        </label>
        <label>
          姓氏:{' '}
          <input name="lastName" />
        </label>
        <button>提交</button>
      </form>
      {fullName && <p>你好 {fullName}</p>}
    </div>
  );
}

// --repl-after
render(<FullNameForm />, document.getElementById("app"));
```

</tab-group>

> **注意**：虽然在React和Preact表单中常见的做法是将每个输入字段链接到组件状态，但这通常是不必要的，而且可能会变得笨重。作为一个非常宽松的经验法则，在大多数情况下，您应该优先使用`onSubmit`和[`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) API，只在需要时使用组件状态。这可以减少组件的复杂性，并可能跳过不必要的重新渲染。

## 受控组件和非受控组件

在讨论表单控件时，您可能会遇到"受控组件"和"非受控组件"这两个术语。这些术语指的是表单控件的值是否由组件显式管理。通常，您应该尽可能使用_非受控_组件，DOM完全能够处理`<input>`的状态：

```jsx
// 非受控组件，因为Preact不设置值
<input onInput={myEventHandler} />;
```

然而，在某些情况下，您可能需要对输入值进行更严格的控制，这时可以使用_受控_组件。

```jsx
// 受控组件，因为Preact设置了值
<input value={myValue} onInput={myEventHandler} />;
```

Preact在受控组件方面有一个已知问题：Preact需要重新渲染才能控制输入值。这意味着如果您的事件处理程序没有更新状态或以某种方式触发重新渲染，输入值将不受控制，有时会与组件状态不同步。

这些问题情况的一个例子是：假设您有一个应该限制为3个字符的输入字段。您可能有这样的事件处理程序：

```js
const onInput = (e) => {
  if (e.currentTarget.value.length <= 3) {
    setValue(e.currentTarget.value);
  }
}
```

这个问题在于当输入未通过该条件判断的情况：因为我们没有运行`setValue`，组件不会重新渲染，而由于组件不重新渲染，输入值就无法正确受控。然而，即使我们在处理程序中添加了`else { setValue(value) }`，Preact也足够智能，能够检测到值没有改变，因此不会重新渲染组件。这就需要我们使用[`refs`](/guide/v10/refs)来弥合DOM状态和Preact状态之间的差距。

> 有关Preact中受控组件的更多信息，请参阅Jovi De Croock的[受控输入](https://www.jovidecroock.com/blog/controlled-inputs)。

以下是如何使用受控组件来限制输入字段中字符数的示例：

<tab-group tabstring="Classes, Hooks">

```jsx
// --repl
import { render, Component, createRef } from "preact";
// --repl-before
class LimitedInput extends Component {
  state = { value: '' }
  inputRef = createRef(null)

  onInput = (e) => {
    if (e.currentTarget.value.length <= 3) {
      this.setState({ value: e.currentTarget.value });
    } else {
      const start = this.inputRef.current.selectionStart;
      const end = this.inputRef.current.selectionEnd;
      const diffLength = Math.abs(e.currentTarget.value.length - this.state.value.length);
      this.inputRef.current.value = this.state.value;
      // 恢复选择
      this.inputRef.current.setSelectionRange(start - diffLength, end - diffLength);
    }
  }

  render(_, { value }) {
    return (
      <div class="form-example">
        <label>
          此输入框限制为3个字符:{' '}
          <input ref={this.inputRef} value={value} onInput={this.onInput} />
        </label>
      </div>
    );
  }
}
// --repl-after
render(<LimitedInput />, document.getElementById("app"));
```

```jsx
// --repl
import { render } from "preact";
import { useState, useRef } from "preact/hooks";
// --repl-before
const LimitedInput = () => {
  const [value, setValue] = useState('');
  const inputRef = useRef();

  const onInput = (e) => {
    if (e.currentTarget.value.length <= 3) {
      setValue(e.currentTarget.value);
    } else {
      const start = inputRef.current.selectionStart;
      const end = inputRef.current.selectionEnd;
      const diffLength = Math.abs(e.currentTarget.value.length - value.length);
      inputRef.current.value = value;
      // 恢复选择
      inputRef.current.setSelectionRange(start - diffLength, end - diffLength);
    }
  }

  return (
    <div class="form-example">
      <label>
        此输入框限制为3个字符:{' '}
        <input ref={inputRef} value={value} onInput={onInput} />
      </label>
    </div>
  );
}
// --repl-after
render(<LimitedInput />, document.getElementById("app"));
```

</tab-group>
