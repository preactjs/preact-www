---
title: Componentes
description: Los componentes son el corazón de cualquier aplicación Preact. Aprende a crearlos y úsalos para componer UIs juntos
translation_by:
  - Ezequiel Mastropietro
---

# Componentes

Los componentes representan el bloque de construcción básico en Preact. Son fundamentales para hacer que sea fácil construir UIs complejas a partir de pequeños bloques de construcción. También son responsables de adjuntar estado a nuestra salida renderizada.

Hay dos tipos de componentes en Preact, que hablaremos en esta guía.

---

<toc></toc>

---

## Componentes Funcionales

Los componentes funcionales son funciones simples que reciben `props` como primer argumento. El nombre de la función **debe** comenzar con una letra mayúscula para que funcionen en JSX.

```jsx
// --repl
import { render } from 'preact';

// --repl-before
function MyComponent(props) {
	return <div>My name is {props.name}.</div>;
}

// Uso
const App = <MyComponent name="John Doe" />;

// Renderiza: <div>My name is John Doe.</div>
render(App, document.body);
```

> Nota: en versiones anteriores se conocían como `"Componentes sin Estado"`. Esto ya no es cierto con el [addon de hooks](/guide/v10/hooks).

## Componentes de Clase

Los componentes de clase pueden tener estado y métodos de ciclo de vida. Estos últimos son métodos especiales que se llamarán cuando un componente se adjunte al DOM o se destruya, por ejemplo.

Aquí tenemos un componente de clase simple llamado `<Clock>` que muestra la hora actual:

```jsx
// --repl
import { Component, render } from 'preact';

// --repl-before
class Clock extends Component {
	constructor() {
		super();
		this.state = { time: Date.now() };
	}

	// Ciclo de vida: Llamado cuando nuestro componente es creado
	componentDidMount() {
		// update time every second
		this.timer = setInterval(() => {
			this.setState({ time: Date.now() });
		}, 1000);
	}

	// Ciclo de vida: Llamado justo antes de que nuestro componente sea destruido
	componentWillUnmount() {
		// Se detiene cuando no es renderizable
		clearInterval(this.timer);
	}

	render() {
		let time = new Date(this.state.time).toLocaleTimeString();
		return <span>{time}</span>;
	}
}
// --repl-after
render(<Clock />, document.getElementById('app'));
```

### Métodos de Ciclo de Vida

Para hacer que la hora del reloj se actualice cada segundo, necesitamos saber cuándo se adjunta `<Clock>` al DOM. _Si has usado HTML5 Custom Elements, esto es similar a los métodos de ciclo de vida `attachedCallback` y `detachedCallback`._ Preact invoca los siguientes métodos de ciclo de vida si están definidos para un Componente:

| Método de ciclo de vida                                    | Cuándo se llama                                                                                                          |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `componentWillMount()`                                     | (deprecado) antes de que el componente se adjunte al DOM                                                                 |
| `componentDidMount()`                                      | después de que el componente se adjunte al DOM                                                                           |
| `componentWillUnmount()`                                   | antes de la eliminación del DOM                                                                                         |
| `componentWillReceiveProps(nextProps, nextContext)`        | antes de que se acepten las nuevas props _(deprecado)_                                                                   |
| `getDerivedStateFromProps(nextProps, prevState)`           | justo antes de `shouldComponentUpdate`. Devuelve objeto para actualizar estado o `null` para omitir actualización.       |
| `shouldComponentUpdate(nextProps, nextState, nextContext)` | antes de `render()`. Devuelve `false` para omitir render                                                                 |
| `componentWillUpdate(nextProps, nextState, nextContext)`   | antes de `render()` _(deprecado)_                                                                                         |
| `getSnapshotBeforeUpdate(prevProps, prevState)`            | se llama justo después de `render()`, pero antes de que los cambios se vacíen en el DOM. El valor es pasado a `componentDidUpdate`. |
| `componentDidUpdate(prevProps, prevState, snapshot)`       | después de `render()`                                                                                                    |

Aquí hay una descripción visual de cómo se relacionan entre sí (publicado originalmente en [un tweet](https://web.archive.org/web/20191118010106/https://twitter.com/dan_abramov/status/981712092611989509) por Dan Abramov):

![Diagram of component lifecycle methods](/guide/components-lifecycle-diagram.png)

### Límites de Error (Error Boundaries)

Un límite de error es un componente que implementa `componentDidCatch()` o el método estático `getDerivedStateFromError()` (o ambos). Estos son métodos especiales que te permiten capturar cualquier error que ocurra durante el renderizado y se usan típicamente para proporcionar mensajes de error más elegantes u otro contenido alternativo y guardar información para propósitos de logging. Es importante notar que los límites de error no pueden capturar todos los errores y los que se lanzan en manejadores de eventos o código asíncrono (como una llamada `fetch()`) necesitan ser manejados por separado.

Cuando se captura un error, podemos usar estos métodos para reaccionar a cualquier error y mostrar un mensaje de error bonito o cualquier otro contenido alternativo.

```jsx
// --repl
import { Component, render } from 'preact';
// --repl-before
class ErrorBoundary extends Component {
	constructor() {
		super();
		this.state = { errored: false };
	}

	static getDerivedStateFromError(error) {
		return { errored: true };
	}

	componentDidCatch(error, errorInfo) {
		errorReportingService(error, errorInfo);
	}

	render(props, state) {
		if (state.errored) {
			return <p>Something went badly wrong</p>;
		}
		return props.children;
	}
}
// --repl-after
render(<ErrorBoundary />, document.getElementById('app'));
```

## Fragmentos

Un `Fragment` te permite devolver múltiples elementos a la vez. Resuelven la limitación de JSX donde cada "bloque" debe tener un único elemento raíz. Frecuentemente los encontrarás en combinación con listas, tablas o con CSS flexbox donde cualquier elemento intermedio afectaría de otra manera al estilo.

```jsx
// --repl
import { Fragment, render } from 'preact';

function TodoItems() {
	return (
		<Fragment>
			<li>A</li>
			<li>B</li>
			<li>C</li>
		</Fragment>
	);
}

const App = (
	<ul>
		<TodoItems />
		<li>D</li>
	</ul>
);

render(App, container);
// Renders:
// <ul>
//   <li>A</li>
//   <li>B</li>
//   <li>C</li>
//   <li>D</li>
// </ul>
```

Ten en cuenta que la mayoría de transpiladores modernos te permiten usar una sintaxis más corta para `Fragments`. La más corta es mucho más común y es la que típicamente encontrarás.

```jsx
// Esto:
const Foo = <Fragment>foo</Fragment>;
// ...es lo mismo que esto:
const Bar = <>foo</>;
```

También puedes devolver arrays de tus componentes:

```jsx
function Columns() {
	return [<td>Hello</td>, <td>World</td>];
}
```

No olvides añadir keys a `Fragments` si los creas en un bucle:

```jsx
function Glossary(props) {
	return (
		<dl>
			{props.items.map(item => (
				// Sin una key, Preact tiene que adivinar qué elementos han
				// cambiado al re-renderizar.
				<Fragment key={item.id}>
					<dt>{item.term}</dt>
					<dd>{item.description}</dd>
				</Fragment>
			))}
		</dl>
	);
}
```
