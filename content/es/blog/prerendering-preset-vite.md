---
title: Prerendering with `@preact/preset-vite`
date: 2024-08-06
authors:
  - Ryan Christian
translation_by:
  - Ezequiel Mastropietro
---

# Prerenderizado con Preset Vite

Ha pasado medio año desde que nuestro plugin de prerenderizado se volvió disponible de manera algo silenciosa en `@preact/preset-vite`, así que hablemos de ello, un poco de nuestra historia y del ecosistema en general.

Aquellos que han estado en nuestra comunidad por un tiempo saben cuánto nos gusta el prerenderizado; fue una característica de primera clase en Preact-CLI, luego en WMR, y ahora en nuestro preset de Vite. Cuando se hace bien, es una adición sin dolor a la típica SPA que mejora enormemente la experiencia del usuario, y nuestro plugin de prerenderizado tiene como objetivo facilitar exactamente eso.

## ¿Qué es el Prerenderizado?

"Prerenderizado" (Prerendering), para el contexto de este post, es el acto de generar HTML desde tu aplicación en tiempo de compilación (build time) usando renderizado del lado del servidor (SSR); a veces esto también puede referirse como generación de sitios estáticos (SSG).

Aunque no profundizaremos en las virtudes del SSR aquí, ni argumentaremos que debas usarlo, generalmente es ventajoso enviar un documento HTML completamente poblado al usuario en la navegación inicial (y tal vez en navegaciones posteriores también, dependiendo de la estrategia de enrutamiento) en lugar de un "shell" vacío en el que el JS del lado del cliente eventualmente renderizará. Los usuarios obtendrán acceso al documento más rápido y pueden comenzar a usar la página (aunque, a menudo con funcionalidad reducida) mientras el JS todavía se está descargando en segundo plano.

## Nuestra Historia en el Espacio

Desde que Preact-CLI llegó a su lanzamiento público allá por mayo de 2017, el prerenderizado integrado ha sido un pilar en nuestras herramientas de compilación; felizmente lo llevamos adelante en WMR en 2020 y fue algo que nosotros y los miembros de la comunidad extrañamos mucho cuando cambiamos a sugerir Vite.

Si bien cada iteración ha sido un poco diferente, todas se han construido alrededor de la misma idea central: los usuarios adoptarán más fácilmente el prerenderizado cuanto más simple sea de configurar, incluyendo cambios limitados en su base de código existente. En Preact-CLI, esto significaba proporcionar una exportación predeterminada del componente raíz con algunos datos JSON para poblarlo; en WMR y ahora en Vite, significa exportar una función simple `prerender()` que devuelve el HTML para la ruta, con el prerenderizador recorriendo la aplicación por sí mismo, reemplazando la necesidad de JSON por adelantado.

Cualquiera que haya trabajado extensamente con SSR a escala sabe que hay una montaña de complejidad que nunca se puede abstraer completamente y no argumentaríamos lo contrario. Sin embargo, casi cada SPA proporciona una mejor experiencia si está prerenderizada y por eso queremos subir a bordo a tantos usuarios como sea posible -- reducir la barrera de entrada ha demostrado ser tremendamente exitoso en nuestra comunidad, por lo que ha sido una parte clave de nuestra filosofía de diseño apuntar a que sea lo más "drop-in" (de integración inmediata) posible.

## Ecosistema Vite Existente

Antes de crear nuestra propia implementación de prerenderizado para nuestro preset de Vite, echamos un vistazo al ecosistema existente de Vite para ver qué se ofrecía, pero no encontramos exactamente lo que buscábamos con las opciones. El prerenderizado es mejor cuando es lo más cercano posible a "drop-in", tomando tu aplicación existente, con mínima modificación, y generando HTML a partir de ella, pero las soluciones existentes estaban un paso más lejos de "drop-in" de lo que nos hubiera gustado y caían en dos categorías principales:

1. Múltiples Compilaciones (Builds)
	 - Compilaciones separadas cliente/servidor, a menudo puntos de entrada separados también.
	 - Menos isomórfico, diferentes ramas en tu aplicación para diferentes entornos.

2. Frameworks / Envoltorios de Vite
	 - Ya no usan Vite directamente sino una abstracción.
	 - Cierta cantidad de compromiso/bloqueo (lock-in).
	 - La matriz de soporte para diferentes opciones de configuración de Vite, plugins, etc., puede ser complicada y menos que clara.

Si bien estas soluciones tienen absolutamente sus méritos y lugares en el ecosistema, ninguna se sentía tan genial como podrían ser para nuestro ecosistema, dadas nuestras ofertas históricas en esta área. La DX (Experiencia de Desarrollador) del "mejor escenario" a menudo se sacrificaba por necesidades más complejas o específicas -- lo cual es un intercambio completamente válido.

Para el prerenderizado "drop-in", sin embargo, pensamos que podíamos proporcionar algo un poco diferente a las opciones existentes, o al menos algo un poco más familiar para nuestros usuarios.

## Implementación en `@preact/preset-vite`

Años después, todavía estábamos bastante enamorados de la simplicidad y extensibilidad del prerenderizado de WMR y sentíamos que faltaba mucho en nuestro preset de Vite, así que buscamos portarlo con unos pocos ajustes menores para arreglar las dudas que teníamos. Un poco de trabajo después y ¡voilà, prerenderizado vía plugin!

Para empezar, aquí hay un ejemplo de prerenderizado de una aplicación "Hola Mundo".

> Pista: Nuestro inicializador de Vite, (`$ npm create preact`) puede configurar esto por ti junto con algunas otras opciones complementarias, como enrutamiento, TypeScript, etc. Si estás interesado en probar nuestro prerenderizado, es la forma más rápida de ponerte al día.

En primer lugar, habilita el prerenderizado configurando `prerender: { enabled: true }` en las opciones del plugin `@preact/preset-vite`:

```diff
// vite.config.js
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		preact({
+			prerender: { enabled: true }
		}),
	],
});
```

...luego agrega un atributo `prerender` al script que contiene nuestra función `prerender()` -- esto le permite al plugin saber dónde encontrarlo. Aunque puedes configurar esto en cualquier script que desees, para nuestros ejemplos aquí, siempre estará en la raíz de nuestra aplicación.

```diff
// index.html
-<script type="module" src="/src/index.jsx"></script>
+<script prerender type="module" src="/src/index.jsx"></script>
```

...finalmente, haz un par de ajustes a la raíz de nuestra aplicación:

1. Cambiar `render` a `hydrate`

	 - `hydrate` de `preact-iso` es una utilidad muy pequeña que decide si renderizar la aplicación o hidratarla dependiendo de si puede encontrar marcado existente en el documento. En desarrollo usará `render`, pero en producción, con HTML prerenderizado, usará `hydrate`.
	 - Necesitamos agregar una verificación de ventana (`typeof window !== undefined`) para asegurar que no estamos intentando acceder a `document`, un global del navegador, en Node durante el SSR.

2. Agregar nuestra exportación `prerender()`
   - Este es el facilitador del prerenderizado, y es totalmente controlado por el usuario. Tú decides cómo debe renderizarse tu aplicación, qué props pasar a tu componente raíz, hacer cualquier ajuste al HTML, ejecutar cualquier post-procesamiento que desees, etc. Todo lo que el plugin necesita es que se devuelva un objeto conteniendo una propiedad `html` con tu cadena HTML.
   - Para nuestros ejemplos aquí usaremos `prerender` de `preact-iso` que es un envoltorio delgado alrededor de `renderToStringAsync` de `preact-render-to-string` con una ventaja principal: recolecta y devuelve automáticamente los enlaces relativos que encuentra en las páginas que prerenderizas. El plugin de prerenderizado puede entonces usar estos enlaces para "recorrer" tu aplicación, descubriendo páginas por sí mismo. Mostraremos esto más adelante.

```diff
// src/index.jsx
-import { render } from 'preact';
+import { hydrate, prerender as ssr } from 'preact-iso';

function App() {
    return <h1>Hello World!</h1>
}

-render(<App />, document.getElementById('app'));
+if (typeof window !== 'undefined') {
+	hydrate(<App />, document.getElementById('app'));
+}

+export async function prerender(data) {
+    return await ssr(<App {...data} />)
+}
```

Con esto configurado, tendrás una aplicación que se prerenderiza. Sin embargo, ninguna aplicación es realmente tan simple, así que veamos un par de ejemplos más complejos.

### Ejemplo de API Completa

```jsx
// src/index.jsx

// ...

export async function prerender(data) {
	const { html, links: discoveredLinks } = ssr(<App />);

	return {
		html,
		// Optionally add additional links that should be
		// prerendered (if they haven't already been -- these will be deduped)
		links: new Set([...discoveredLinks, '/foo', '/bar']),
		// Optionally configure and add elements to the `<head>` of
		// the prerendered HTML document
		head: {
			// Sets the "lang" attribute: `<html lang="en">`
			lang: 'en',
			// Sets the title for the current page: `<title>My cool page</title>`
			title: 'My cool page',
			// Sets any additional elements you want injected into the `<head>`:
			//   <link rel="stylesheet" href="foo.css">
			//   <meta property="og:title" content="Social media title">
			elements: new Set([
				{ type: 'link', props: { rel: 'stylesheet', href: 'foo.css' } },
				{
					type: 'meta',
					props: { property: 'og:title', content: 'Social media title' }
				}
			])
		}
	};
}
```

### Fetch de Contenido Isomórfico con Fetching basado en Suspense

```jsx
// src/use-fetch.js
import { useState } from 'preact/hooks';

const cache = new Map();

async function load(url) {
	const res = await fetch(url);
	if (res.ok) return await res.text();
	throw new Error(`Failed to fetch ${url}!`);
}

// Mecanismo de fetch basado en suspenso simple con Caching
export function useFetch(url) {
	const [_, update] = useState({});

	let data = cache.get(url);
	if (!data) {
		data = load(url);
		cache.set(url, data);
		data.then(
			res => update((data.res = res)),
			err => update((data.err = err))
		);
	}

	if (data.res) return data.res;
	if (data.err) throw data.err;
	throw data;
}
```

```jsx
// src/index.jsx
import { hydrate, prerender as ssr } from 'preact-iso';
import { useFetch } from './use-fetch.js';

function App() {
	return (
		<div>
			<Suspense fallback={<p>Loading...</p>}>
				<Article />
			</Suspense>
		</div>
	);
}

function Article() {
	const data = useFetch('/my-local-article.txt');
	return <p>{data}</p>;
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}
```

### Usando `globalThis` para pasar datos

```js
// src/title-util.js
import { useEffect } from 'preact/hooks';

/**
 * Set `document.title` or `globalThis.title`
 * @param {string} title
 */
export function useTitle(title) {
	if (typeof window === 'undefined') {
		globalThis.title = createTitle(title);
	}
	useEffect(() => {
		if (title) {
			document.title = createTitle(title);
		}
	}, [title]);
}
```

```jsx
// src/index.jsx
import {
	LocationProvider,
	Router,
	hydrate,
	prerender as ssr
} from 'preact-iso';

import { useTitle } from './title-util.js';

function App() {
	return (
		<LocationProvider>
			<main>
				<Home path="/" />
				<NotFound default />
			</main>
		</LocationProvider>
	);
}

function Home() {
	useTitle('Preact - Home');
	return <h1>Hello World!</h1>;
}

function NotFound() {
	useTitle('Preact - 404');
	return <h1>Page Not Found</h1>;
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	const { html, links } = await ssr(<App {...data} />);

	return {
		html,
		links,
		head: {
			title: globalThis.title,
			elements: new Set([
				{
					type: 'meta',
					props: { property: 'og:title', content: globalThis.title }
				}
			])
		}
	};
}
```

Aunque es una necesidad menos común, también puedes usar una variación de este patrón para inicializar y pasar datos de prerenderizado profundamente en tu aplicación, omitiendo la necesidad de un store/contexto global.

```jsx
// src/some/deep/Component.jsx
function MyComponent({ myFetchData }) {
	const [myData, setMyData] = useState(myFetchData || 'some-fallback');
	...
}
```

```js
let initialized = false;
export async function prerender(data) {
    const init = async () => {
        const res = await fetch(...);
        if (res.ok) globalThis.myFetchData = await res.json();

        initialized = true;
    }
    if (!initialized) await init();

    const { html, links } = await ssr(<App {...data} />);
    ...
}
```

---

Para los curiosos que preguntan "¿Cómo funciona todo esto?", se puede desglosar en tres pasos simples:

1. Configuración

	 Configuramos el script con tu función `prerender()` exportada como una entrada adicional y le decimos a Rollup que preserve las firmas de entrada, permitiéndonos acceder y llamar a esa función después de la compilación.

2. Compilación (Build)

	 Dejamos que Vite compile tu aplicación como de costumbre: compilando JSX, ejecutando plugins, optimizando assets, etc.

3. Prerenderizado

   Durante la etapa del plugin `generateBundle`, comenzamos a generar el HTML. Comenzando con `/`, empezamos a ejecutar los bundles JS compilados en Node, llamando a tu función `prerender()` e insertando el HTML que devuelve en tu documento `index.html`, finalmente escribiendo el resultado en el directorio de salida especificado. Cualquier enlace nuevo que tu función `prerender()` devuelva se encola para ser procesado a continuación.

	 El prerenderizado se completa cuando nos quedamos sin URLs para retroalimentar a tu aplicación.

	 Siguiendo esto, Vite continuará finalizando el proceso de compilación, ejecutando cualquier otro plugin que puedas tener. Tu aplicación prerenderizada estará entonces disponible inmediatamente, sin necesidad de compilaciones o scripts posteriores.

### Algunas Características Geniales

- Implementación de `fetch()` basada en sistema de archivos (como se muestra en el ejemplo de "Fetching Isomórfico")
  - Antes de que corras a buscar tu antorcha, ¡escúchanos! Durante el prerenderizado (y solo durante el prerenderizado) parcheamos `fetch()` para permitir leer archivos directamente del sistema de archivos. Esto te permite consumir archivos estáticos (texto, JSON, Markdown, etc.) durante el prerenderizado sin tener que iniciar un servidor para consumirlo. Puedes usar las mismas rutas de archivo durante el prerenderizado que usarás en el navegador.
   - De hecho, ¡así es como construimos la misma página que estás leyendo! `fetch('/content/blog/preact-prerender.json')`, que es lo que se activa cuando navegas a esta página, se traduce aproximadamente a `new Response(await fs.readFile('/content/blog/preact-prerender.json'))` durante el prerenderizado. Leemos el archivo, lo envolvemos en una `Response` para imitar una solicitud de red, y lo suministramos de vuelta a tu aplicación -- tu aplicación puede usar la misma solicitud `fetch()` durante el prerenderizado y en el cliente. - Combinar esto con suspense y una implementación de SSR asíncrona proporciona una DX realmente genial.
- Rastreo de Enlaces
	 - Parcialmente soportado por la exportación de la función `prerender()` proporcionada por el usuario, parcialmente por el plugin, puedes devolver un conjunto de enlaces al prerenderizar la página (`preact-iso` hace esto maravillosamente simple) que se agregarán a la lista de URLs del plugin para prerenderizar. Esto permitirá al plugin rastrear tu sitio en tiempo de compilación, encontrando más y más páginas para prerenderizar naturalmente.
	 - También puedes proporcionar enlaces manualmente a través de las opciones del plugin o adjuntando algunos a los que `preact-iso` devuelve, como mostramos arriba en el Ejemplo de API Completa. Esto es especialmente útil para páginas de error, como un `/404`, que podrían no estar enlazadas pero que aún así quieres tener prerenderizadas.

...y quizás la mayor ventaja:

- Alternarlo cambiando un Booleano en tu archivo de configuración
	 - Porque no somos un envoltorio, y porque no necesitas alterar tu código fuente para soportarlo (más allá de algunas verificaciones de ventana), no hay bloqueo (lock-in) alguno. Si decides alejarte, o quieres hacer algunas pruebas en tu salida, todo lo que necesitas hacer es cambiar un Booleano y vuelves a una SPA plana con Vite.
	 - Como hemos mencionado un par de veces, el prerenderizado es mejor cuando es lo más cercano posible a "drop-in" y eso incluye ser capaz de salir por capricho. Es importante para nosotros que puedas ir de una SPA al prerenderizado y viceversa con un esfuerzo mínimo.

## Notas Finales

Al equipo de Vite probablemente le gustaría que mencionáramos que este plugin introduce un pequeño parche al código del cliente generado, y que ellos (el equipo de Vite) no necesariamente respaldan la ejecución de los bundles del navegador en Node.

El parche en cuestión es el siguiente:

```diff
// src/node/plugins/importAnalysisBuild.ts
-if (__VITE_IS_MODERN__ && deps && deps.length > 0) {,
+if (__VITE_IS_MODERN__ && deps && deps.length > 0 && typeof window !== 'undefined') {,
	 const links = document.getElementsByTagName('link')
	 ...
```

Como intentar ejecutar `document.getElementsByTagName` dará error en Node donde no hay `document`, simplemente agregamos una condición adicional al precargador para que no intente ejecutarse en Node, y eso es todo. Solo el cambio parcial de esta línea que tendría poco propósito durante el prerenderizado de todos modos.

Estamos muy, muy contentos con este nivel de riesgo y lo hemos estado usando intensamente durante algún tiempo sin ningún problema, pero, esto es de alguna manera usar la herramienta más allá de para lo que fue diseñada y es algo que queremos revelar.

Para cualquier usuario que no sea de Preact, buenas noticias: ¡nuestro plugin es completamente agnóstico del framework! Para hacerlo ligeramente más fácil de usar en cualquier otro framework, esto se ofrece alternativamente como [`vite-prerender-plugin`](https://www.google.com/search?q=%5Bhttps://npm.im/vite-prerender-plugin%5D(https://npm.im/vite-prerender-plugin)). La misma funcionalidad, y mantenida en sincronía con `@preact/preset-vite`, pero elimina las otras utilidades específicas de Preact que se envían en el plugin del preset de Preact.
