---
title: preact-iso
description: 'preact-iso это набор изоморфных асинхронных инструментов для Preact'
---

# preact-iso

`preact-iso` — это набор изоморфных асинхронных инструментов для Preact.

«Изоморфный» описывает код, который может работать (в идеале — беспрепятственно) как в браузере, так и на сервере. `preact-iso` создан для поддержки этих сред, позволяя пользователям строить приложения без необходимости создавать отдельные роутеры для браузера и сервера или беспокоиться о различиях в данных или загрузке компонентов. Один и тот же код приложения может использоваться в браузере и на сервере во время предварительного рендеринга, без необходимости внесения изменений.

> **Примечание:** Хоть это и библиотека маршрутизации от команды Preact, в экосистеме Preact/React есть и другие роутеры — например, [wouter](https://github.com/molefrog/wouter) или [react-router](https://reactrouter.com/). `preact-iso` — хороший вариант для старта, но при желании можно использовать любой другой роутер.

---

<toc></toc>

---

## Маршрутизация

Библиотека `preact-iso` включает в себя лаконичный роутер для Preact, поддерживающий как классический API, так и работу через хуки. Компонент `<Router>` поддерживает асинхронность: при переходе с одного маршрута на другой, если новый маршрут приостанавливается (выбрасывает Promise), предыдущий маршрут сохраняется до тех пор, пока новый не будет готов.

```jsx
import { lazy, LocationProvider, ErrorBoundary, Router, Route } from 'preact-iso';

// Синхронный
import Home from './routes/home.js';

// Асинхронный (выдает Promise)
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

`prerender()` выполняет рендеринг виртуального DOM в HTML-строку с использованием [`preact-render-to-string`](https://github.com/preactjs/preact-render-to-string). Возвращаемый из `prerender()` Promise разрешается в объект со свойствами `html` и `links[]`. Свойство `html` содержит предварительно отрендеренную статическую HTML-разметку, а `links` представляет собой массив строк URL-адресов (кроме внешних), найденных в ссылках на сгенерированной странице.

В первую очередь предназначен для использования с предварительным рендерингом через [`@preact/preset-vite`](https://github.com/preactjs/preset-vite#prerendering-configuration) или другие системы предварительного рендеринга с совместимым API. Для серверного рендеринга другими методами можно напрямую использовать `preact-render-to-string` (в частности, `renderToStringAsync()`).

```jsx
import { LocationProvider, ErrorBoundary, Router, lazy, prerender as ssr } from 'preact-iso';

// Асинхронный (выдает Promise)
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

## Вложенная маршрутизация

Вложенные маршруты поддерживаются с помощью нескольких компонентов `Router`. Частично совпадающие маршруты заканчиваются символом подстановки (`/*`), а оставшаяся часть значения будет передана для продолжения сопоставления, если есть дополнительные маршруты.

```jsx
import { lazy, LocationProvider, ErrorBoundary, Router, Route } from 'preact-iso';

const NotFound = lazy(() => import('./routes/_404.js'));

function App() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Router>
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

Такой подход будет обрабатывать следующие маршруты:
  - `/movies/trending`
  - `/movies/search`
  - `/movies/Inception`

---

## Документация API

### LocationProvider

Контекст-провайдер, передающий текущий location дочерним компонентам. Обязателен для работы роутера.

Пропсы:

  - `scope?: string | RegExp` - Задает область видимости для путей, которые роутер будет обрабатывать (перехватывать). Если путь не соответствует области видимости — либо не начинается с указанной строки, либо не соответствует RegExp — роутер проигнорирует его, и будет применена стандартная навигация браузера.

Обычно вы будете оборачивать всё приложение в этот провайдер:

```jsx
import { LocationProvider } from 'preact-iso';

function App() {
  return (
    <LocationProvider scope="/app">
        {/* Ваше приложение */}
    </LocationProvider>
  );
}
```

### Router

Пропсы:

  - `onRouteChange?: (url: string) => void` - Колбэк, вызываемый при изменении маршрута.
  - `onLoadStart?: (url: string) => void` - Колбэк, вызываемый при начале загрузки маршрута (например, если он приостанавливается). Не вызывается для синхронных маршрутов или при повторных переходах на асинхронные маршруты.
  - `onLoadEnd?: (url: string) => void` - Колбэк, вызываемый после завершения загрузки маршрута (например, если он приостанавливался). Не вызывается для синхронных маршрутов или при повторных переходах на асинхронные маршруты.

```jsx
import { LocationProvider, Router } from 'preact-iso';

function App() {
  return (
    <LocationProvider>
      <Router
        onRouteChange={(url) => console.log('Маршрут изменён:', url)}
        onLoadStart={(url) => console.log('Начинаю загружать', url)}
        onLoadEnd={(url) => console.log('Загрузка окончена', url)}
      >
        <Home path="/" />
        <Profiles path="/profiles" />
        <Profile path="/profile/:id" />
      </Router>
    </LocationProvider>
  )
}
```

### Route


В `preact-iso` существует два способа определения маршрутов:

1. Непосредственное добавление параметров роутера к компонентам: `<Home path="/" />`
2. Использование компонента `Route`: `<Route path="/" component={Home} />`

Добавление произвольных пропсов к компонентам вполне допустимо в JavaScript, поскольку JS — это динамический язык, который легко поддерживает динамические интерфейсы. Однако TypeScript, который многие используют даже при написании JS (через языковой сервер TS), не совсем приветствует такой дизайн интерфейсов.

TypeScript (пока) не позволяет переопределять пропсы дочернего компонента из родительского. Мы не можем, например, определить `<Home>` как компонент без пропсов, если только он не является дочерним для `<Router>`, в этом случае он может принимать проп `path`. Это создает дилемму: либо мы определяем все наши маршруты как принимающие проп `path` (чтобы избежать ошибок TS при использовании `<Home path="/" />`), либо создаем компоненты-обёртки для определения маршрутов.

Хотя `<Home path="/" />` полностью эквивалентен `<Route path="/" component={Home} />`, пользователям TypeScript может быть предпочтительнее второй вариант.

```jsx
import { LocationProvider, Router, Route } from 'preact-iso';

function App() {
  return (
    <LocationProvider>
      <Router>
        {/* Эти две строки эквивалентны */}
        <Home path="/" />
        <Route path="/" component={Home} />

        <Profiles path="/profiles" />
        <Profile path="/profile/:id" />
        <NotFound default />
      </Router>
    </LocationProvider>
  )
}
```

Пропсы для любых компонентов маршрутов:

  - `path: string` - Путь для сопоставления (см. далее)
  - `default?: boolean` - Если `true`, этот маршрут будет использоваться как резервный, когда другие не совпадают

Специфичные для компонента `Route`:

  - `component: AnyComponent` - Компонент для рендеринга при совпадении маршрута

#### Сопоставление сегментов пути

Пути сопоставляются с помощью простого алгоритма сравнения строк. Доступны следующие возможности:

  - `:param` - Сопоставляет любой сегмент URL, связывая значение с меткой (можно извлечь через `useRoute()`)
    - `/profile/:id` → `/profile/123` и `/profile/abc`
    - `/profile/:id?` → `/profile` и `/profile/123`
    - `/profile/:id*` → `/profile`, `/profile/123`, `/profile/123/abc`
    - `/profile/:id+` → `/profile/123`, `/profile/123/abc`
  - `*` - Сопоставляет один или несколько сегментов URL
    - `/profile/*` → `/profile/123`, `/profile/123/abc` и т. д.

Эти паттерны можно комбинировать для создания сложных маршрутов:

  - `/profile/:id/*` → `/profile/123/abc`, `/profile/123/abc/def` и т. д.

Разница между `/:id*` и `/:id/*` заключается в том, что в первом случае параметр `id` будет включать весь путь после себя, тогда как во втором случае `id` представляет только один сегмент пути.

  - `/profile/:id*`, с `/profile/123/abc`
    - `id` это `123/abc`
  - `/profile/:id/*`, с `/profile/123/abc`
    - `id` это `123`

### useLocation()

Хук для работы с `LocationProvider`, предоставляющий доступ к контексту местоположения.

Возвращает объект со следующими свойствами:

  - `url: string` - Текущий путь и параметры поиска
  - `path: string` - Текущий путь
  - `query: Record<string, string>` - Параметры строки запроса (`/profile?name=John` -> `{ name: 'John' }`)
  - `route: (url: string, replace?: boolean) => void` - Функция для программной навигации на новый маршрут. Параметр `replace` может быть использован для перезаписи истории, осуществляя переход без сохранения текущего местоположения в стеке истории.

### useRoute()

Хук для доступа к информации о текущем маршруте. В отличие от `useLocation`, этот хук работает только внутри компонентов `<Router>`.

Возвращает объект со следующими свойствами:

  - `path: string` - Текущий путь
  - `query: Record<string, string>` - Параметры строки запроса (`/profile?name=John` -> `{ name: 'John' }`)
  - `params: Record<string, string>` - Параметры маршрута (`/profile/:id` -> `{ id: '123' }`)

### lazy()

Создаёт версию компонента с отложенной загрузкой.

`lazy()` принимает асинхронную функцию, которая возвращает компонент, и создаёт его обёрточную версию. Этот компонент-обёртка может быть отрендерен немедленно, хотя реальный компонент загрузится только при первом рендеринге.

```jsx
import { lazy, LocationProvider, Router } from 'preact-iso';

// Синхронный, без разделения кода:
import Home from './routes/home.js';

// Асинхронный, с разделением кода:
const Profiles = lazy(() => import('./routes/profiles.js').then(m => m.Profiles)); // Ожидает именованный экспорт с именем `Profiles`
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
  )
}
```

Результат выполнения `lazy()` также предоставляет метод `preload()`, который можно использовать для загрузки компонента до того, как он понадобится для рендеринга. Этот метод полностью опционален, но может быть полезен при событиях вроде получения фокуса, наведения курсора и т. д. — чтобы начать загрузку компонента немного раньше, чем это произошло бы в обычных условиях.

```jsx
const Profile = lazy(() => import('./routes/profile.js'));

function Home() {
    return (
        <a href="/profile/rschristian" onMouseOver={() => Profile.preload()}>
            Страница профиля - наведите курсор на меня, чтобы предварительно загрузить модуль!
        </a>
    );
}
```

### ErrorBoundary

Простой компонент для перехвата ошибок в дереве компонентов ниже него.

Пропсы:

  - `onError?: (error: Error) => void` - Колбэк, вызываемый при перехвате ошибки

```jsx
import { LocationProvider, ErrorBoundary, Router } from 'preact-iso';

function App() {
  return (
    <LocationProvider>
      <ErrorBoundary onError={(e) => console.log(e)}>
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

Осуществляет рендеринг Virtual DOM в HTML-строку с использованием `preact-render-to-string`. Возвращаемый Promise разрешается в объект со свойствами `html` и `links[]`:
- `html` содержит предварительно отрендеренную статическую HTML-разметку
- `links` представляет собой массив URL-строк (кроме внешних ссылок), найденных на сгенерированной странице

Предназначен в первую очередь для работы с функционалом предварительного рендеринга в [`@preact/preset-vite`](https://github.com/preactjs/preset-vite#prerendering-configuration).

Параметры:

  - `jsx: ComponentChild` - JSX-элемент или компонент для рендеринга

```jsx
import { LocationProvider, ErrorBoundary, Router, lazy, prerender } from 'preact-iso';

// Асинхронный (выдает Promise)
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
