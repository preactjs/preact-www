---
name: Рендеринг на стороне сервера
description: 'Рендеринг приложения Preact на сервере позволяет быстрее показывать содержимое пользователям.'
---

# Рендеринг на стороне сервера

Server-Side Rendering (сокращённо SSR) позволяет вывести приложение в HTML-строку, которая может быть отправлена клиенту для улучшения времени загрузки. Кроме того, есть и другие сценарии, например, тестирование, где SSR оказывается действительно полезным.

> Примечание: SSR автоматически включается с помощью `preact-cli` :tada:

---

<div><toc></toc></div>

---

## Установка

Серверный рендерер для Preact находится в [собственном репозитории](https://github.com/preactjs/preact-render-to-string/) и может быть установлен с помощью выбранного вами упаковщика:

```sh
npm install -S preact-render-to-string
```

После выполнения указанной выше команды мы можем сразу же приступить к её использованию. Поверхность API довольно мала, и лучше всего её можно объяснить на примере простого фрагмента:

```jsx
import render from 'preact-render-to-string';
import { h } from 'preact';

const App = <div class='foo'>содержимое</div>;

console.log(render(App));
// <div class="foo">содержимое</div>
```

## Неглубокий рендеринг

Для некоторых целей часто предпочтительнее отображать не всё дерево, а только один его уровень. Для этого у нас есть неглубокий рендерер, который будет выводить дочерние компоненты по имени, а не по их возвращаемому значению.

```jsx
import { shallow } from 'preact-render-to-string';
import { h } from 'preact';

const Foo = () => <div>foo</div>;
const App = (
  <div class='foo'>
    <Foo />
  </div>
);

console.log(shallow(App));
// <div class="foo"><Foo /></div>
```

## Режим Pretty

Если вам нужно получить вывод в более удобном для человека виде, мы поможем вам! Передав опцию `pretty`, мы сохраним пробельные символы и отступы в выводе, как и ожидалось.

```jsx
import render from 'preact-render-to-string/jsx';
import { h } from 'preact';

const Foo = () => <div>foo</div>;
const App = (
  <div class='foo'>
    <Foo />
  </div>
);

console.log(render(App, {}, { pretty: true }));
// Лог:
// <div class="foo">
//   <div>foo</div>
// </div>
```

## Режим JSX

Режим рендеринга JSX особенно полезен, если вы занимаетесь каким-либо видом тестирования моментальных снимков. Он отображает вывод так, как если бы он был написан на JSX.

```jsx
import render from 'preact-render-to-string/jsx';
import { h } from 'preact';

const App = <div data-foo={true} />;

console.log(render(App));
// Лог: <div data-foo={true} />
```
