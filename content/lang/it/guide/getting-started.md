---
name: Getting Started
permalink: '/guide/getting-started'
---

# Primi passi

In qursta guida vedremo come creare un semplice componente "Orologio". Informazioni più dettagliate su ogni singolo argomento sono disponibili nel menù Guida.

> :information_desk_person: [Non è necessario utilizzare ES2015 per usare Preact ](https://github.com/developit/preact-without-babel)... ma dovresti!. In questa guida si presuppone tu abbia un qualsiasi tipo di configurazione per buildare ES2015, utilizzando Babel e/o webpack/browserify/gulp/grunt/etc. Se non la hai puoi iniziare da qui  [preact-boilerplate] o qui [Template de CodePen](http://codepen.io/developit/pen/pgaROe?editors=0010).

---


## Importa ciò che ti serve
Il modulo `preact` fornisce sia esportazioni  `named` sia `default`, così puoi importare tutto sotto il namespace o solo quello di cui hai bisogno come variabili locali: 

**Named:**

```js
import { h, render, Component } from 'preact';

// Indica a Babel di trasformare JSX in chiamate alla funzione h():
/** @jsx h */
```

**Default:**

```js
import preact from 'preact';

// Indica a Babel di trasformare JSX in chiamate alla funzione preact.h():
/** @jsx preact.h */
```
> I `named imports` funzionano bene per applicazioni fortemente strutturate, mentre quella il `defaul export` è il metodo più veloce e non necessita di essere aggiornato quando si usano diverse parti della libreria

**Usare Preact da CDN:**

```html
<script src="https://cdn.jsdelivr.net/npm/preact/dist/preact.min.js"></script>

<!-- Per caricare Preact come JS Module: -->
<script src="https://cdn.jsdelivr.net/npm/preact/dist/preact.mjs" type="module"></script>
```

### Global pragma

Al posto di dichiarare il pragma di `@jsx` nel tuo codice, il metodo migliore è configurarlo globalmente nel file `.babelrc`

**Named:**
>**Per Babel 5 e versioni precedenti:**
>
> ```json
> { "jsxPragma": "h" }
> ```
>
> **Par Babel 6:**
>
> ```json
> {
>   "plugins": [
>     ["transform-react-jsx", { "pragma":"h" }]
>   ]
> }
> ```

**Default:**
>**Per Babel 5 e versioni precedenti:**
>
> ```json
> { "jsxPragma": "preact.h" }
> ```
>
> **Par Babel 6:**
>
> ```json
> {
>   "plugins": [
>     ["transform-react-jsx", { "pragma":"preact.h" }]
>   ]
> }
> ```

---


## Interpretare  il JSX

Pronto per l'uso, Preact fornisce una funzione `h()` che converte il tuo JSX come elementi del Virtual DOM _([Vedi come fa nel dettaglio](http://jasonformat.com/wtf-is-jsx))_. Preact fornisce anche una funzione chiamata `render()` che crea un albero DOM partendo dal Virtual DOM citato precedentemente.

Per Interpretare JSX basta solamente importare queste due funzioni e usarle in questo modo:

```js
import { h, render } from 'preact';

render((
	<div id="foo">
		<span>Hello, world!</span>
		<button onClick={ e => alert("Hola!") }>Cliccami!</button>
	</div>
), document.body);
```

Ti potrà sembrare facile e intuitivo se hai utiliazzato in precedenza [hyperscript] o alcuni dei suoi [molti amici](https://github.com/developit/vhtml).


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
