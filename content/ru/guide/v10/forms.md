---
title: Формы
description: 'Формы и элементы управления формами позволяют собирать вводимые пользователем данные в вашем приложении и являются основным строительным блоком большинства веб-приложений.'
---

# Формы

Формы в Preact работают так же, как и в HTML и JavaScript: вы отображаете элементы управления, прикрепляете обработчики событий и отправляете информацию.

---

<div><toc></toc></div>

---

## Основные элементы управления формами

Часто вам потребуется собирать вводимые пользователем данные в вашем приложении, и здесь на помощь приходят элементы `<input>`, `<textarea>` и `<select>`. Эти элементы являются общими строительными блоками форм в HTML и Preact.

### Ввод (текст)

Для начала мы создадим простое текстовое поле ввода, которое будет обновлять значение состояния по мере ввода текста пользователем. Мы будем использовать событие `onInput`, чтобы отслеживать изменения значения поля ввода и обновлять состояние при каждом нажатии клавиши. Это значение состояния затем будет отображаться в элементе `<p>`, чтобы мы могли видеть результаты.

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
          Имя: {' '}
          <input onInput={this.onInput} />
        </label>
        <p>Привет, {name}</p>
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
        Имя: {' '}
        <input onInput={(e) => setName(e.currentTarget.value)} />
      </label>
      <p>Привет, {name}</p>
    </div>
  );
}
// --repl-after
render(<BasicInput />, document.getElementById("app"));
```

</tab-group>

### Ввод (флажки и переключатели)

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
          Разрешить контакт: {' '}
          <input type="checkbox" onClick={this.toggleContact} />
        </label>
        <label>
          Телефон: {' '}
          <input type="radio" name="contact" value="phone" onClick={this.setRadioValue} disabled={!allowContact} />
        </label>
        <label>
          Имейл: {' '}
          <input type="radio" name="contact" value="email" onClick={this.setRadioValue} disabled={!allowContact} />
        </label>
        <label>
          Обычная почта: {' '}
          <input type="radio" name="contact" value="mail" onClick={this.setRadioValue} disabled={!allowContact} />
        </label>
        <p>
          Вы {allowContact ? 'разрешили' : 'не разрешили'} контакт с {allowContact && ` через ${this.state.contactMethod}`}
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
        Разрешить контакт: {' '}
        <input type="checkbox" onClick={toggleContact} />
      </label>
      <label>
        Телефон: {' '}
        <input type="radio" name="contact" value="phone" onClick={setRadioValue} disabled={!allowContact} />
      </label>
      <label>
        Имейл: {' '}
        <input type="radio" name="contact" value="email" onClick={setRadioValue} disabled={!allowContact} />
      </label>
      <label>
        Обычная почта: {' '}
        <input type="radio" name="contact" value="mail" onClick={setRadioValue} disabled={!allowContact} />
      </label>
      <p>
        Вы {allowContact ? 'разрешили' : 'не разрешили'} контакт с {allowContact && ` через ${contactMethod}`}
      </p>
    </div>
  );
}
// --repl-after
render(<BasicRadioButton />, document.getElementById("app"));
```

</tab-group>

### Выбор

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
        <p>Вы выбрали: {value}</p>
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
      <p>Вы выбрали: {value}</p>
    </form>
  );
}
// --repl-after
render(<MySelect />, document.getElementById("app"));
```

</tab-group>

## Простые формы

Хотя простые поля ввода полезны и с их помощью можно добиться многого, часто мы видим, как наши поля ввода превращаются в _формы_, способные группировать несколько элементов управления вместе. Чтобы управлять этим, мы обращаемся к элементу `<form>`.

Для демонстрации создадим новый элемент `<form>`, который будет содержать два поля `<input>`: одно для имени пользователя и одно для фамилии. Мы будем использовать событие `onSubmit`, чтобы отслеживать отправку формы и обновлять состояние с полным именем пользователя.

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
    e.currentTarget.reset(); // Очищаем поля ввода, чтобы подготовиться к следующей отправке
  }

  render(_, { fullName }) {
    return (
      <div class="form-example">
        <form onSubmit={this.onSubmit}>
          <label>
            Имя: {' '}
            <input name="firstName" />
          </label>
          <label>
            Фамилия: {' '}
            <input name="lastName" />
          </label>
          <button>Отправить</button>
        </form>
        {fullName && <p>Привет, {fullName}</p>}
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
    e.currentTarget.reset(); // Очищаем поля ввода, чтобы подготовиться к следующей отправке
  };

  return (
    <div class="form-example">
      <form onSubmit={onSubmit}>
        <label>
          Имя: {' '}
          <input name="firstName" />
        </label>
        <label>
          Фамилия: {' '}
          <input name="lastName" />
        </label>
        <button>Отправить</button>
      </form>
      {fullName && <p>Привет, {fullName}</p>}
    </div>
  );
}

// --repl-after
render(<FullNameForm />, document.getElementById("app"));
```

</tab-group>

> **Примечание**: Хотя довольно часто можно встретить формы в React и Preact, которые связывают каждое поле ввода с состоянием компонента, это часто излишне и может усложнить код. В качестве очень общего правила, вы должны предпочитать использование `onSubmit` и API [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) в большинстве случаев, используя состояние компонента только тогда, когда это необходимо. Это снижает сложность ваших компонентов и может избежать ненужных повторных рендеров.

## Контролируемые и неконтролируемые компоненты

Когда речь идет об элементах управления формами, вы можете столкнуться с терминами «контролируемый компонент» и «неконтролируемый компонент». Эти термины относятся к тому, контролируется ли значение элемента управления формой явно компонентом. В общем, вы должны стараться использовать _неконтролируемые_ компоненты, когда это возможно, так как DOM полностью способен обрабатывать состояние `<input>`.

```jsx
// Неконтролируемый, потому что Preact не устанавливает значение
<input onInput={myEventHandler} />;
```

Однако есть ситуации, в которых вам может понадобиться более строгий контроль над значением ввода, в таком случае можно использовать _контролируемые_ компоненты.

```jsx
// Контролируемый, потому что Preact устанавливает значение
<input value={myValue} onInput={myEventHandler} />;
```

У Preact есть известная проблема с контролируемыми компонентами: для того чтобы Preact мог контролировать значения ввода, необходимы повторные рендеры. Это означает, что если ваш обработчик событий не обновляет состояние или не вызывает повторный рендер каким-либо образом, значение ввода не будет контролироваться и иногда может выйти из синхронизации с состоянием компонента.

Пример одной из таких проблемных ситуаций выглядит следующим образом: предположим, у вас есть поле ввода, которое должно быть ограничено 3 символами. У вас может быть обработчик событий, подобный следующему:

```js
const onInput = (e) => {
  if (e.currentTarget.value.length <= 3) {
    setValue(e.currentTarget.value);
  }
}
```

Проблема заключается в случаях, когда ввод не соответствует этому условию: поскольку мы не вызываем `setValue`, компонент не перерисовывается, и, поскольку компонент не перерисовывается, значение ввода не контролируется должным образом. Однако даже если бы мы добавили `else { setValue(value) }` в этот обработчик, Preact достаточно умён, чтобы обнаружить, когда значение не изменилось, и поэтому он не перерисует компонент. Это оставляет нам [`refs`](/guide/v10/refs) для мостика между состоянием DOM и состоянием Preact.

> Для получения дополнительной информации об управляемых компонентах в Preact смотрите статью [Controlled Inputs](https://www.jovidecroock.com/blog/controlled-inputs) от Jovi De Croock.

Вот пример того, как вы можете использовать контролируемый компонент, чтобы ограничить количество символов в поле ввода:

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
      // Восстанавливаем выделение
      this.inputRef.current.setSelectionRange(start - diffLength, end - diffLength);
    }
  }

  render(_, { value }) {
    return (
      <div class="form-example">
        <label>
          Это поле ввода ограничено 3 символами: {' '}
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
      // Восстанавливаем выделение
      inputRef.current.setSelectionRange(start - diffLength, end - diffLength);
    }
  }

  return (
    <div class="form-example">
      <label>
        Это поле ввода ограничено 3 символами: {' '}
        <input ref={inputRef} value={value} onInput={onInput} />
      </label>
    </div>
  );
}
// --repl-after
render(<LimitedInput />, document.getElementById("app"));
```

</tab-group>
