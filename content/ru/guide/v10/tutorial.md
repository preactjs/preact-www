---
name: Краткое руководство
description: 'Напишите свое первое приложение Preact'
---

# Руководство

В этом руководстве описывается создание простого компонента «тикающих часов». Если вы новичок в Virtual DOM, попробуйте [наш учебник по Preact](/tutorial).

> :information_desk_person: В этом руководстве предполагается, что вы завершили работу с документом [Начало работы](/guide/v10/getting-started) и успешно настроили свои инструменты. Если нет, начните с [preact-cli](/guide/v10/getting-started#best-practices-powered-with-preact-cli).

---

<div><toc></toc></div>

---

## Привет, мир

В любой кодовой базе Preact вы всегда встретите две функции `h()` и `render()`. Функция `h()` используется для преобразования JSX в структуру, которую понимает Preact. Но его также можно использовать напрямую, без использования JSX:

```jsx
// С JSX
const App = <h1>Привет, мир!</h1>;

// ...то же самое без JSX
const App = h('h1', null, 'Привет, мир');
```

Это само по себе ничего не дает, и нам нужен способ внедрить наше приложение _Hello-World_ в DOM. Для этого мы используем функцию `render()`.

```jsx
// --repl
import { render } from 'preact';

const App = <h1>Привет, мир!</h1>;

// Внедряем наше приложение в DOM
render(App, document.getElementById('app'));
```

Поздравляем, вы создали свое первое приложение Preact!

## Интерактивный «Привет, мир»

Рендеринг текста — это только начало, но мы хотим сделать наше приложение немного более интерактивным. Мы хотим обновлять его при изменении данных. :star2:

Наша конечная цель — создать приложение, в котором пользователь сможет ввести имя и отобразить его при отправке формы. Для этого нам нужно что-то, где мы можем хранить то, что мы отправили. Именно здесь в игру вступают [Компоненты](/guide/v10/comComponents).

Итак, давайте преобразуем наше существующее приложение с помощью [Компонентов](/guide/v10/comComponents):

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  render() {
    return <h1>Привет, мир!</h1>;
  }
}

render(<App />, document.getElementById('app'));
```

Вы заметите, что мы добавили новый импорт `Component` вверху и превратили `App` в класс. Само по себе это бесполезно, но это предвестник того, что мы собираемся делать дальше. Чтобы сделать процесс немного интереснее, мы добавим форму с текстовым вводом и кнопкой отправки.

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Привет, мир!</h1>
        <form>
          <input type='text' />
          <button type='submit'>Обновить</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
```

Уже почти! Оно начинает выглядеть как настоящее приложение! Однако нам всё ещё нужно сделать его интерактивным. Помните, что мы хотим изменить `"Привет, мир!"` на `"Привет, [userinput]!"`, поэтому нам нужен способ узнать текущее входное значение.

Мы сохраним его в специальном свойстве под названием `state` нашего компонента. Оно особенное, потому что при обновлении с помощью метода `setState` Preact не просто обновляет состояние, но и планирует запрос на рендеринг для этого компонента. Как только запрос будет обработан, наш компонент будет повторно отображён с обновлённым состоянием.

Наконец, нам нужно прикрепить новое состояние к нашему входу, установив `value` и прикрепив обработчик события к событию `input`.

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  // Инициализируем наше состояние. На данный момент мы сохраняем только входное значение
  state = { value: '' };

  onInput = (ev) => {
    // Это запланирует обновление состояния. После обновления компонент автоматически перерисовывается
    this.setState({ value: ev.target.value });
  };

  render() {
    return (
      <div>
        <h1>Привет, мир!</h1>
        <form>
          <input type='text' value={this.state.value} onInput={this.onInput} />
          <button type='submit'>Обновить</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
```

На данный момент приложение не должно сильно измениться с точки зрения пользователей, но на следующем этапе мы соберем все части воедино.

Мы добавим обработчик к событию `submit` нашей `<form>` аналогично тому, как мы только что сделали для ввода. Разница в том, что он записывается в другое свойство нашего `state`, называемое `name`. Затем мы меняем заголовок и вставляем туда значение `state.name`.

```jsx
// --repl
import { h, render, Component } from 'preact';

class App extends Component {
  // Задаем исходное состояние для `name`
  state = { value: '', name: 'мир' };

  onInput = (ev) => {
    this.setState({ value: ev.target.value });
  };

  // Добавляем обработчик отправки, который обновляет `name` последним входным значением.
  onSubmit = (ev) => {
    // Запрещаем поведение браузера по умолчанию (то есть не отправляем форму при нажатии кнопки)
    ev.preventDefault();

    this.setState({ name: this.state.value });
  };

  render() {
    return (
      <div>
        <h1>Привет, {this.state.name}!</h1>
        <form onSubmit={this.onSubmit}>
          <input type='text' value={this.state.value} onInput={this.onInput} />
          <button type='submit'>Обновить</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
```

Бум! Всё готово! Теперь мы можем ввести собственное имя, нажать «Обновить», и наше новое имя появится в заголовке.

## Компонент `Clock`

Мы написали наш первый компонент, так что давайте ещё немного попрактикуемся. На этот раз мы построим часы.

```jsx
// --repl
import { h, render, Component } from 'preact';

class Clock extends Component {
  render() {
    let time = new Date().toLocaleTimeString();
    return <span>{time}</span>;
  }
}

render(<Clock />, document.getElementById('app'));
```

Хорошо, это было достаточно легко! Проблема в том, что время не меняется. Оно зависает в тот момент, когда мы визуализируем наш компонент часов.

Итак, мы хотим, чтобы таймер запускался после добавления компонента в DOM и останавливался при удалении компонента. Мы создадим таймер и сохраним ссылку на него в `componentDidMount`, а остановим таймер в `componentWillUnmount`. При каждом тике таймера мы обновляем объект `state` компонента новым значением времени. Это приведет к автоматическому повторному рендерингу компонента.

```jsx
// --repl
import { h, render, Component } from 'preact';

class Clock extends Component {
  state = { time: Date.now() };

  // Вызывается всякий раз, когда создается наш компонент
  componentDidMount() {
    // обновляем `time` каждую секунду
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // Вызывается непосредственно перед тем, как наш компонент будет уничтожен.
  componentWillUnmount() {
    // останавливаем, когда невозможно визуализировать
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return <span>{time}</span>;
  }
}

render(<Clock />, document.getElementById('app'));
```

И мы сделали это снова! Теперь у нас есть [тикающие часы](http://jsfiddle.net/developit/u9m5x0L7/embedded/result,js/)!
