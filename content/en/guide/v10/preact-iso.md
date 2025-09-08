---
title: preact-iso
description: preact-iso is a collection of isomorphic async tools for Preact
---

# preact-iso

preact-iso is a collection of isomorphic async tools for Preact.

"Isomorphic" describes code that can run (ideally seamlessly) across both the browser and server. `preact-iso` is made for supporting these environments, allowing users to build apps without having to create separate browser and server routers or worry about differences in data or component loading. The same app code can be used in the browser and on a server during prerendering, no adjustments necessary.

> **Note:** Whilst this is a routing library that comes from the Preact team, many other routers are available in the wider Preact/React ecosystem that you may prefer to use instead, including [wouter](https://github.com/molefrog/wouter) and [react-router](https://reactrouter.com/). It's a great first option but you can bring your favorite router to Preact if you prefer.

---

<toc></toc>

---

## Routing

`preact-iso` offers a simple router for Preact with conventional and hooks-based APIs. The `<Router>` component is async-aware: when transitioning from one route to another, if the incoming route suspends (throws a Promise), the outgoing route is preserved until the new one becomes ready.

```jsx
import {
	lazy,
	LocationProvider,
	ErrorBoundary,
	Router,
	Route
} from 'preact-iso';

// Synchronous
import Home from './routes/home.js';

// Asynchronous (throws a promise)
const Profiles = lazy(() => import('./routes/profiles.js'));
const Profile = lazy(() => import('./routes/profile.js'));
const NotFound = lazy(() => import('./routes/_404.js'));

function App() {
	return (
		<LocationProvider>
			<ErrorBoundary>
				<Router>
					<Home path="/" />
					{/* Alternative dedicated route component for better TS support */}
					<Route path="/profiles" component={Profiles} />
					<Route path="/profile/:id" component={Profile} />
					{/* `default` prop indicates a fallback route. Useful for 404 pages */}
					<NotFound default />
				</Router>
			</ErrorBoundary>
		</LocationProvider>
	);
}
```

**Progressive Hydration:** When the app is hydrated on the client, the route (`Home` or `Profile` in this case) suspends. This causes hydration for that part of the page to be deferred until the route's `import()` is resolved, at which point that part of the page automatically finishes hydrating.

**Seamless Routing:** When switching between routes on the client, the Router is aware of asynchronous dependencies in routes. Instead of clearing the current route and showing a loading spinner while waiting for the next route, the router preserves the current route in-place until the incoming route has finished loading, then they are swapped.

## Prerendering

`prerender()` renders a Virtual DOM tree to an HTML string using [`preact-render-to-string`](https://github.com/preactjs/preact-render-to-string). The Promise returned from `prerender()` resolves to an Object with `html` and `links[]` properties. The `html` property contains your pre-rendered static HTML markup, and `links` is an Array of any non-external URL strings found in links on the generated page.

Primarily meant for use with prerendering via [`@preact/preset-vite`](https://github.com/preactjs/preset-vite#prerendering-configuration) or other prerendering systems that share the API. If you're server-side rendering your app via any other method, you can use `preact-render-to-string` (specifically `renderToStringAsync()`) directly.

```jsx
import {
	LocationProvider,
	ErrorBoundary,
	Router,
	lazy,
	prerender as ssr
} from 'preact-iso';

// Asynchronous (throws a promise)
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

## Nested Routing

Some applications would benefit from having routers of multiple levels, allowing to break down the routing logic into smaller components. This is especially useful for larger applications, and we solve this by allowing for multiple nested `<Router>` components.

Partially matched routes end with a wildcard (`/*`) and only the remaining value will be passed to descendant routers for further matching. This allows you to create a parent route that matches a base path, and then have child routes that match specific sub-paths.

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

The `<Movies>` component will be used for the following routes:

- `/movies/trending`
- `/movies/search`
- `/movies/Inception`
- `/movies/...`

It will not be used for any of the following:

- `/movies`
- `/movies/`

## Non-JS Servers

For those using non-JS servers (e.g., PHP, Python, Ruby, etc.) to serve your Preact app, you may want to use our ["polyglot-utils"](https://github.com/preactjs/preact-iso/tree/main/polyglot-utils), a collection of our route matching logic ported to various other languages. Combined with a route manifest, this will allow your server to better understand which assets will be needed at runtime for a given URL, allowing you to say insert preload tags for those assets in the HTML head prior to serving the page.

---

## API Docs

### LocationProvider

A context provider that provides the current location to its children. This is required for the router to function.

Props:

- `scope?: string | RegExp` - Sets a scope for the paths that the router will handle (intercept). If a path does not match the scope, either by starting with the provided string or matching the RegExp, the router will ignore it and default browser navigation will apply.

Typically, you would wrap your entire app in this provider:

```jsx
import { LocationProvider } from 'preact-iso';

function App() {
	return (
		<LocationProvider scope="/app">{/* Your app here */}</LocationProvider>
	);
}
```

### Router

Props:

- `onRouteChange?: (url: string) => void` - Callback to be called when a route changes.
- `onLoadStart?: (url: string) => void` - Callback to be called when a route starts loading (i.e., if it suspends). This will not be called before navigations to sync routes or subsequent navigations to async routes.
- `onLoadEnd?: (url: string) => void` - Callback to be called after a route finishes loading (i.e., if it suspends). This will not be called after navigations to sync routes or subsequent navigations to async routes.

```jsx
import { LocationProvider, Router } from 'preact-iso';

function App() {
	return (
		<LocationProvider>
			<Router
				onRouteChange={url => console.log('Route changed to', url)}
				onLoadStart={url => console.log('Starting to load', url)}
				onLoadEnd={url => console.log('Finished loading', url)}
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

There are two ways to define routes using `preact-iso`:

1. Append router params to the route components directly: `<Home path="/" />`
2. Use the `Route` component instead: `<Route path="/" component={Home} />`

Appending arbitrary props to components not unreasonable in JavaScript, as JS is a dynamic language that's perfectly happy to support dynamic & arbitrary interfaces. However, TypeScript, which many of us use even when writing JS (via TS's language server), is not exactly a fan of this sort of interface design.

TS does not (yet) allow for overriding a child's props from the parent component so we cannot, for instance, define `<Home>` as taking no props _unless_ it's a child of a `<Router>`, in which case it can have a `path` prop. This leaves us with a bit of a dilemma: either we define all of our routes as taking `path` props so we don't see TS errors when writing `<Home path="/" />` or we create wrapper components to handle the route definitions.

While `<Home path="/" />` is completely equivalent to `<Route path="/" component={Home} />`, TS users may find the latter preferable.

```jsx
import { LocationProvider, Router, Route } from 'preact-iso';

function App() {
	return (
		<LocationProvider>
			<Router>
				{/* Both of these are equivalent */}
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

Props for any route component:

- `path: string` - The path to match (read on)
- `default?: boolean` - If set, this route is a fallback/default route to be used when nothing else matches

Specific to the `Route` component:

- `component: AnyComponent` - The component to render when the route matches

#### Path Segment Matching

Paths are matched using a simple string matching algorithm. The following features may be used:

- `:param` - Matches any URL segment, binding the value to the label (can later extract this value from `useRoute()`)
  - `/profile/:id` will match `/profile/123` and `/profile/abc`
  - `/profile/:id?` will match `/profile` and `/profile/123`
  - `/profile/:id*` will match `/profile`, `/profile/123`, and `/profile/123/abc`
  - `/profile/:id+` will match `/profile/123`, `/profile/123/abc`
- `*` - Matches one or more URL segments
  - `/profile/*` will match `/profile/123`, `/profile/123/abc`, etc.

These can then be composed to create more complex routes:

- `/profile/:id/*` will match `/profile/123/abc`, `/profile/123/abc/def`, etc.

The difference between `/:id*` and `/:id/*` is that in the former, the `id` param will include the entire path after it, while in the latter, the `id` is just the single path segment.

- `/profile/:id*`, with `/profile/123/abc`
  - `id` is `123/abc`
- `/profile/:id/*`, with `/profile/123/abc`
  - `id` is `123`

### useLocation()

A hook to work with the `LocationProvider` to access location context.

Returns an object with the following properties:

- `url: string` - The current path & search params
- `path: string` - The current path
- `query: Record<string, string>` - The current query string parameters (`/profile?name=John` -> `{ name: 'John' }`)
- `route: (url: string, replace?: boolean) => void` - A function to programmatically navigate to a new route. The `replace` param can optionally be used to overwrite history, navigating them away without keeping the current location in the history stack.

### useRoute()

A hook to access current route information. Unlike `useLocation`, this hook only works within `<Router>` components.

Returns an object with the following properties:

- `path: string` - The current path
- `query: Record<string, string>` - The current query string parameters (`/profile?name=John` -> `{ name: 'John' }`)
- `params: Record<string, string>` - The current route parameters (`/profile/:id` -> `{ id: '123' }`)

### lazy()

Make a lazily-loaded version of a Component.

`lazy()` takes an async function that resolves to a Component, and returns a wrapper version of that Component. The wrapper component can be rendered right away, even though the component is only loaded the first time it is rendered.

```jsx
import { lazy, LocationProvider, Router } from 'preact-iso';

// Synchronous, not code-splitted:
import Home from './routes/home.js';

// Asynchronous, code-splitted:
const Profiles = lazy(() =>
	import('./routes/profiles.js').then(m => m.Profiles)
); // Expects a named export called `Profiles`
const Profile = lazy(() => import('./routes/profile.js')); // Expects a default export

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

The result of `lazy()` also exposes a `preload()` method that can be used to load the component before it's needed for rendering. Entirely optional, but can be useful on focus, mouse over, etc. to start loading the component a bit earlier than it otherwise would be.

```jsx
const Profile = lazy(() => import('./routes/profile.js'));

function Home() {
	return (
		<a href="/profile/rschristian" onMouseOver={() => Profile.preload()}>
			Profile Page -- Hover over me to preload the module!
		</a>
	);
}
```

### ErrorBoundary

A simple component to catch errors in the component tree below it.

Props:

- `onError?: (error: Error) => void` - A callback to be called when an error is caught

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

A thin wrapper around Preact's `hydrate` export, it switches between hydrating and rendering the provided element, depending on whether the current page has been prerendered. Additionally, it checks to ensure it's running in a browser context before attempting any rendering, making it a no-op during SSR.

Pairs with the `prerender()` function.

Params:

- `jsx: ComponentChild` - The JSX element or component to render
- `parent?: Element | Document | ShadowRoot | DocumentFragment` - The parent element to render into. Defaults to `document.body` if not provided.

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

However, it is just a simple utility method. By no means is it essential to use, you can always use Preact's `hydrate` export directly.

### prerender()

Renders a Virtual DOM tree to an HTML string using `preact-render-to-string`. The Promise returned from `prerender()` resolves to an Object with `html` and `links[]` properties. The `html` property contains your pre-rendered static HTML markup, and `links` is an Array of any non-external URL strings found in links on the generated page.

Pairs primarily with [`@preact/preset-vite`](https://github.com/preactjs/preset-vite#prerendering-configuration)'s prerendering.

Params:

- `jsx: ComponentChild` - The JSX element or component to render

```jsx
import {
	LocationProvider,
	ErrorBoundary,
	Router,
	lazy,
	prerender
} from 'preact-iso';

// Asynchronous (throws a promise)
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

A utility function to imitate the `location` object in a non-browser environment. Our router relies upon this to function, so if you are using `preact-iso` outside of a browser context and are not prerendering via `@preact/preset-vite` (which does this for you), you can use this utility to set a stubbed `location` object.

```js
import { locationStub } from 'preact-iso/prerender';

locationStub('/foo/bar?baz=qux#quux');

console.log(location.pathname); // "/foo/bar"
```
