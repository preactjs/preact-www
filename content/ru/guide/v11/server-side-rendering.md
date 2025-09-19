---
title: Серверный рендеринг
description: Рендерьте ваше приложение Preact на сервере, чтобы показывать контент пользователям быстрее
---

# Серверный рендеринг

Серверный рендеринг (часто сокращаемый как «SSR») позволяет вам рендерить ваше приложение в HTML-строку, которая может быть отправлена клиенту для улучшения времени загрузки. Помимо этого, есть другие сценарии, такие как тестирование, где SSR оказывается действительно полезным.

---

<toc></toc>

---

## Установка

Серверный рендерер для Preact живет в своем [собственном репозитории](https://github.com/preactjs/preact-render-to-string/) и может быть установлен через ваш менеджер пакетов:

```bash
npm install -S preact-render-to-string
```

После завершения команды выше, мы можем сразу начать его использовать.

## HTML-строки

Оба следующих варианта возвращают единственную HTML-строку, которая представляет полный отрендеренный вывод вашего приложения Preact.

### renderToString

Самый базовый и прямолинейный метод рендеринга, `renderToString` синхронно преобразует дерево Preact в строку HTML.

```jsx
import { renderToString } from 'preact-render-to-string';

const name = 'пользователь Preact!';
const App = <div class="foo">Привет, {name}</div>;

const html = renderToString(App);
console.log(html);
// <div class="foo">Привет, пользователь Preact!</div>
```

### renderToStringAsync

Ожидает разрешения промисов перед возвратом полной HTML-строки. Это особенно полезно при использовании ожидания для лениво загружаемых компонентов или получения данных.

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
// <h1>Главная страница</h1>
```

## HTML-потоки

Потоковый рендеринг — это метод рендеринга, который позволяет вам отправлять части вашего приложения Preact клиенту по мере готовности, а не ждать завершения всего рендеринга.

### renderToPipeableStream

`renderToPipeableStream` — это потоковый метод, который использует [потоки Node.js](https://nodejs.org/api/stream.html) для рендеринга вашего приложения. Если вы не используете Node, вам следует вместо этого обратиться к [renderToReadableStream](#rendertoreadablestream).

```jsx
import { renderToPipeableStream } from 'preact-render-to-string/stream-node';

// Синтаксис и форма обработчика запроса будет варьироваться между фреймворками
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

	// Отказаться и переключиться на клиентский рендеринг, если пройдет достаточно времени.
	setTimeout(abort, 2000);
}
```

### renderToReadableStream

`renderToReadableStream` — ещё один потоковый метод, похожий на `renderToPipeableStream`, но разработанный для использования в средах, поддерживающих стандартизированные [веб-потоки](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).

```jsx
import { renderToReadableStream } from 'preact-render-to-string/stream';

// Синтаксис и форма обработчика запроса будет варьироваться между фреймворками
function handler(req, res) {
	const stream = renderToReadableStream(<App />);

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/html'
		}
	});
}
```

## Настройка вывода рендерера

Мы предлагаем ряд опций через модуль `/jsx` для настройки вывода рендерера для нескольких популярных случаев использования.

### Режим JSX

Режим рендеринга JSX особенно полезен, если вы занимаетесь каким-либо snapshot-тестированием. Он рендерит вывод так, будто он был написан в JSX.

```jsx
import renderToString from 'preact-render-to-string/jsx';

const App = <div data-foo={true} />;

const html = renderToString(App, {}, { jsx: true });
console.log(html);
// <div data-foo={true} />
```

### Красивый режим

Если вам нужно получить отрендеренный вывод в более понятном для человека виде, у нас есть решение! Передавая опцию `pretty`, мы сохраним пробелы и отступим вывод как ожидается.

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

### Поверхностный режим

Для некоторых целей часто предпочтительно не рендерить всё дерево, а только один уровень. Для этого у нас есть поверхностный рендерер, который напечатает дочерние компоненты по имени, вместо их возвращаемого значения.

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
