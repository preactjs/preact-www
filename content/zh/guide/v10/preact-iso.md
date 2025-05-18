---
title: preact-iso
description: 'preact-iso is a collection of isomorphic async tools for Preact'
---

# preact-iso

preact-iso 是 Preact 的同构异步工具集合。

"同构"描述的是可以在浏览器和服务器上（理想情况下是无缝地）运行的代码。`preact-iso` 专为支持这些环境而设计，允许用户构建应用程序，而无需创建单独的浏览器和服务器路由器，或担心数据或组件加载的差异。相同的应用程序代码可以在浏览器和预渲染期间的服务器上使用，无需调整。

> **注意：** 虽然这是一个来自 Preact 团队的路由库，但在更广泛的 Preact/React 生态系统中还有许多其他路由器可供使用，包括 [wouter](https://github.com/molefrog/wouter) 和 [react-router](https://reactrouter.com/)。它是一个很好的首选，但如果您愿意，可以将您喜欢的路由器带到 Preact。

---

<toc></toc>

---

## 路由

`preact-iso` 为 Preact 提供了一个简单的路由器，具有传统和基于 hooks 的 API。`<Router>` 组件是异步感知的：当从一个路由转换到另一个路由时，如果传入的路由暂停（抛出 Promise），则保留传出的路由，直到新路由准备就绪。

```jsx
import { lazy, LocationProvider, ErrorBoundary, Router, Route } from 'preact-iso';

// 同步
import Home from './routes/home.js';

// 异步（抛出 promise）
const Profiles = lazy(() => import('./routes/profiles.js'));
const Profile = lazy(() => import('./routes/profile.js'));
const NotFound = lazy(() => import('./routes/_404.js'));

function App() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Router>
          <Home path="/" />
          {/* 替代专用路由组件，以获得更好的 TS 支持 */}
          <Route path="/profiles" component={Profiles} />
          <Route path="/profile/:id" component={Profile} />
          {/* `default` 属性表示一个后备路由。对 404 页面很有用 */}
          <NotFound default />
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  );
}
```

**渐进式水合：** 当应用程序在客户端上水合时，路由（在本例中为 `Home` 或 `Profile`）暂停。这导致该页面部分的水合被推迟，直到路由的 `import()` 解析完成，此时页面的该部分自动完成水合。

**无缝路由：** 在客户端切换路由时，路由器了解路由中的异步依赖。路由器不会清除当前路由并在等待下一个路由时显示加载动画，而是保留当前路由，直到传入的路由完成加载，然后它们被交换。

## 预渲染

`prerender()` 使用 [`preact-render-to-string`](https://github.com/preactjs/preact-render-to-string) 将虚拟 DOM 树渲染为 HTML 字符串。从 `prerender()` 返回的 Promise 解析为一个包含 `html` 和 `links[]` 属性的对象。`html` 属性包含您预渲染的静态 HTML 标记，`links` 是在生成的页面上找到的任何非外部 URL 字符串的数组。

主要用于通过 [`@preact/preset-vite`](https://github.com/preactjs/preset-vite#prerendering-configuration) 或其他共享 API 的预渲染系统进行预渲染。如果您通过任何其他方法进行服务器端渲染您的应用程序，可以直接使用 `preact-render-to-string`（特别是 `renderToStringAsync()`）。

```jsx
import { LocationProvider, ErrorBoundary, Router, lazy, prerender as ssr } from 'preact-iso';

// 异步（抛出 promise）
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

## 嵌套路由

通过使用多个 `Router` 组件支持嵌套路由。部分匹配的路由以通配符（`/*`）结尾，剩余的值将被传递以继续匹配，如果有任何进一步的路由。

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

这将匹配以下路由：
  - `/movies/trending`
  - `/movies/search`
  - `/movies/Inception`

---

## API 文档

### LocationProvider

一个上下文提供者，向其子组件提供当前位置。路由器功能需要这个。

属性：

  - `scope?: string | RegExp` - 设置路由器将处理（拦截）的路径范围。如果路径不匹配范围，无论是以提供的字符串开头还是匹配正则表达式，路由器都会忽略它，并应用默认的浏览器导航。

通常，您会将整个应用程序包装在这个提供者中：

```jsx
import { LocationProvider } from 'preact-iso';

function App() {
  return (
    <LocationProvider scope="/app">
        {/* 您的应用程序在这里 */}
    </LocationProvider>
  );
}
```

### Router

属性：

  - `onRouteChange?: (url: string) => void` - 路由更改时要调用的回调。
  - `onLoadStart?: (url: string) => void` - 路由开始加载时要调用的回调（即，如果它暂停）。这不会在导航到同步路由之前或随后导航到异步路由之前被调用。
  - `onLoadEnd?: (url: string) => void` - 路由完成加载后要调用的回调（即，如果它暂停）。这不会在导航到同步路由之后或随后导航到异步路由之后被调用。

```jsx
import { LocationProvider, Router } from 'preact-iso';

function App() {
  return (
    <LocationProvider>
      <Router
        onRouteChange={(url) => console.log('路由更改为', url)}
        onLoadStart={(url) => console.log('开始加载', url)}
        onLoadEnd={(url) => console.log('完成加载', url)}
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

使用 `preact-iso` 定义路由有两种方式：

1. 直接将路由参数附加到路由组件：`<Home path="/" />`
2. 使用 `Route` 组件代替：`<Route path="/" component={Home} />`

在 JavaScript 中，将任意属性附加到组件上并不是不合理的，因为 JS 是一种动态语言，完全支持动态和任意接口。然而，TypeScript（我们许多人甚至在编写 JS 时也通过 TS 的语言服务器使用）对这种接口设计并不完全支持。

TS 尚不允许从父组件覆盖子组件的属性，因此我们不能，例如，将 `<Home>` 定义为不接受任何属性，除非它是 `<Router>` 的子组件，在这种情况下，它可以有一个 `path` 属性。这给我们带来了一个困境：要么我们将所有路由定义为接受 `path` 属性，以便在编写 `<Home path="/" />` 时不会看到 TS 错误，要么我们创建包装组件来处理路由定义。

虽然 `<Home path="/" />` 完全等同于 `<Route path="/" component={Home} />`，但 TS 用户可能会发现后者更可取。

```jsx
import { LocationProvider, Router, Route } from 'preact-iso';

function App() {
  return (
    <LocationProvider>
      <Router>
        {/* 这两个是等价的 */}
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

任何路由组件的属性：

  - `path: string` - 要匹配的路径（继续阅读）
  - `default?: boolean` - 如果设置，此路由是一个后备/默认路由，在没有其他匹配时使用

特定于 `Route` 组件：

  - `component: AnyComponent` - 路由匹配时要渲染的组件

#### 路径段匹配

路径使用简单的字符串匹配算法进行匹配。可以使用以下功能：

  - `:param` - 匹配任何 URL 段，将值绑定到标签（以后可以从 `useRoute()` 提取此值）
    - `/profile/:id` 将匹配 `/profile/123` 和 `/profile/abc`
    - `/profile/:id?` 将匹配 `/profile` 和 `/profile/123`
    - `/profile/:id*` 将匹配 `/profile`、`/profile/123` 和 `/profile/123/abc`
    - `/profile/:id+` 将匹配 `/profile/123`、`/profile/123/abc`
  - `*` - 匹配一个或多个 URL 段
    - `/profile/*` 将匹配 `/profile/123`、`/profile/123/abc` 等。

这些可以组合起来创建更复杂的路由：

  - `/profile/:id/*` 将匹配 `/profile/123/abc`、`/profile/123/abc/def` 等。

`/:id*` 和 `/:id/*` 的区别在于，前者中，`id` 参数将包含之后的整个路径，而后者中，`id` 只是单个路径段。

  - `/profile/:id*`，使用 `/profile/123/abc`
    - `id` 是 `123/abc`
  - `/profile/:id/*`，使用 `/profile/123/abc`
    - `id` 是 `123`

### useLocation()

一个与 `LocationProvider` 配合使用的钩子，用于访问位置上下文。

返回一个具有以下属性的对象：

  - `url: string` - 当前路径和搜索参数
  - `path: string` - 当前路径
  - `query: Record<string, string>` - 当前查询字符串参数（`/profile?name=John` -> `{ name: 'John' }`）
  - `route: (url: string, replace?: boolean) => void` - 一个以编程方式导航到新路由的函数。`replace` 参数可以选择性地用于覆盖历史记录，导航它们离开而不保留当前位置在历史堆栈中。

### useRoute()

一个访问当前路由信息的钩子。与 `useLocation` 不同，此钩子仅在 `<Router>` 组件内部工作。

返回一个具有以下属性的对象：

  - `path: string` - 当前路径
  - `query: Record<string, string>` - 当前查询字符串参数（`/profile?name=John` -> `{ name: 'John' }`）
  - `params: Record<string, string>` - 当前路由参数（`/profile/:id` -> `{ id: '123' }`）

### lazy()

创建组件的懒加载版本。

`lazy()` 接受一个解析为组件的异步函数，并返回该组件的包装版本。包装组件可以立即渲染，即使组件只在第一次渲染时加载。

```jsx
import { lazy, LocationProvider, Router } from 'preact-iso';

// 同步，不代码分割：
import Home from './routes/home.js';

// 异步，代码分割：
const Profiles = lazy(() => import('./routes/profiles.js').then(m => m.Profiles)); // 期望有一个名为 `Profiles` 的命名导出
const Profile = lazy(() => import('./routes/profile.js')); // 期望有一个默认导出

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

`lazy()` 的结果还公开了一个 `preload()` 方法，可用于在需要渲染之前加载组件。完全可选，但在聚焦、鼠标悬停等情况下可能有用，以比原本更早地开始加载组件。

```jsx
const Profile = lazy(() => import('./routes/profile.js'));

function Home() {
    return (
        <a href="/profile/rschristian" onMouseOver={() => Profile.preload()}>
            个人资料页面 -- 将鼠标悬停在我上面预加载模块！
        </a>
    );
}
```

### ErrorBoundary

一个简单的组件，用于捕获其下方组件树中的错误。

属性：

  - `onError?: (error: Error) => void` - 捕获错误时要调用的回调

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

Preact 的 `hydrate` 导出的薄包装器，它根据当前页面是否已预渲染，在水合和渲染提供的元素之间切换。此外，它会检查以确保它在尝试任何渲染之前在浏览器上下文中运行，使其在 SSR 期间成为无操作。

与 `prerender()` 函数配对。

参数：

  - `jsx: ComponentChild` - 要渲染的 JSX 元素或组件
  - `parent?: Element | Document | ShadowRoot | DocumentFragment` - 要渲染到的父元素。如果未提供，默认为 `document.body`。

```jsx
import { hydrate } from 'preact-iso';

function App() {
  return (
    <div class="app">
      <h1>Hello World</h1>
    </div>
  );
}

hydrate(<App />);
```

然而，它只是一个简单的实用方法。绝不是必须使用的，您始终可以直接使用 Preact 的 `hydrate` 导出。

### prerender()

使用 `preact-render-to-string` 将虚拟 DOM 树渲染为 HTML 字符串。从 `prerender()` 返回的 Promise 解析为包含 `html` 和 `links[]` 属性的对象。`html` 属性包含您预渲染的静态 HTML 标记，`links` 是在生成的页面上找到的任何非外部 URL 字符串的数组。

主要与 [`@preact/preset-vite`](https://github.com/preactjs/preset-vite#prerendering-configuration) 的预渲染配对。

参数：

  - `jsx: ComponentChild` - 要渲染的 JSX 元素或组件

```jsx
import { LocationProvider, ErrorBoundary, Router, lazy, prerender } from 'preact-iso';

// 异步（抛出 promise）
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