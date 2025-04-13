---
title: Рендеринг на стороне сервера
description: 'Рендеринг приложения Preact на сервере позволяет быстрее показывать содержимое пользователям.'
---

# Рендеринг на стороне сервера

Server-Side Rendering (сокращённо SSR) позволяет вывести приложение в HTML-строку, которая может быть отправлена клиенту для улучшения времени загрузки. Кроме того, есть и другие сценарии, например, тестирование, где SSR оказывается действительно полезным.

---

<div><toc></toc></div>

---

## Установка

Серверный рендерер для Preact находится в [собственном репозитории](https://github.com/preactjs/preact-render-to-string/) и может быть установлен с помощью выбранного вами упаковщика:

```bash
npm install -S preact-render-to-string
```

После выполнения указанной выше команды мы можем сразу же приступить к её использованию.

## Пример использования

Основную функциональность лучше всего объяснить с помощью простого фрагмента:

```jsx
import render from 'preact-render-to-string';
import { h } from 'preact';

const name = 'пользователь Preact!'
const App = <div class="foo">Привет, {name}</div>;

console.log(render(App));
// <div class="foo">Привет, пользователь Preact!</div>
```

## Асинхронный рендеринг с `Suspense` и `lazy`

Вы можете столкнуться с необходимостью визуализации динамически загружаемых компонентов, например, при использовании `Suspense` и `lazy` для облегчения разделения кода (наряду с некоторыми другими случаями использования). Асинхронный рендерер будет ожидать разрешения обещаний, позволяя вам полностью сконструировать вашу HTML-строку:

```jsx
// page/home.js
export default () => {
    return <h1>Домашняя страница</h1>;
};
```

```jsx
// main.js
import { Suspense, lazy } from 'preact/compat';

// Создание lazy-компонента
const HomePage = lazy(() => import('./pages/home'));

const Main = () => {
    return (
        <Suspense fallback={<p>Загрузка</p>}>
            <HomePage />
        </Suspense>
    );
};
```

Выше приведена очень типичная настройка для приложения Preact, использующего разделение кода, без каких-либо изменений, необходимых для использования рендеринга на стороне сервера.

Для рендеринга мы немного отклонимся от базового примера использования и воспользуемся экспортом `renderToStringAsync` для рендеринга нашего приложения:

```jsx
import { renderToStringAsync } from 'preact-render-to-string';
import { Main } from './main';

const main = async () => {
    // Отрисовка lazy-компонента
    const html = await renderToStringAsync(<Main />);

    console.log(html);
    // <h1>Домашняя страница</h1>
};

// Выполнение и обработка ошибок
main().catch((error) => {
    console.error(error);
});
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
