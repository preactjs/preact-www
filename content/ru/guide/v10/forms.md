---
name: Формы
description: 'Как создавать потрясающие формы в Preact, которые работают где угодно.'
---

# Формы

Формы в Preact работают почти так же, как и в HTML. Вы визуализируете элемент управления и прикрепляете к нему прослушиватель событий.

Основное отличие заключается в том, что в большинстве случаев `значением` (`value`) управляет не узел DOM, а Preact.

---

<div><toc></toc></div>

---

## Контролируемые и неконтролируемые компоненты

Говоря об элементах управления формы, часто можно встретить слова «контролируемый компонент» и «неконтролируемый компонент». Описание относится к тому, как обрабатывается поток данных.

DOM имеет двунаправленный поток данных, поскольку каждый элемент управления формой будет сам управлять вводом данных пользователем. Простой текстовый ввод всегда будет обновлять свое значение, когда пользователь введет в него текст. Напротив, такая среда, как Preact, обычно имеет однонаправленный поток данных; компонент там управляет не самим значением, а чем-то другим, расположенным выше в дереве компонентов.

Как правило, вам следует стараться использовать _неконтролируемые_ компоненты, когда это возможно, DOM полностью способен обрабатывать состояние `<input>`:

```jsx
// Неконтролируемый, так как Preact не устанавливает значение
<input onInput={myEventHandler} />;
```

Однако бывают ситуации, когда вам может потребоваться более жёсткий контроль над входным значением, и в этом случае можно использовать _контролируемые_ компоненты.

Чтобы использовать контролируемые компоненты в Preact, вам нужно будет использовать [`refs`](/guide/v10/refs), чтобы преодолеть естественный разрыв между состоянием DOM и состоянием VDOM/Preact. Вот пример того, как вы можете использовать управляемый компонент для ограничения количества символов в поле ввода:

```jsx
// --repl
import { render } from "preact";
import { useState, useRef } from "preact/hooks";
// --repl-before
const Input = () => {
  const [value, setValue] = useState('')
  const inputRef = useRef()

  const onInput = (e) => {
    if (e.currentTarget.value.length <= 3) {
      setValue(e.currentTarget.value)
    } else {
      const start = inputRef.current.selectionStart
      const end = inputRef.current.selectionEnd
      const diffLength = Math.abs(e.currentTarget.value.length - value.length)
      inputRef.current.value = value
      // Восстанавливаем выделение
      inputRef.current.setSelectionRange(start - diffLength, end - diffLength)
    }
  }

  return (
  <>
    <label>Этот ввод ограничен 3 символами: </label>
    <input ref={inputRef} value={value} onInput={onInput} />
  </>
  );
}
// --repl-after
render(<Input />, document.getElementById("app"));
```

> Дополнительную информацию об управляемых компонентах в Preact см. в статье [Контролируемые элементы ввода](https://www.jovidecroock.com/blog/control-inputs) Джови Де Крука.

## Создание простой формы

Создадим простую форму для отправки элементов todo. Для этого мы создаем элемент `<form>` и привязываем обработчик событий, который будет вызываться каждый раз, когда форма будет отправлена. Аналогичным образом мы поступаем и с полем ввода текста, но обратите внимание, что мы сами храним значение в нашем классе. Вы угадали, здесь мы используем _управляемый_ вход. В данном примере это очень полезно, поскольку нам необходимо отобразить значение input в другом элементе.

```jsx
// --repl
import { render, Component } from 'preact';
// --repl-before
class TodoForm extends Component {
  state = { value: '' };

  onSubmit = (e) => {
    alert('Задача отправлена');
    e.preventDefault();
  };

  onInput = (e) => {
    this.setState({ e.currentTarget.value });
  };

  render(_, { value }) {
    return (
      <form onSubmit={this.onSubmit}>
        <input type='text' value={value} onInput={this.onInput} />
        <p>Вы ввели это значение: {value}</p>
        <button type='submit'>Отправить</button>
      </form>
    );
  }
}
// --repl-after
render(<TodoForm />, document.getElementById('app'));
```

## Элемент выбора

Элемент `<select>` немного сложнее, но работает так же, как и все остальные элементы управления формы:

```jsx
// --repl
import { render, Component } from 'preact';

// --repl-before
class MySelect extends Component {
  state = { value: '' };

  onChange = (e) => {
    this.setState({ value: e.currentTarget.value });
  };

  onSubmit = (e) => {
    alert('Отправлено ' + this.state.value);
    e.preventDefault();
  };

  render(_, { value }) {
    return (
      <form onSubmit={this.onSubmit}>
        <select value={value} onChange={this.onChange}>
          <option value='A'>A</option>
          <option value='B'>B</option>
          <option value='C'>C</option>
        </select>
        <button type='submit'>Отправить</button>
      </form>
    );
  }
}
// --repl-after
render(<MySelect />, document.getElementById('app'));
```

## Флажки и радиокнопки

Флажки и радиокнопки (`<input type="checkbox|radio">`) поначалу могут вызывать путаницу при построении управляемых форм. Это связано с тем, что в неконтролируемой среде мы обычно позволяем браузеру «переключать» или «проверять» флажок или радиокнопку, прослушивая событие изменения и реагируя на новое значение. Однако эта техника плохо переходит в картину мира, где пользовательский интерфейс всегда обновляется автоматически в ответ на изменения состояния и параметров.

> **Объяснение:** Допустим, мы прослушиваем событие `change` флажка, которое срабатывает, когда флажок устанавливается или снимается пользователем. В нашем обработчике событий изменения мы устанавливаем значение в `state`, равное новому значению, полученному от флажка. Это приведет к повторному рендерингу нашего компонента, который переназначит значение флажка значению из состояния. В этом нет необходимости, потому что мы просто запросили у DOM значение, а затем приказали ему выполнить повторную визуализацию с любым значением, которое мы хотим.

Таким образом, вместо того, чтобы прослушивать событие `input`, мы должны прослушивать событие `click`, которое запускается каждый раз, когда пользователь нажимает на флажок _или связанный с ним элемент `<label>`_. Флажки просто переключаются между логическими значениями `true` и `false`, поэтому, кликая на флажке или метке, мы просто инвертируем любое значение, которое у нас есть в состоянии, запуская повторный рендеринг и устанавливая отображаемое значение флажка на то, которое мы хотим.

### Пример флажка

```jsx
// --repl
import { render, Component } from 'preact';
// --repl-before
class MyForm extends Component {
  toggle = (e) => {
    let checked = !this.state.checked;
    this.setState({ checked });
  };

  render(_, { checked }) {
    return (
      <label>
        <input type='checkbox' checked={checked} onClick={this.toggle} />
        установите флажок
      </label>
    );
  }
}
// --repl-after
render(<MyForm />, document.getElementById('app'));
```
