---
name: Getting Started
permalink: '/guide/getting-started'
---

# Primeros pasos

En esta guía vamos a ver cómo crear un simple componente de "Reloj". Puedes encontrar información más detallada para cada tema dentro del menú de Guía.

> :information_desk_person: [No es necesario utilizar ES2015 para poder usar Preact](https://github.com/developit/preact-without-babel)... pero deberías hacerlo. Esta guía asume que cuentas con algún tipo de configuración compatible con ES2015 usando Babel y/o webpack/browserify/gulp/grunt/etc. Si no la tienes, comienza con [preact-boilerplate] o un [Template de CodePen](http://codepen.io/developit/pen/pgaROe?editors=0010).

---


## Importa lo que necesitas

El módulo de `preact` provee tanto `named` como `default` exports, por lo que puedes importar todo bajo un namespace o sólo lo que necesitas como variables locales:

**Named:**

```js
import { h, render, Component } from 'preact';

// Indica a Babel tranforme las llamadas de la función h() a JSX:
/** @jsx h */
```

**Default:**

```js
import preact from 'preact';

// Indica a Babel tranforme las llamadas de la función preact.h() a JSX:
/** @jsx preact.h */
```

> Los `named imports` funcionan bien en aplicaciones fuertemente estructuradas, mientras que el default export es más veloz y nunca necesita ser actualizado al utilizar diferentes partes de la librería.

### Global pragma

En lugar de declarar el `@jsx` pragma en tu código, es mejor configurarlo globalmente en un archivo `.babelrc`.

**Named:**
>**Para Babel 5 y versiones anteriores:**
>
> ```json
> { "jsxPragma": "h" }
> ```
>
> **Para Babel 6:**
>
> ```json
> {
>   "plugins": [
>     ["transform-react-jsx", { "pragma":"h" }]
>   ]
> }
> ```

**Default:**
>**Para Babel 5 y versiones anteriores:**
>
> ```json
> { "jsxPragma": "preact.h" }
> ```
>
> **Para Babel 6:**
>
> ```json
> {
>   "plugins": [
>     ["transform-react-jsx", { "pragma":"preact.h" }]
>   ]
> }
> ```

---


## Renderizado de JSX

Por defecto, Preact provee una función `h()` que convierte tu JSX a elementos de Virtual DOM _([así es como lo hace](http://jasonformat.com/wtf-is-jsx))_. También provee una función `render()` que crea un DOM tree a partir de ese Virtual DOM.

Para renderizar JSX solo basta con importar esas dos funciones y utilizarlas de la siguiente manera:

```js
import { h, render } from 'preact';

render((
	<div id="foo">
		<span>Hello, world!</span>
		<button onClick={ e => alert("Hola!") }>Presioname</button>
	</div>
), document.body);
```


Esto debería parecerte bastante sencillo si has utilizado [hyperscript] o alguno de sus [muchos amigos](https://github.com/developit/vhtml).

Sin embargo, renderizar hyperscript con un Virtual DOM no tiene sentido. Queremos renderizar componentes y actualizarlos cuando los datos sean modificados - es ahí donde el poder del diffing de Virtual DOM brilla. :star2:


---


## Componentes

Preact exporta una clase generica `Component`, la cual puede ser extendida para construir piezas de una Interfaz de Usuario encapsuladas y auto-actualizables. Estos Componentes soportan todos los [lifecycle methods] de React, como por ejemplo `shouldComponentUpdate()` y `componentWillReceiveProps()`. Proporcionar implementaciones especificas de estos métodos es el mecanismo preferido para controlar _cómo_ y _cuándo_ los componentes son actualizados.

Los componentes también tienen un método `render()`, pero a diferencia de React este método recibe `(props, state)` como argumentos. Esto provee una manera ergonómica de desestructurar `props`y `state` en variables locales para ser referenciadas por JSX.

Hechemos un vistazo a un simple componente de `Reloj`, el cual muestra la hora actual.

```js
import { h, render, Component } from 'preact';

class Reloj extends Component {
	render() {
		let time = new Date().toLocaleTimeString();
		return <span>{ time }</span>;
	}
}

// renderiza una instancia de Reloj en el <body>:
render(<Reloj />, document.body);
```


Genial! Correr esto produce la siguiente estructura de HTML:

```html
<span>10:28:57 PM</span>
```


---


## Ciclo de vida de los Componentes

Para lograr que el tiempo de reloj sea actualizado cada segundo, necesitamos saber cuándo `<Reloj>` es montado en el DOM. _Si ya has utilizado HTML5 Custom Elements, esto es similar a los métodos de ciclo de vida `attachedCallback` y `detachedCallback`._ Preact invoca a los siguientes métodos de ciclo de vida cuando son definidos para un Componente.


| Lifecycle method            | Cuándo son llamados                                          |
|-----------------------------|--------------------------------------------------------------|
| `componentWillMount`        | previo a que el componente sea montado en el DOM             |
| `componentDidMount`         | luego de que el componente es montado en el DOM              |
| `componentWillUnmount`      | previo a la eliminación del componente del DOM               |
| `componentWillReceiveProps` | previo a que nuevas props sean aceptadas                     |
| `shouldComponentUpdate`     | previo a `render()`. Devuelve `false` para evitar el render  |
| `componentWillUpdate`       | previo a `render()`                                          |
| `componentDidUpdate`        | luego de `render()`                                          |



Entonces, queremos tener un temporizador de 1 segundo que comienza cuando el Componente es agregado al DOM, y finaliza si es removido. Crearemos el temporizador y almacenaremos una referencia a él en `componentDidMount`, y finalizaremos el temporizador en `componentWillUnmount`. Para cada tic del temporizador, actualizaremos el `state` del objeto del componente con un nuevo tiempo. Al hacer esto, el componente será re-renderizado de forma automática.

```js
import { h, render, Component } from 'preact';

class Reloj extends Component {
	constructor() {
		super();
		// configuramos tiempo inicial:
		this.state.tiempo = Date.now();
	}

	componentDidMount() {
		// actualizar el tiempo cada un segundo
		this.temporizador = setInterval(() => {
			this.setState({ tiempo: Date.now() });
		}, 1000);
	}

	componentWillUnmount() {
		// finalizar cuando no es renderizable
		clearInterval(this.temporizador);
	}

	render(props, state) {
		let tiempo = new Date(state.tiempo).toLocaleTimeString();
		return <span>{ tiempo }</span>;
	}
}

// renderizamos una instancia de Reloj en <body>:
render(<Reloj />, document.body);
```


---


Ahora sí: tenemos [un reloj](http://jsfiddle.net/developit/u9m5x0L7/embedded/result,js/)!



[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[hyperscript]: https://github.com/dominictarr/hyperscript
