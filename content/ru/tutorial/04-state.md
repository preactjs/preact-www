---
title: Состояние
prev: /tutorial/03-components
next: /tutorial/05-refs
solvable: true
---

# Состояние

Теперь, когда мы знаем, как создавать HTML-элементы и компоненты, как передавать им параметры и обработчики событий с помощью JSX, пришло время научиться обновлять дерево Virtual DOM.

Как мы уже упоминали в предыдущей главе, и функциональные, и классовые компоненты могут иметь **состояние** — данные, хранимые компонентом, которые используются для изменения его дерева Virtual DOM. Когда компонент обновляет свое состояние, Preact перерисовывает этот компонент, используя обновленное значение состояния. Для функциональных компонентов это означает, что Preact повторно вызовет функцию, в то время как для классовых компонентов он повторно вызовет только метод класса `render()`. Рассмотрим пример каждого из них.

### Состояние в классовых компонентах

Классовые компоненты имеют свойство `state`, которое представляет собой объект, содержащий данные, которые компонент может использовать при вызове своего метода `render()`. Компонент может вызвать `this.setState()` для обновления своего свойства `state` и запросить повторный рендеринг в Preact.

```jsx
class MyButton extends Component {
  state = { clicked: false };

  handleClick = () => {
    this.setState({ clicked: true });
  };

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.clicked ? 'Нажата' : 'Кликов пока нет'}
      </button>
    );
  }
}
```

Нажатие на кнопку вызывает `this.setState()`, что заставляет Preact снова вызвать метод класса `render()`. Теперь, когда `this.state.clicked` имеет значение `true`, метод `render()` возвращает дерево Virtual DOM, содержащее текст «Нажата» вместо «Кликов пока нет», что заставляет Preact обновить текст кнопки в DOM.

### Состояние в функциональных компонентах с помощью хуков

Функциональные компоненты тоже могут иметь состояние! Хотя у них нет свойства `this.state`, как у классовых компонентов, в комплект поставки Preact входит небольшой дополнительный модуль, предоставляющий функции для хранения и работы с состоянием внутри компонентов функций, называемые «хуками».

Хуки — это специальные функции, которые могут быть вызваны изнутри функционального компонента. Их особенность заключается в том, что они **запоминают информацию при разных перерисовках**, подобно свойствам и методам класса. Например, хук `useState` возвращает массив, содержащий значение и «сеттер»-функцию, которая может быть вызвана для обновления этого значения. Когда компонент вызывается (перерисовывается) несколько раз, все вызовы `useState()`, которые он делает, будут возвращать каждый раз один и тот же массив.

> ℹ️ **_Как на самом деле работают хуки?_**
>
> За кулисами хук-функции, такие как `setState`, работают путём хранения данных в последовательности «слотов», связанных с каждым компонентом в дереве Virtual DOM. Вызов хук-функции занимает один слот и увеличивает внутренний «номер слота», чтобы при следующем вызове использовался следующий слот. Preact сбрасывает этот счетчик перед вызовом каждого компонента, поэтому при многократной визуализации компонента каждый вызов хука ассоциируется с одним и тем же слотом.
>
> ```js
> function User() {
>   const [name, setName] = useState('Bob'); // слот 0
>   const [age, setAge] = useState(42); // слот 1
>   const [online, setOnline] = useState(true); // слот 2
> }
> ```
>
> Это называется упорядочиванием места вызова, и именно по этой причине хуки должны всегда вызываться в одном и том же порядке внутри компонента и не могут вызываться условно или в циклах.

Рассмотрим пример использования хука `useState` в действии:

```jsx
import { useState } from 'preact/hooks';

const MyButton = () => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
  };

  return <button onClick={handleClick}>{clicked ? 'Нажата' : 'Кликов пока нет'}</button>;
};
```

Нажатие на кнопку запускает функцию `setClicked(true)`, которая обновляет поле состояния, созданное нашим вызовом `useState()`, что, в свою очередь, заставляет Preact перерисовать этот компонент. Когда компонент будет отрисован (вызван) во второй раз, значение поля состояния `clicked` будет равно `true`, а в возвращаемом Virtual DOM появится текст «Нажата» вместо «Кликов пока нет». Это приведет к тому, что Preact обновит текст кнопки в DOM.

---

## Попробуйте!

Попробуем создать счётчик, начав с кода, который мы написали в предыдущей главе. Нам необходимо хранить в _state_ число `count` и увеличивать его значение на `1` при нажатии на кнопку.

Поскольку в предыдущей главе мы использовали функциональный компонент, проще всего будет использовать хуки, хотя вы можете выбрать любой способ хранения состояния, который вам больше нравится.

<solution>
  <h4>🎉 Поздравляем!</h4>
  <p>Вы научились использовать состояние!</p>
</solution>

```js:setup
useResult(function () {
  var options = require('preact').options;

  var oe = options.event;
  options.event = function(e) {
    if (oe) oe.apply(this, arguments);

    if (e.currentTarget.localName !== 'button') return;
    var root = e.currentTarget.parentNode.parentNode;
    var text = root.innerText.match(/Счётчик:\s*([\w.-]*)/i);
    if (!text) return;
    if (!text[1].match(/^-?\d+$/)) {
      return console.warn('Подсказка: похоже, что вы нигде не выводите {count}.');
    }
    setTimeout(function() {
      var text2 = root.innerText.match(/Счётчик:\s*([\w.-]*)/i);
      if (!text2) {
        return console.warn('Подсказка: вы не забыли отобразить {count}?');
      }
      if (text2[1] == text[1]) {
        return console.warn('Подсказка: не забудьте вызвать функцию-«setter», чтобы изменить значение `count`.');
      }
      if (!text2[1].match(/^-?\d+$/)) {
        return console.warn('Подсказка: похоже, что для параметра count установлено значение, отличное от числа.');
      }

      if (Number(text2[1]) === Number(text[1]) + 1) {
        solutionCtx.setSolved(true);
      }
    }, 10);
  }

  return function () {
    options.event = oe;
  };
}, []);
```

```jsx:repl-initial
import { render } from 'preact';
import { useState } from 'preact/hooks';

function MyButton(props) {
  return <button style={props.style} onClick={props.onClick}>{props.children}</button>
}

function App() {
  const clicked = () => {
    // увеличить count на 1
  }

  return (
    <div>
      <p class="count">Счётчик:</p>
      <MyButton style={{ color: 'purple' }} onClick={clicked}>Нажми меня</MyButton>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from 'preact';
import { useState } from 'preact/hooks';

function MyButton(props) {
  return <button style={props.style} onClick={props.onClick}>{props.children}</button>
}

function App() {
  const [count, setCount] = useState(0)

  const clicked = () => {
    setCount(count + 1)
  }

  return (
    <div>
      <p class="count">Счётчик: {count}</p>
      <MyButton style={{ color: 'purple' }} onClick={clicked}>Нажми меня</MyButton>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

[ternary]: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
[lifecycle methods]: /guide/v11/components#lifecycle-methods
