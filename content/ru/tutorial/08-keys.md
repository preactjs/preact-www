---
title: Ключи
prev: /tutorial/07-side-effects
next: /tutorial/09-error-handling
solvable: true
---

# Ключи

В первой главе мы рассмотрели, как Preact использует Virtual DOM для вычисления того, что изменилось между двумя деревьями, описанными нашим JSX, а затем применяет эти изменения к HTML DOM для обновления страниц. Это хорошо работает для большинства сценариев, но иногда требуется, чтобы Preact «угадывал», как изменилась форма дерева между двумя перерисовками.

Наиболее распространённым сценарием, когда предположение Preact может отличаться от нашего замысла, является сравнение списков. Рассмотрим простой компонент списка дел:

```jsx
export default function TodoList() {
  const [todos, setTodos] = useState(['встать', 'застелить кровать']);

  function wakeUp() {
    setTodos(['застелить кровать']);
  }

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li>{todo}</li>
        ))}
      </ul>
      <button onClick={wakeUp}>Я проснулся!</button>
    </div>
  );
}
```

При первом отображении этого компонента будут отрисованы два элемента списка `<li>`. После нажатия кнопки **"Я проснулся!"** наш массив состояний `todos` обновляется и содержит только второй элемент, `"застелить кровать"`.

Вот что Preact «видит» для первого и второго рендеров:

<table><thead><tr>
  <th>Первый рендер</th>
  <th>Второй рендер</th>
</tr></thead><tbody><tr><td>

```jsx
<div>
  <ul>
    <li>встать</li>
    <li>застелить кровать</li>
  </ul>
  <button>Я проснулся!</button>
</div>
```

</td><td>

```jsx
<div>
  <ul>
    <li>застелить кровать</li>
  </ul>
  <button>Я проснулся!</button>
</div>
```

</td></tr></tbody></table>

Заметили проблему? Хотя нам ясно, что _первый_ элемент списка («встать») был удален, Preact этого не знает. Всё, что он видит, это то, что было два элемента, а теперь один. При применении этого обновления будет фактически удален второй элемент (`<li>застелить кровать</li>`), а затем обновлен текст первого элемента с `встать` на `застелить кровать`.

Результат технически правильный — один элемент с текстом «застелить кровать», но способ, которым мы пришли к этому результату, был неоптимальным. Представьте себе, что в списке 1000 элементов и мы удаляем первый элемент: вместо удаления одного `<li>`, Preact обновляет текст первых 999 других элементов и удаляет последний.

### Атрибут **key** для отображения списка

В ситуациях, подобных предыдущему примеру, элементы меняют _порядок_. Нам нужен способ помочь Preact с идентификацией элементов, чтобы он мог определять, когда каждый элемент добавляется, удаляется или заменяется. Для этого мы можем добавить атрибут `key` к каждому элементу.

Атрибут `key` является идентификатором для данного элемента. Вместо того чтобы сравнивать _порядок_ элементов двух деревьев, элементы с атрибутом `key` сравниваются путём нахождения предыдущего элемента с тем же значением `key`. `key` может быть любым типом значения, если он является «стабильным» между перерисовками: повторяющиеся рендеры одного и того же элемента должны иметь одинаковое значение атрибута `key`.

Добавим ключи к предыдущему примеру. Поскольку наш список _todo_ представляет собой простой массив строк, которые не изменяются, мы можем использовать эти строки в качестве ключей:

```jsx
export default function TodoList() {
  const [todos, setTodos] = useState(['встать', 'застелить кровать']);

  function wakeUp() {
    setTodos(['застелить кровать']);
  }

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo}>{todo}</li>
          //  ^^^^^^^^^^ добавление атрибута key
        ))}
      </ul>
      <button onClick={wakeUp}>Я проснулся!</button>
    </div>
  );
}
```

При первом отображении новой версии компонента `<TodoList>` будут отрисованы два элемента `<li>`. При нажатии кнопки «Я проснулся!» наш массив `todos` обновляется и содержит только второй элемент, `"застелить кровать"`.

Вот что видит Preact после того, как мы добавили `key` к элементам списка:

<table><thead><tr>
  <th>Первый рендер</th>
  <th>Второй рендер</th>
</tr></thead><tbody><tr><td>

```jsx
<div>
  <ul>
    <li key='встать'>встать</li>
    <li key='застелить кровать'>застелить кровать</li>
  </ul>
  <button>Я проснулся!</button>
</div>
```

</td><td>

```jsx
<div>
  <ul>
    <li key='застелить кровать'>застелить кровать</li>
  </ul>
  <button>Я проснулся!</button>
</div>
```

</td></tr></tbody></table>

На этот раз Preact видит, что первый элемент был удален, поскольку во втором дереве отсутствует элемент с `key="встать"`. При этом первый элемент будет удален, а второй останется нетронутым.

### Когда **не** использовать ключи

Одна из наиболее распространённых ошибок, с которой сталкиваются разработчики при работе с ключами, — это случайный выбор ключей, которые _нестабильны_ между перерисовками. В нашем примере в качестве значения `key` можно было бы использовать аргумент _index_ из `map()`, а не саму строку `item`:

`items.map((item, index) => <li key={index}>{item}</li>`

В результате на первом и втором рендере Preact увидит следующие деревья:

<table><thead><tr>
  <th>Первый рендер</th>
  <th>Второй рендер</th>
</tr></thead><tbody><tr><td>

```jsx
<div>
  <ul>
    <li key={0}>встать</li>
    <li key={1}>застелить кровать</li>
  </ul>
  <button>Я проснулся!</button>
</div>
```

</td><td>

```jsx
<div>
  <ul>
    <li key={0}>застелить кровать</li>
  </ul>
  <button>Я проснулся!</button>
</div>
```

</td></tr></tbody></table>

Проблема заключается в том, что `index` на самом деле определяет не _**значение**_ в нашем списке, а _**позицию**_. Рендеринг таким образом фактически _заставляет_ Preact сопоставлять элементы по порядку, что он и сделал бы, если бы не было ключей. Использование индексных ключей может даже привести к дорогостоящему или неполноценному выводу при применении к элементам списка с разным типом, поскольку ключи не могут сопоставлять элементы с разным типом.

> 🚙 **Время аналогий!** Представьте себе, что вы оставляете свой автомобиль на парковке.
>
> Когда вы возвращаетесь за своим автомобилем, вы говорите парковщику, что ездите на сером внедорожнике. К сожалению, более половины припаркованных машин — серые внедорожники, и вы оказываетесь в чужой машине. Следующий владелец серого внедорожника получает не тот автомобиль, и так далее.
>
> Если вместо этого вы скажете парковщику, что управляете серым внедорожником с номерным знаком «PR3ACT», то можете быть уверены, что вам вернут ваш собственный автомобиль.

<!--
> 🍫 **Аналогия с шоколадом:** Представьте, что друг держит в руках коробку конфет и спрашивает вас, не хотите ли вы попробовать одну из них. Вы положили глаз на мятный трюфель.
>
> Если вы ответите «четвёртая», есть риск, что шоколадки поменяли местами или пересортировали, и в итоге вы можете получить не ту шоколадку. (gasp!)
>
> Если вы ответите «мятный трюфель», то будет понятно, какой именно шоколад вы хотите попробовать, независимо от запроса.
-->

Как правило, никогда не используйте в качестве `key` индекс массива или цикла. Используйте само значение элемента списка или создайте уникальный идентификатор для элементов и используйте его:

```jsx
const todos = [
  { id: 1, text: 'встать' },
  { id: 2, text: 'make bed' },
];

export default function ToDos() {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

Помните: если вы действительно не можете найти стабильный ключ, лучше полностью опустить атрибут `key`, чем использовать индекс в качестве ключа.

## Попробуйте!

В упражнении этой главы мы объединим то, что мы узнали о ключах, с нашими знаниями о побочных эффектах из предыдущей главы.

Используйте _useEffect_ для вызова предоставленной функции `getTodos()` после первой визуализации `<TodoList>`. Обратите внимание, что эта функция возвращает _Promise_, значение которого вы можете получить, вызвав `.then(value => { })`. Получив значение Promise, сохраните его в хуке useState `todos`, вызвав связанный с ним метод `setTodos`.

Наконец, обновите JSX, чтобы каждый элемент из `todos` отображался как `<li>`, содержащий значение свойства `.text` этого элемента todo.

<solution>
  <h4>🎉 Поздравляем!</h4>
  <p>
    Вы завершили предпоследнюю главу, и научились эффективно отображать списки.
  </p>
</solution>

```js:setup
useRealm(function (realm) {
  // элемент приложения
  var out = realm.globalThis.document.body.firstElementChild;
  var options = require('preact').options;

  var oldRender = options.__r;
  var timer;
  options.__r = function(vnode) {
    timer = setTimeout(check, 10);
    if (oldRender) oldRender(vnode);
  };

  function check() {
    timer = null;
    var c = out.firstElementChild.children;
    if (
      c.length === 2 &&
      /изучить preact/i.test(c[0].textContent) &&
      /сделать крутое приложение/i.test(c[1].textContent)
    ) {
      solutionCtx.setSolved(true);
    }
  }

  return () => {
    options.__r = oldRender;
  };
});
```

```jsx:repl-initial
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const wait = ms => new Promise(r => setTimeout(r, ms))

const getTodos = async () => {
  await wait(500);
  return [
    { id: 1, text: 'изучить Preact', done: false },
    { id: 2, text: 'сделать крутое приложение', done: false },
  ]
}

function TodoList() {
  const [todos, setTodos] = useState([])

  return (
    <ul>
    </ul>
  )
}

render(<TodoList />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const wait = ms => new Promise(r => setTimeout(r, ms))

const getTodos = async () => {
  await wait(500);
  return [
    { id: 1, text: 'изучить Preact', done: false },
    { id: 2, text: 'сделать крутое приложение', done: false },
  ]
}

function TodoList() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    getTodos().then(todos => {
      setTodos(todos)
    })
  }, [])

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}
        </li>
      ))}
    </ul>
  )
}

render(<TodoList />, document.getElementById("app"));
```
