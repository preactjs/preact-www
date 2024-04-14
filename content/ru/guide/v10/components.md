---
name: Компоненты
description: 'Компоненты являются сердцем любого приложения Preact. Узнайте, как их создавать и использовать для компоновки пользовательских интерфейсов'
---

# Компоненты

Компоненты представляют собой основной строительный блок в Preact. Они играют основополагающую роль в упрощении создания сложных пользовательских интерфейсов из небольших строительных блоков. Они также отвечают за прикрепление состояния к нашему визуализированному выводу.

В Preact существует два вида компонентов, о которых мы поговорим в этом руководстве.

---

<div><toc></toc></div>

---

## Функциональные компоненты

Функциональные компоненты — это обычные функции, принимающие в качестве первого аргумента `props`. Имя функции **должно** начинаться с прописной буквы, чтобы она работала в JSX.

```jsx
// --repl
import { render } from 'preact';

// --repl-before
function MyComponent(props) {
  return <div>Меня зовут {props.name}.</div>;
}

// Использование
const App = <MyComponent name='Вася' />;

// Вывод: <div>Меня зовут Вася.</div>
render(App, document.body);
```

> Обратите внимание, что в более ранних версиях они были известны как `"Компоненты без сохранения состояния"`. Это больше не относится к [хукам](/guide/v10/hooks).

## Классовые компоненты

Классовые компоненты могут иметь методы состояния и жизненного цикла. Последние представляют собой специальные методы, которые будут вызываться, например, при присоединении компонента к DOM или его уничтожении.

Например, посмотрим на компонент `<Clock>`, который отображает текущее время:

```jsx
// --repl
import { Component, render } from 'preact';

// --repl-before
class Clock extends Component {
  constructor() {
    super();
    this.state = { time: Date.now() };
  }

  // Жизненный цикл: Вызывается каждый раз, когда создается наш компонент
  componentDidMount() {
    // время обновления каждую секунду
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // Жизненный цикл: Вызывается непосредственно перед тем, как наш компонент будет уничтожен
  componentWillUnmount() {
    // остановка при отсутствии возможности рендеринга
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return <span>{time}</span>;
  }
}
// --repl-after
render(<Clock />, document.getElementById('app'));
```

### Методы жизненного цикла

Для того чтобы время на часах обновлялось каждую секунду, нам необходимо знать, когда `<Clock>` будет подключен к DOM. _Если вы использовали HTML5 Custom Elements, то это похоже на методы жизненного цикла `attachedCallback` и `detachedCallback`._ Preact вызывает следующие методы жизненного цикла, если они определены для компонента:

| Метод жизненного цикла                               | Когда его вызывают                                                                                       |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `componentWillMount()`                               | до того, как компонент будет смонтирован в DOM _(устарел)_                                               |
| `componentDidMount()`                                | после того, как компонент будет смонтирован в DOM                                                        |
| `componentWillUnmount()`                             | до удаления из DOM                                                                                       |
| `componentWillReceiveProps(nextProps, nextState)`    | до того, как будут приняты новые реквизиты _(устарел)_                                                   |
| `getDerivedStateFromProps(nextProps)`                | непосредственно перед `shouldComponentUpdate`. Используйте с осторожностью.                              |
| `shouldComponentUpdate(nextProps, nextState)`        | перед `render()`. Верните false, чтобы пропустить рендеринг                                              |
| `componentWillUpdate(nextProps, nextState)`          | bперед `render()` _(устарел)_                                                                            |
| `getSnapshotBeforeUpdate(prevProps, prevState)`      | вызывается непосредственно перед `render()`. возвращаемое значение передается в `componentDidUpdate`. |
| `componentDidUpdate(prevProps, prevState, snapshot)` | после `render()`                                                                                         |

> См. [эту диаграмму](https://twitter.com/dan_abramov/status/981712092611989509), чтобы получить визуальное представление о том, как они связаны друг с другом.

### Error Boundaries (Границы ошибок или предохранители)

Предохранитель — это компонент, реализующий либо `componentDidCatch()`, либо статический метод `getDerivedStateFromError()` (либо оба метода). Это специальные методы, позволяющие отлавливать ошибки, возникающие в процессе рендеринга, и обычно используемые для создания более красивых сообщений об ошибках или другого резервного содержимого, а также для сохранения информации в журнале. Важно отметить, что предохранители не могут перехватить все ошибки, и ошибки, возникающие в обработчиках событий или асинхронном коде (например, вызов `fetch()`), должны обрабатываться отдельно.

При обнаружении ошибки мы можем использовать эти методы для реагирования на любые ошибки и отображения красивого сообщения об ошибке или любого другого резервного контента.

```jsx
// --repl
import { Component, render } from 'preact';
// --repl-before
class ErrorBoundary extends Component {
  constructor() {
    super();
    this.state = { errored: false };
  }

  static getDerivedStateFromError(error) {
    return { errored: true };
  }

  componentDidCatch(error, errorInfo) {
    errorReportingService(error, errorInfo);
  }

  render(props, state) {
    if (state.errored) {
      return <p>Что-то пошло не так</p>;
    }
    return props.children;
  }
}
// --repl-after
render(<ErrorBoundary />, document.getElementById('app'));
```

## Фрагменты

`Fragment` позволяет возвращать сразу несколько элементов. Они решают ограничение JSX, когда каждый «блок» должен иметь один корневой элемент. Их часто можно встретить в сочетании со списками, таблицами или с CSS flexbox, где любой промежуточный элемент может повлиять на стилистику.

```jsx
// --repl
import { Fragment, render } from 'preact';

function TodoItems() {
  return (
    <Fragment>
      <li>A</li>
      <li>B</li>
      <li>C</li>
    </Fragment>
  );
}

const App = (
  <ul>
    <TodoItems />
    <li>D</li>
  </ul>
);

render(App, container);
// Вывод:
// <ul>
//   <li>A</li>
//   <li>B</li>
//   <li>C</li>
//   <li>D</li>
// </ul>
```

Заметим, что большинство современных транспиляторов позволяют использовать более короткий синтаксис для `Fragments`. Более короткий вариант встречается гораздо чаще, и именно с ним вы обычно сталкиваетесь.

```jsx
// Это:
const Foo = <Fragment>foo</Fragment>;
// ... то же самое, что и:
const Bar = <>foo</>;
```

Вы также можете возвращать массивы из своих компонентов:

```jsx
function Columns() {
  return [<td>Привет</td>, <td>мир</td>];
}
```

Не забудьте добавить ключи к `Fragments`, если вы создаете их в цикле:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map((item) => (
        // Без ключа при повторном рендеринге Preact приходится угадывать, какие элементы изменились
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```
