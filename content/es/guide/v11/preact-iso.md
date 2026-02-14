---
title: preact-iso
description: preact-iso es una colección de herramientas isómorfás asíncronas para Preact
translation_by:
  - Ezequiel Mastropietro
---

# preact-iso

preact-iso es una colección de herramientas isómorfás asíncropas para Preact.

"Isómorfó" describe el código que puede ejecutarse (idealmente sin problemas) tanto en el navegador como en el servidor. `preact-iso` está hecho para soportar estos entornos, permitiendo a los usuarios construir aplicaciones sin tener que crear routadores separados para navegador y servidor o preocuparse por diferencias en datos o carga de componentes. El mismo código de la aplicación puede ser usado en el navegador y en un servidor durante prerendering, sin ajustes necesarios.

> **Nota:** Aunque este es un enrutador que viene del equipo de Preact, muchos otros enrutadores están disponibles en el ecosistema más amplio de Preact/React que puedes preferir usar en su lugar, incluidos [wouter](https://github.com/molefrog/wouter) y [react-router](https://reactrouter.com/). Es una excelente opción inicial pero puedes traer tu enrutador favorito a Preact si lo prefieres.

---

<toc></toc>

---

## Enrutamiento

`preact-iso` ofrece un enrutador simple para Preact con APIs tradicionales y basadas en hooks. El componente `<Router>` tiene conciencia de asincronía: cuando hace transición de una ruta a otra, si la ruta entrante se suspende (lanza una Promesa), la ruta saliente se preserva hasta que la nueva esté lista.

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
					{/* Componente de ruta dedicado alternativo para una mejor compatibilidad con TS */}
					<Route path="/profiles" component={Profiles} />
					<Route path="/profile/:id" component={Profile} />
					{/* La propiedad `default` indica una ruta alternativa. Útil para páginas 404 */}
					<NotFound default />
				</Router>
			</ErrorBoundary>
		</LocationProvider>
	);
}
```

**Hidratación Progresiva:** Cuando la aplicación se hidrata en el cliente, la ruta (`Home` o `Profile` en este caso) se suspende. Esto causa que la hidratación para esa parte de la página sea diferida hasta que el `import()` de la ruta sea resuelto, en cuyo punto esa parte de la página automáticamente termina hidratándose.

**Enrutamiento Sin Problemas:** Cuando cambias entre rutas en el cliente, el Enrutador es consciente de las dependencias asincrónicas en las rutas. En lugar de limpiar la ruta actual y mostrar un spinner de carga mientras esperas la siguiente ruta, el enrutador preserva la ruta actual en su lugar hasta que la ruta entrante haya terminado de cargar, entonces son intercambiadas.

## Pregenerar

`prerender()` renderiza un árbol de DOM Virtual a una cadena HTML usando [`preact-render-to-string`](https://github.com/preactjs/preact-render-to-string). La Promesa devuelta desde `prerender()` se resuelve a un Objeto con propiedades `html` y `links[]`. La propiedad `html` contiene tu marcado HTML estático pre-renderizado, y `links` es un Array de cualquier cadena de URL no externa encontrada en enlaces en la página generada.

Principalmente destinado para uso con pregeneration vía [`@preact/preset-vite`](https://github.com/preactjs/preset-vite#prerendering-configuration) u otros sistemas de pregeneración que comparten la API. Si estás renderizando en el servidor tu aplicación de cualquier otra forma, puedes usar `preact-render-to-string` (específicamente `renderToStringAsync()`) directamente.

```jsx
import {
	LocationProvider,
	ErrorBoundary,
	Router,
	lazy,
	prerender as ssr
} from 'preact-iso';

// Asíncrono (lanza una promesa)
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

## Enrutamiento Anidado

Algunas aplicaciones se beneficiarían de tener enrutadores de múltiples niveles, permitiendo desglosan la lógica de enrutamiento en componentes más pequeños. Esto es especialmente útil para aplicaciones más grandes, y lo resolvemos permitiendo múltiples componentes `<Router>` anidados.

Las rutas parcialmente coincidentes terminan con un comodín (`/*`) y solo el valor restante se pasará a enrutadores descendentes para un emparejamiento más detallado. Esto te permite crear una ruta padre que coincida con una ruta base, y luego tener rutas secundarias que coincidan con subrutas específicas.

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

El componente `<Movies>` será usado para las siguientes rutas:

- `/movies/trending`
- `/movies/search`
- `/movies/Inception`
- `/movies/...`

No será usado para ninguno de los siguientes:

- `/movies`
- `/movies/`

## Servidores No-JS

Para aquellos que usan servidores no-JS (por ejemplo, PHP, Python, Ruby, etc.) para servir tu aplicación Preact, podrías querer usar nuestras ["polyglot-utils"](https://github.com/preactjs/preact-iso/tree/main/polyglot-utils), una colección de nuestra lógica de coincidencia de rutas portada a varios otros lenguajes. Combinado con un manifiesto de rutas, esto permitirá a tu servidor entender mejor qué activos serán necesarios en tiempo de ejecución para una URL dada, permitiéndote insertar etiquetas de precarga para esos activos en el encabezado HTML antes de servir la página.

---

## Documentación de API

### LocationProvider

Un proveedor de contexto que proporciona la ubicación actual a sus hijos. Esto es requerido para que el enrutador funcione.

Propiedades:

- `scope?: string | RegExp` - Establece un ámbito para las rutas que manejará el enrutador (interceptará). Si una ruta no coincide con el ámbito, ya sea comenzando con la cadena proporcionada o coincidiendo con la RegExp, el enrutador la ignorará y se aplicará la navegación de navegador predeterminada.

Típicamente, envolvería toda tu aplicación en este proveedor:

```jsx
import { LocationProvider } from 'preact-iso';

function App() {
	return (
		<LocationProvider scope="/app">{/* Tu app aquí */}</LocationProvider>
	);
}
```

### Router

Propiedades:

- `onRouteChange?: (url: string) => void` - Callback a ser llamado cuando una ruta cambia.
- `onLoadStart?: (url: string) => void` - Callback a ser llamado cuando una ruta comienza a cargar (es decir, si se suspende). Esto no será llamado antes de navegaciones a rutas síncronas o navegaciones posteriores a rutas asincrónicas.
- `onLoadEnd?: (url: string) => void` - Callback a ser llamado después de que una ruta termina de cargar (es decir, si se suspende). Esto no será llamado después de navegaciones a rutas síncronas o navegaciones posteriores a rutas asincrónicas.

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

Hay dos formas de definir rutas usando `preact-iso`:

1. Agregar parámetros de enrutador directamente a los componentes de ruta: `<Home path="/" />`
2. Usar el componente `Route` en su lugar: `<Route path="/" component={Home} />`

Agregar accesorios arbitrarios a componentes no es irrazonable en JavaScript, ya que JS es un lenguaje dinámico que está perfecto hablando para soportar interfaces dinámicas y arbitrarias. Sin embargo, TypeScript, que muchos de nosotros usamos incluso cuando escribimos JS (a través del servidor de lenguaje de TS), no es exactamente un fan de este tipo de diseño de interfaz.

TS no (todavía) permite anular las propiedades de un hijo del componente padre, por lo que no podemos, por ejemplo, definir `<Home>` como sin tomar props _a menos_ que sea un hijo de un `<Router>`, en cuyo caso puede tener una propiedad `path`. Esto nos deja con un poco de un dilema: o definimos todas nuestras rutas como tomando accesorios `path` para no ver errores de TS cuando escribimos `<Home path="/" />` o creamos componentes de envoltura para manejar las definiciones de rutas.

Mientras que `<Home path="/" />` es completamente equivalente a `<Route path="/" component={Home} />`, los usuarios de TS pueden encontrar el último preferible.

```jsx
import { LocationProvider, Router, Route } from 'preact-iso';

function App() {
	return (
		<LocationProvider>
			<Router>
				{/* Ambos de estos son equivalentes */}
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

Propiedades para cualquier componente de ruta:

- `path: string` - La ruta a coincidir (continúa leyendo)
- `default?: boolean` - Si se establece, esta ruta es una ruta alternativa/predeterminada para ser usada cuando nada más coincide

Específico del componente `Route`:

- `component: AnyComponent` - El componente a renderizar cuando la ruta coincide

#### Coincidencia de Segmentos de Ruta

Las rutas se cotejan usando un algoritmo simple de coincidencia de cadenas. Se pueden usar las siguientes características:

- `:param` - Coincide con cualquier segmento de URL, vinculando el valor a la etiqueta (puede extraer este valor posteriormente de `useRoute()`)
  - `/profile/:id` coincidirá con `/profile/123` y `/profile/abc`
  - `/profile/:id?` coincidirá con `/profile` y `/profile/123`
  - `/profile/:id*` coincidirá con `/profile`, `/profile/123`, y `/profile/123/abc`
  - `/profile/:id+` coincidirá con `/profile/123`, `/profile/123/abc`
- `*` - Coincide con uno o más segmentos de URL
  - `/profile/*` coincidirá con `/profile/123`, `/profile/123/abc`, etc.

Estas se pueden componer para crear rutas más complejas:

- `/profile/:id/*` coincidirá con `/profile/123/abc`, `/profile/123/abc/def`, etc.

La diferencia entre `/:id*` e `/:id/*` es que en la primera, el parámetro `id` incluirá toda la ruta después de él, mientras que en la segunda, el `id` es solo el único segmento de ruta.

- `/profile/:id*`, con `/profile/123/abc`
  - `id` es `123/abc`
- `/profile/:id/*`, con `/profile/123/abc`
  - `id` es `123`

### useLocation()

Un hook para trabajar con `LocationProvider` para acceder al contexto de ubicación.

Devuelve un objeto con las siguientes propiedades:

- `url: string` - La ruta actual y parámetros de búsqueda
- `path: string` - La ruta actual
- `query: Record<string, string>` - Los parámetros de cadena de consulta actuales (`/profile?name=John` -> `{ name: 'John' }`)
- `route: (url: string, replace?: boolean) => void` - Una función para navegar programáticamente a una nueva ruta. El parámetro `replace` puede usarse opcionalmente para sobrescribir el historial, navegando sin mantener la ubicación actual en la pila de historial.

### useRoute()

Un hook para acceder a la información de ruta actual. A diferencia de `useLocation`, este hook solo funciona dentro de componentes `<Router>`.

Devuelve un objeto con las siguientes propiedades:

- `path: string` - La ruta actual
- `query: Record<string, string>` - Los parámetros de cadena de consulta actuales (`/profile?name=John` -> `{ name: 'John' }`)
- `params: Record<string, string>` - Los parámetros de ruta actuales (`/profile/:id` -> `{ id: '123' }`)

### lazy()

Crea una versión cargada perezosamente de un Componente.

`lazy()` toma una función asíncrona que se resuelve en un Componente, y devuelve una versión contenedora de ese Componente. El componente contenedor se puede renderizar inmediatamente, aunque el componente solo se carga la primera vez que se renderiza.

```jsx
import { lazy, LocationProvider, Router } from 'preact-iso';

// Síncrono, sin división de código:
import Home from './routes/home.js';

// Asíncrono, con división de código:
const Profiles = lazy(() =>
	import('./routes/profiles.js').then(m => m.Profiles)
); // Espera una exportación nombrada llamada `Profiles`
const Profile = lazy(() => import('./routes/profile.js')); // Espera una exportación predeterminada

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

El resultado de `lazy()` también expone un método `preload()` que se puede usar para cargar el componente antes de que sea necesario para la renderización. Completamente opcional, pero puede ser útil en focus, mouse over, etc. para comenzar a cargar el componente un poco antes de lo que lo haría de otra manera.

```jsx
const Profile = lazy(() => import('./routes/profile.js'));

function Home() {
	return (
		<a href="/profile/rschristian" onMouseOver={() => Profile.preload()}>
			Página de Perfil -- ¡Pasa el mouse sobre mí para precargar el módulo!
		</a>
	);
}
```

### ErrorBoundary

Un componente simple para capturar errores en el árbol de componentes debajo de él.

Propiedades:

- `onError?: (error: Error) => void` - Un callback a ser llamado cuando se captura un error

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

Un contenedor delgado alrededor de la exportación `hydrate` de Preact, cambia entre hidratación y renderización del elemento proporcionado, dependiendo de si la página actual ha sido pre-renderizada. Además, se asegura de estar ejecutándose en un contexto de navegador antes de intentar cualquier renderización, lo que la hace una operación nula durante SSR.

Se empareja con la función `prerender()`.

Parámetros:

- `jsx: ComponentChild` - El elemento JSX o componente a renderizar
- `parent?: Element | Document | ShadowRoot | DocumentFragment` - El elemento padre en el que renderizar. Por defecto es `document.body` si no se proporciona.

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

Sin embargo, es solo un método de utilidad simple. De ninguna manera es esencial usarlo, siempre puedes usar la exportación `hydrate` de Preact directamente.

### prerender()

Renderiza un árbol de DOM Virtual a una cadena HTML usando `preact-render-to-string`. La Promise devuelta desde `prerender()` se resuelve a un Objeto con propiedades `html` y `links[]`. La propiedad `html` contiene tu marcado HTML estático pre-renderizado, y `links` es un Array de cualquier cadena de URL no externa encontrada en enlaces en la página generada.

Se empareja principalmente con la pre-renderización de [`@preact/preset-vite`](https://github.com/preactjs/preset-vite#prerendering-configuration).

Parámetros:

- `jsx: ComponentChild` - El elemento JSX o componente a renderizar

```jsx
import {
	LocationProvider,
	ErrorBoundary,
	Router,
	lazy,
	prerender
} from 'preact-iso';

// Asíncrono (lanza una promesa)
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

Una función de utilidad para imitar el objeto `location` en un entorno no navegador. Nuestro enrutador depende de esto para funcionar, así que si estás usando `preact-iso` fuera de un contexto de navegador y no estás pre-renderizando vía `@preact/preset-vite` (que lo hace por ti), puedes usar esta utilidad para establecer un objeto `location` simulado.

```js
import { locationStub } from 'preact-iso/prerender';

locationStub('/foo/bar?baz=qux#quux');

console.log(location.pathname); // "/foo/bar"
```
