---
title: Рендеринг на стороне сервера
description: Рендеринг приложения Preact на сервере позволяет быстрее показывать содержимое пользователям
---

# Рендеринг на стороне сервера

Server-Side Rendering (сокращённо SSR) позволяет вывести приложение в HTML-строку, которая может быть отправлена клиенту для улучшения времени загрузки. Кроме того, есть и другие сценарии, например, тестирование, где SSR оказывается действительно полезным.

---

<toc></toc>

---

## Установка

Серверный рендерер для Preact находится в [собственном репозитории](https://github.com/preactjs/preact-render-to-string/) и может быть установлен с помощью выбранного вами упаковщика:

```bash
npm install -S preact-render-to-string
```

После выполнения указанной выше команды мы можем сразу же приступить к использованию рендерера.

## HTML-строки

Оба варианта ниже возвращают одну HTML-строку, представляющую полностью отрендеренный результат вашего приложения Preact.

### renderToString

Самый простой и прямолинейный метод рендеринга, `renderToString` преобразует дерево Preact в строку HTML синхронно.

```jsx
import { renderToString } from 'preact-render-to-string';

const name = 'пользователь Preact!'
const App = <div class="foo">Привет, {name}</div>;

const html = renderToString(App);
console.log(html);
// <div class="foo">Привет, пользователь Preact!</div>
```

### renderToStringAsync

Ожидает выполнения промисов перед возвратом полной HTML-строки. Это особенно полезно при использовании Suspense для ленивой загрузки компонентов или получения данных.

```jsx
// app.js
import { Suspense, lazy } from 'preact/compat';

const HomePage = lazy(() => import('./pages/home.js'));

function App() {
    return (
        <Suspense fallback={<p>Загрузка</p>}>
            <HomePage />
        </Suspense>
    );
}
```

```jsx
import { renderToStringAsync } from 'preact-render-to-string';
import { App } from './app.js';

const html = await renderToStringAsync(<App />);
console.log(html);
// <h1>Домашняя страница</h1>
```

## HTML-потоки

Потоковая передача — это метод рендеринга, который позволяет отправлять части вашего приложения Preact на клиент по мере их готовности, не дожидаясь завершения всего рендеринга.

### renderToPipeableStream

`renderToPipeableStream` — это потоковый метод, использующий [потоки Node.js](https://nodejs.org/api/stream.html) для рендеринга вашего приложения. Если вы не используете Node, вместо этого рассмотрите [renderToReadableStream](#rendertoreadablestream).

```jsx
import { renderToPipeableStream } from 'preact-render-to-string/stream-node';

// Синтаксис и форма обработчика запросов будут различаться в зависимости от фреймворка
function handler(req, res) {
    const { pipe, abort } = renderToPipeableStream(<App />, {
        onShellReady() {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            pipe(res);
        },
        onError(error) {
            res.statusCode = 500;
            res.send(
                `<!doctype html><p>Произошла ошибка:</p><pre>${error.message}</pre>`
            );
        }
    });

    // Переключаемся на клиентский рендеринг, если прошло достаточно времени.
    setTimeout(abort, 2000);
}
```

### renderToReadableStream

`renderToReadableStream` — это ещё один потоковый метод, похожий на `renderToPipeableStream`, но предназначенный для использования в средах, поддерживающих стандартизированные [веб-потоки](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).

```jsx
import { renderToReadableStream } from 'preact-render-to-string/stream';

// Синтаксис и форма обработчика запросов будут различаться в зависимости от фреймворка
function handler(req, res) {
    const stream = renderToReadableStream(<App />);

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/html'
        }
    });
}
```

## Настройка вывода рендера

Модуль `/jsx` предоставляет несколько опций для настройки вывода рендера для ряда популярных сценариев использования.

## Режим JSX

Режим рендеринга JSX особенно полезен, если вы занимаетесь каким-либо видом тестирования моментальных снимков. Он отображает вывод так, как если бы он был написан на JSX.

```jsx
import renderToString from 'preact-render-to-string/jsx';

const App = <div data-foo={true} />;

const html = renderToString(App, {}, { jsx: true });
console.log(html);
// <div data-foo={true} />
```

## Режим Pretty

Если вам нужно получить вывод в более удобном для человека виде, мы поможем вам! При передаче опции `pretty` мы сохраним пробельные символы и отступы в выводе, как и ожидается.

```jsx
import renderToString from 'preact-render-to-string/jsx';

const Foo = () => <div>foo</div>;
const App = (
    <div class="foo">
        <Foo />
    </div>
);

const html = renderToString(App, {}, { pretty: true });
console.log(html);
// <div class="foo">
//   <div>foo</div>
// </div>
```

### Режим Shallow

Для некоторых целей часто предпочтительнее не рендерить всё дерево, а только один уровень. Для этого у нас есть shallow-рендерер, который выводит дочерние компоненты по их именам, а не по возвращаемому значению.

```jsx
import renderToString from 'preact-render-to-string/jsx';

const Foo = () => <div>foo</div>;
const App = (
    <div class="foo">
        <Foo />
    </div>
);

const html = renderToString(App, {}, { shallow: true });
console.log(html);
// <div class="foo"><Foo /></div>
```

### Режим XML

Для элементов без потомков режим XML будет рендерить их как самозакрывающиеся теги.

```jsx
import renderToString from 'preact-render-to-string/jsx';

const Foo = () => <div></div>;
const App = (
    <div class="foo">
        <Foo />
    </div>
);

let html = renderToString(App, {}, { xml: true });
console.log(html);
// <div class="foo"><div /></div>

html = renderToString(App, {}, { xml: false });
console.log(html);
// <div class="foo"><div></div></div>
```
