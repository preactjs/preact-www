---
title: Renderizado en el Servidor
description: Renderiza tu aplicación Preact en el servidor para mostrar contenido a los usuarios más rápidamente
translation_by:
  - Ezequiel Mastropietro
---

# Renderizado en el Servidor

El Renderizado en el Servidor (a menudo abreviado como "SSR") te permite renderizar tu aplicación a una cadena HTML que puede ser enviada al cliente para mejorar el tiempo de carga. Fuera de eso hay otros escenarios, como pruebas, donde SSR demuestra ser realmente útil.

---

<toc></toc>

---

## Instalación

El renderizador del lado del servidor para Preact se encuentra en su [propio repositorio](https://github.com/preactjs/preact-render-to-string/) y se puede instalar a través del empaquetador que prefieras:

```bash
npm install -S preact-render-to-string
```

Una vez finalizado el comando anterior, podemos empezar a utilizarlo inmediatamente.

## Cadenas HTML

Ambas las siguientes opciones devuelven una sola cadena HTML que representa la salida completa renderizada de tu aplicación Preact.

### renderToString

El método de renderización más básico y directo, `renderToString` transforma un árbol Preact en una cadena de HTML de forma sincrónica.

```jsx
import { renderToString } from 'preact-render-to-string';

const name = 'Preact User!';
const App = <div class="foo">Hello {name}</div>;

const html = renderToString(App);
console.log(html);
// <div class="foo">Hello Preact User!</div>
```

### renderToStringAsync

Espera la resolución de promesas antes de devolver la cadena HTML completa. Esto es particularmente útil cuando se utiliza suspense para componentes cargados perezosamente u obtención de datos.

```jsx
// app.js
import { Suspense, lazy } from 'preact/compat';

const HomePage = lazy(() => import('./pages/home.js'));

function App() {
	return (
		<Suspense fallback={<p>Loading</p>}>
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
// <h1>Home page</h1>
```

## Flujos HTML

Streaming es un método de renderización que te permite enviar partes de tu aplicación Preact al cliente a medida que estén listas en lugar de esperar a que se complete todo el render.

### renderToPipeableStream

`renderToPipeableStream` es un método de transmisión que utiliza [Node.js Streams](https://nodejs.org/api/stream.html) para renderizar tu aplicación. Si no estás usando Node, deberías buscar [renderToReadableStream](#rendertoreadablestream) en su lugar.

```jsx
import { renderToPipeableStream } from 'preact-render-to-string/stream-node';

// La sintaxis del manejador de solicitud y la forma variarán entre frameworks
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
				`<!doctype html><p>An error ocurred:</p><pre>${error.message}</pre>`
			);
		}
	});

	// Abandonar y cambiar a renderizado del cliente si pasa suficiente tiempo.
	setTimeout(abort, 2000);
}
```

### renderToReadableStream

`renderToReadableStream` es otro método de transmisión y similar a `renderToPipeableStream`, pero diseñado para su uso en entornos que soportan [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) estándares en su lugar.

```jsx
import { renderToReadableStream } from 'preact-render-to-string/stream';

// La sintaxis del manejador de solicitud y la forma variarán entre frameworks
function handler(req, res) {
	const stream = renderToReadableStream(<App />);

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/html'
		}
	});
}
```

## Personalizar Salida de Renderizador

Ofrecemos varias opciones a través del módulo `/jsx` para personalizar la salida del renderizador para un puñado de casos de uso populares.

### Modo JSX

El modo de renderización JSX es especialmente útil si estás haciendo cualquier tipo de prueba de snapshot. Renderiza la salida como si estuviera escrita en JSX.

```jsx
import renderToString from 'preact-render-to-string/jsx';

const App = <div data-foo={true} />;

const html = renderToString(App, {}, { jsx: true });
console.log(html);
// <div data-foo={true} />
```

### Modo Pretty

Si necesitas obtener el resultado renderizado de una manera más amigable para el usuario, ¡te tenemos cubierto! Al pasar la opción `pretty`, preservaremos espacios en blanco e indentaremos la salida como se espera.

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

### Modo Shallow

Para algunos propósitos a menudo es preferible no renderizar todo el árbol, sino solo un nivel. Para eso tenemos un renderizador shallow que imprimirá componentes hijo por nombre en lugar de su valor de retorno.

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

### Modo XML

Para elementos sin hijos, el modo XML los renderizará como etiquetas autocierre.

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
