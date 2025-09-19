---
title: preact-iso
description: preact-iso — это коллекция изоморфных асинхронных инструментов для Preact
---

# preact-iso

preact-iso — это коллекция изоморфных асинхронных инструментов для Preact.

«Изоморфный» описывает код, который может работать (в идеале бесшовно) как в браузере, так и на сервере. `preact-iso` создан для поддержки этих сред, позволяя пользователям создавать приложения без создания отдельных роутеров для браузера и сервера или беспокоиться о различиях в данных или загрузке компонентов. Тот же код приложения может использоваться в браузере и на сервере во время предварительного рендеринга, никаких изменений не требуется.

> **Примечание:** Хотя это библиотека роутинга от команды Preact, многие другие роутеры доступны в более широкой экосистеме Preact/React, которые вы можете предпочесть использовать вместо неё, включая [wouter](https://github.com/molefrog/wouter) и [react-router](https://reactrouter.com/). Это отличный первый вариант, но вы можете перенести свой любимый роутер в Preact, если предпочитаете.

---

<toc></toc>

---

## Роутинг

`preact-iso` предоставляет простой маршрутизатор для Preact с традиционными и основанными на хуках API. Компонент `<Router>` поддерживает асинхронность: при переходе с одного маршрута на другой, если входящий маршрут приостанавливается (выбрасывает промис), исходящий маршрут сохраняется до тех пор, пока новый не будет готов.

```jsx
import {
	lazy,
	LocationProvider,
	ErrorBoundary,
	Router,
	Route
} from 'preact-iso';

// Синхронный
import Home from './routes/home.js';

// Асинхронный (бросает promise)
const Profiles = lazy(() => import('./routes/profiles.js'));
const Profile = lazy(() => import('./routes/profile.js'));
const NotFound = lazy(() => import('./routes/_404.js'));

function App() {
	return (
		<LocationProvider>
			<ErrorBoundary>
				<Router>
					<Home path="/" />
					{/* Альтернативный выделенный компонент маршрута для лучшей поддержки TS */}
					<Route path="/profiles" component={Profiles} />
					<Route path="/profile/:id" component={Profile} />
					{/* проп `default` указывает на резервный маршрут. Полезно для 404 страниц */}
					<NotFound default />
				</Router>
			</ErrorBoundary>
		</LocationProvider>
	);
}
```

**Прогрессивная гидратация:** При гидратации приложения на клиенте маршрут (например, `Home` или `Profile`) приостанавливает выполнение. Это откладывает гидратацию соответствующей части страницы до тех пор, пока не будет разрешен `import()` для этого маршрута, после чего гидратация автоматически завершается.

**Бесшовная маршрутизация:** При переключении между маршрутами на клиенте роутер учитывает асинхронные зависимости. Вместо очистки текущего маршрута и отображения индикатора загрузки, роутер сохраняет текущий маршрут до завершения загрузки нового, после чего производит их замену.

## Предварительный рендеринг

`prerender()` рендерит дерево Virtual DOM в строку HTML с использованием [`preact-render-to-string`](https://github.com/preactjs/preact-render-to-string). Promise, возвращённый из `prerender()`, разрешается в объект с `html` и `links[]` свойствами. Свойство `html` содержит вашу предварительно отрендеренную статическую HTML разметку, а `links` — массив любых не-external URL строк, найденных в ссылках на сгенерированной странице.

В основном предназначено для использования с предварительным рендерингом через [`@preact/preset-vite`](https://github.com/preactjs/preset-vite#prerendering-configuration) или другие системы предварительного рендеринга, которые разделяют API. Если вы рендерите своё приложение на стороне сервера каким-либо другим методом, вы можете использовать `preact-render-to-string` (в частности `renderToStringAsync()`) напрямую.

```jsx
import {
	LocationProvider,
	ErrorBoundary,
	Router,
	lazy,
	prerender as ssr
} from 'preact-iso';

// Асинхронный (бросает promise)
const Foo = lazy(() => import('./foo.js'));

function App() {
	return (
		<LocationProvider>
			<ErrorBoundary>
				<Router>
					<Foo path="/" />
				</Router>
			</ErrorBoundary>
		</LocationProvider>
	);
}

hydrate(<App />);

export async function prerender(data) {
	return await ssr(<App />);
}
```

## Вложенный роутинг

Некоторые приложения выиграют от роутеров с множественными уровнями, позволяющими разбивать логику роутинга на меньшие компоненты. Это особенно полезно для больших приложений, и мы решаем это путём разрешения множественных вложенных `<Router>` компонентов.

Частично соответствующие маршруты заканчиваются подстановочным знаком (`/*`), и только оставшееся значение передаётся дочерним маршрутизаторам для дальнейшего соответствия. Это позволяет создавать родительский маршрут, который соответствует базовому пути, а затем иметь дочерние маршруты, которые соответствуют конкретным подпути.

```jsx
import {
	lazy,
	LocationProvider,
	ErrorBoundary,
	Router,
	Route
} from 'preact-iso';

import AllMovies from './routes/movies/all.js';

const NotFound = lazy(() => import('./routes/_404.js'));

function App() {
	return (
		<LocationProvider>
			<ErrorBoundary>
				<Router>
					<Router path="/movies" component={AllMovies} />
					<Route path="/movies/*" component={Movies} />
					<NotFound default />
				</Router>
			</ErrorBoundary>
		</LocationProvider>
	);
}

const TrendingMovies = lazy(() => import('./routes/movies/trending.js'));
const SearchMovies = lazy(() => import('./routes/movies/search.js'));
const MovieDetails = lazy(() => import('./routes/movies/details.js'));

function Movies() {
	return (
		<ErrorBoundary>
			<Router>
				<Route path="/trending" component={TrendingMovies} />
				<Route path="/search" component={SearchMovies} />
				<Route path="/:id" component={MovieDetails} />
			</Router>
		</ErrorBoundary>
	);
}
```

Компонент `<Movies>` будет использован для следующих маршрутов:

- `/movies/trending`
- `/movies/search`
- `/movies/Inception`
- `/movies/...`

Он не будет использован для любого из следующих:

- `/movies`
- `/movies/`

## Не-JS серверы

Для тех, кто использует не-JS серверы (например, PHP, Python, Ruby и т. д.) для обслуживания своего Preact приложения, вы можете использовать нашу ["polyglot-utils"](https://github.com/preactjs/preact-iso/tree/main/polyglot-utils), коллекцию нашей логики сопоставления маршрутов, портированную на различные другие языки. Совмещённая с маршрутом manifest, это позволит вашему серверу лучше понимать, какие ресурсы будут нужны во время выполнения для данного URL, позволяя вам сказать вставить preload теги для тех ресурсов в `<head>` HTML перед обслуживанием страницы.

---

## Документация API

### LocationProvider

Провайдер контекста, который предоставляет текущее местоположение своим потомкам. Это требуется для функционирования роутера.

Props:

- `scope?: string | RegExp` — Устанавливает scope для путей, которые роутер будет обрабатывать (intercept). Если путь не совпадает со scope, либо начиная со предоставленной строки или совпадая с RegExp, роутер будет игнорировать его и будет применяться навигация браузера по умолчанию.

Обычно, вы бы обернули всё своё приложение в этого провайдера:

```jsx
import { LocationProvider } from 'preact-iso';

function App() {
	return (
		<LocationProvider scope="/app">{/* Ваше приложение здесь */}</LocationProvider>
	);
}
```

### Router

Пропсы:

- `onRouteChange?: (url: string) => void` - Колбек, вызываемый при изменении маршрута.
- `onLoadStart?: (url: string) => void` - Колбек, вызываемый при начале загрузки маршрута (т. е., если он в ожидании). Это не будет вызвано перед навигациями к синхронизированным маршрутам или последующими навигациями к async маршрутам.
- `onLoadEnd?: (url: string) => void` - Колбек, вызываемый после завершения загрузки маршрута (т. е., если он в ожидании). Это не будет вызвано после навигаций к синхронизированным маршрутам или последующими навигациями к async маршрутам.

```jsx
import { LocationProvider, Router } from 'preact-iso';

function App() {
	return (
		<LocationProvider>
			<Router
				onRouteChange={url => console.log('Роут изменён на', url)}
				onLoadStart={url => console.log('Начата загрузка', url)}
				onLoadEnd={url => console.log('Завершена загрузка', url)}
			>
				<Home path="/" />
				<Profiles path="/profiles" />
				<Profile path="/profile/:id" />
			</Router>
		</LocationProvider>
	);
}
```

### Route

Есть два способа определения маршрутов с использованием `preact-iso`:

1. Добавить параметры маршрута к компонентам маршрута напрямую: `<Home path="/" />`
2. Использовать компонент `Route` вместо этого: `<Route path="/" component={Home} />`

Добавление произвольных пропсов к компонентам не является чем-то необычным в JavaScript, поскольку JS — это динамический язык, который прекрасно поддерживает динамические и произвольные интерфейсы. Однако TypeScript, который многие из нас используют даже при написании JS (через языковой сервер TS), не особо приветствует такой подход к проектированию интерфейсов.

TypeScript (пока) не позволяет переопределять пропсы дочернего компонента из родительского, поэтому мы не можем, например, определить `<Home>` как компонент, не принимающий пропсы, _если только_ он не является дочерним для `<Router>`, в этом случае он может иметь проп `path`. Это создаёт определённую дилемму: либо мы определяем все наши маршруты как принимающие проп `path`, чтобы не видеть ошибок TS при написании `<Home path="/" />`, либо мы создаём компоненты-обёртки для обработки определений маршрутов.

Хотя `<Home path="/" />` полностью эквивалентно `<Route path="/" component={Home} />`, пользователи TypeScript могут предпочесть последнее.

```jsx
import { LocationProvider, Router, Route } from 'preact-iso';

function App() {
	return (
		<LocationProvider>
			<Router>
				{/* Оба эти эквивалентны */}
				<Home path="/" />
				<Route path="/" component={Home} />

				<Profiles path="/profiles" />
				<Profile path="/profile/:id" />
				<NotFound default />
			</Router>
		</LocationProvider>
	);
}
```

Пропсы для любого компонента маршрута:

- `path: string` - Путь для совпадения (читайте далее)
- `default?: boolean` - Если установлено, этот маршрут является маршрутом по умолчанию, используемым когда нет других совпадений

Специфично для компонента `Route`:

- `component: AnyComponent` - Компонент для рендеринга при совпадении маршрута

#### Сопоставление сегментов пути

Пути сопоставляются с помощью простого алгоритма сравнения строк. Доступны следующие возможности:

- `:param` - Совпадает с любым URL сегментом, привязывая значение к label (может быть извлечено позже из `useRoute()`)
  - `/profile/:id` будет совпадать с `/profile/123` и `/profile/abc`
  - `/profile/:id?` будет совпадать с `/profile` и `/profile/123`
  - `/profile/:id*` будет совпадать с `/profile`, `/profile/123`, и `/profile/123/abc`
  - `/profile/:id+` будет совпадать с `/profile/123`, `/profile/123/abc`
- `*` - Совпадает с одним или более URL сегментами
  - `/profile/*` будет совпадать с `/profile/123`, `/profile/123/abc`, etc.

Это может быть скомбинировано для создания более сложных маршрутов:

- `/profile/:id/*` будет совпадать с `/profile/123/abc`, `/profile/123/abc/def`, etc.

Разница между `/:id*` и `/:id/*` в том, что в первом `id` param будет включать весь путь после него, в то время как во втором `id` является только single path segment.

- `/profile/:id*`, с `/profile/123/abc`
  - `id` is `123/abc`
- `/profile/:id/*`, с `/profile/123/abc`
  - `id` is `123`

### useLocation()

Хук для работы с `LocationProvider`, предоставляющий доступ к контексту местоположения.

Возвращает объект со следующими свойствами:

- `url: string` - Текущий путь и параметры поиска
- `path: string` - Текущий путь
- `query: Record<string, string>` - Параметры строки запроса (`/profile?name=John` -> `{ name: 'John' }`)
- `route: (url: string, replace?: boolean) => void` - Функция для программной навигации на новый маршрут. Параметр `replace` может быть использован для перезаписи истории, осуществляя переход без сохранения текущего местоположения в стеке истории.

### useRoute()

Хук для доступа к информации текущего маршрута. В отличие от `useLocation`, этот хук работает только внутри `<Router>` компонентов.

Возвращает объект со следующими свойствами:

- `path: string` - Текущий путь
- `query: Record<string, string>` - Параметры строки запроса (`/profile?name=John` -> `{ name: 'John' }`)
- `params: Record<string, string>` - Параметры маршрута (`/profile/:id` -> `{ id: '123' }`)

### lazy()

Создаёт лениво-загружаемую версию компонента.

`lazy()` принимает async функцию, которая разрешается в компонент, и возвращает wrapper версию того компонента. Wrapper компонент может быть рендерирован сразу, даже если компонент загружается только при первом рендеринге.

```jsx
import { lazy, LocationProvider, Router } from 'preact-iso';

// Синхронный, без разделения кода:
import Home from './routes/home.js';

// Асинхронный, с разделением кода:
const Profiles = lazy(() =>
  import('./routes/profiles.js').then(m => m.Profiles)
); // Ожидает именованный экспорт с именем `Profiles`
const Profile = lazy(() => import('./routes/profile.js')); // Ожидает экспорт по умолчанию

function App() {
	return (
		<LocationProvider>
			<Router>
				<Home path="/" />
				<Profiles path="/profiles" />
				<Profile path="/profile/:id" />
			</Router>
		</LocationProvider>
	);
}
```

Результат выполнения `lazy()` также предоставляет метод `preload()`, который можно использовать для загрузки компонента до того, как он понадобится для рендеринга. Этот метод полностью опционален, но может быть полезен при событиях вроде получения фокуса, наведения курсора и т. д. — чтобы начать загрузку компонента немного раньше, чем это произошло бы в обычных условиях.

```jsx
const Profile = lazy(() => import('./routes/profile.js'));

function Home() {
	return (
		<a href="/profile/rschristian" onMouseOver={() => Profile.preload()}>
			Страница профиля - наведите курсор, чтобы предварительно загрузить модуль!
		</a>
	);
}
```

### ErrorBoundary

Простой компонент для перехвата ошибок в дереве компонентов ниже него.

Props:

- `onError?: (error: Error) => void` - Callback, вызываемый при перехвате ошибки

```jsx
import { LocationProvider, ErrorBoundary, Router } from 'preact-iso';

function App() {
	return (
		<LocationProvider>
			<ErrorBoundary onError={e => console.log(e)}>
				<Router>
					<Home path="/" />
					<Profiles path="/profiles" />
					<Profile path="/profile/:id" />
				</Router>
			</ErrorBoundary>
		</LocationProvider>
	);
}
```

### hydrate()

Облегчённая обёртка вокруг экспорта `hydrate` из Preact. Она автоматически выбирает между гидратацией и рендерингом переданного элемента в зависимости от того, была ли текущая страница предварительно отрендерена. Дополнительно проверяет, выполняется ли код в браузерном контексте, прежде чем пытаться что-либо отрендерить, что делает её `no-op` (пустой операцией) во время SSR.

Работает в паре с функцией `prerender()`.

Параметры:

- `jsx: ComponentChild` - JSX-элемент или компонент для рендеринга
- `parent?: Element | Document | ShadowRoot | DocumentFragment` - Родительский элемент для рендеринга. По умолчанию используется `document.body`, если не указан.

```jsx
import { hydrate } from 'preact-iso';

function App() {
	return (
		<div class="app">
			<h1>Привет, мир</h1>
		</div>
	);
}

hydrate(<App />);
```

Тем не менее, это всего лишь вспомогательный метод. Его использование не является обязательным — вы всегда можете напрямую использовать экспорт `hydrate` из Preact.

### prerender()

Выполняет рендеринг дерева Virtual DOM в строку HTML с использованием `preact-render-to-string`. Промис, возвращаемый из `prerender()`, разрешается в объект со свойствами `html` и `links[]`. Свойство `html` содержит предварительно отрендеренную статическую HTML-разметку, а `links` — массив строк URL, не являющихся внешними, найденных в ссылках на сгенерированной странице.

В первую очередь используется в паре с предварительным рендерингом из [`@preact/preset-vite`](https://github.com/preactjs/preset-vite#prerendering-configuration).

Параметры:

- `jsx: ComponentChild` - JSX элемент или компонент для рендеринга

```jsx
import {
	LocationProvider,
	ErrorBoundary,
	Router,
	lazy,
	prerender
} from 'preact-iso';

// Асинхронный (бросает promise)
const Foo = lazy(() => import('./foo.js'));
const Bar = lazy(() => import('./bar.js'));

function App() {
	return (
		<LocationProvider>
			<ErrorBoundary>
				<Router>
					<Foo path="/" />
					<Bar path="/bar" />
				</Router>
			</ErrorBoundary>
		</LocationProvider>
	);
}

const { html, links } = await prerender(<App />);
```

### locationStub

Утилита для имитации объекта `location` в среде без браузера. Наш маршрутизатор зависит от этого для работы, поэтому если вы используете `preact-iso` вне браузерного контекста и не применяете предварительный рендеринг через `@preact/preset-vite` (который делает это за вас), вы можете использовать эту утилиту для создания заглушки объекта `location`.

```js
import { locationStub } from 'preact-iso/prerender';

locationStub('/foo/bar?baz=qux#quux');

console.log(location.pathname); // "/foo/bar"
```
