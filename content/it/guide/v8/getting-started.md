---
name: Getting Started
permalink: '/guide/getting-started'
---

# Primi passi

In questa guida vedremo come creare un semplice componente "Orologio". Informazioni più dettagliate su ogni singolo argomento sono disponibili nel menù Guida.

> :information_desk_person: [Non è necessario utilizzare ES2015 per usare Preact ](https://github.com/developit/preact-without-babel)... ma dovresti!. In questa guida si presuppone tu abbia un qualsiasi tipo di configurazione per buildare ES2015, utilizzando Babel e/o webpack/browserify/gulp/grunt/etc. Se non la hai puoi iniziare da qui  [preact-boilerplate] o qui [Template de CodePen](http://codepen.io/developit/pen/pgaROe?editors=0010).

---

<div><toc></toc></div>

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


Renderizzare hyperscript con il DOM virtuale è di per sé inutile, però... Noi vogliamo renderizzare i componenti ed averli aggiornati quando i dati cambiano - è qui che si vede la risplendente potenza del DOM virtuale.

---


## Componenti

Preact esporta una generica classe `Component`, la quale può essere estesa per costruire pezzi incapsulanti ed auto-aggiornanti di un'interfaccia utente. Questi Componenti supportano tutti i [lifecycle methods](#ciclo-di-vita-dei-componenti) di React, come per 
esempio `shouldComponentUpdate()` e `componentWillReceiveProps()`. Fornire implementazioni specifiche di questi metodi è il meccanismo preferito per controllare l'aggiornamento dei componenti _when_ e _how_.

I componenti dispongono anche di un metodo chiamato `render()`, però a differenza di react questo metodo riceve `(props, state)` come argomenti. Questo fornisce un efficace metodo per destrutturare `props` e `state` in variabili locali per poterle referienziare da JSX.

Diamo un occhiata ad un semplice componente `Orologio`, che mostra l'ora corrente.

```js
import { h, render, Component } from 'preact';

class Orologio extends Component {
	render() {
		let time = new Date().toLocaleTimeString();
		return <span>{ time }</span>;
	}
}

// renderiza una instancia de Reloj en el <body>:
render(<Orologio />, document.body);
```
Fantastico, L'esecuzione del codice soprastante produrrà la seguente struttura HTML:

```html
<span>10:28:57 PM</span>
```


---


## Ciclo di vita dei componenti

Per far si che l'ora dell'Orologio si aggiorni ogni secondo, abbiamo bisogno di sapere quando `<Orologio>` viene montato nel DOM. _Se hai usato gli HTML5 Custom Element, questo potrebbe essere simili ai metodi `attachedCallback` e `detachedCallback` del ciclo di vita._
Preact invoca i seguenti metodi del ciclo di vita se sono definiti per un Componente:

| Metodi del ciclo di vita    | Cuándo son llamados                                          |
|-----------------------------|--------------------------------------------------------------|
| `componentWillMount`        | Prima che il componente venga montato nel DOM                |
| `componentDidMount`         | Dopo che il componente viene montato nel DOM                 |
| `componentWillUnmount`      | Prima che il componente venga rimosso dal DOM                |
| `componentWillReceiveProps` | Prima che nuove props vengano accettate                      |
| `shouldComponentUpdate`     | Prima di `render()`. Ritornare `false` per evitare il render |
| `componentWillUpdate`       | Prima di `render()`                                          |
| `componentDidUpdate`        | Dopo `render()`                                              |


Così, noi vogliamo avere un timer da un secondo che inizi quando il componente viene aggiunto al DOM, e si fermi quando esso quest'ultimo viene rimosso. Creeremo il timer e memorizzeremo un riferimento ad esso in `componentDidMount`, e fermeremo il timer in `componentWillUnmount`. Su ogni tick del timer, aggiorneremo l'oggetto `state` del componente con il nuovo valore dell'ora. In questo modo, il nuovo componente verrà automaticamente sottoposto a rendering.


```js
import { h, render, Component } from 'preact';

class Orologio extends Component {
	constructor() {
		super();
		// Configuriamo l'ora iniziale:
		this.state.ora = Date.now();
	}

	componentDidMount() {
		// aggiorna il tempo ogni secondo
		this.timer = setInterval(() => {
			this.setState({ tiempo: Date.now() });
		}, 1000);
	}

	componentWillUnmount() {
		// Fermarlo quando non è èiù renderizzabile
		clearInterval(this.timer);
	}

	render(props, state) {
		let ora = new Date(state.ora).toLocaleTimeString();
		return <span>{ ora }</span>;
	}
}

// Renderizziamo un istanza dell'Orologio nel <body>:
render(<Orologio />, document.body);
```


---


Ora abbiamo un bellissimo [Orologio](http://jsfiddle.net/developit/u9m5x0L7/embedded/result,js/)!



[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[hyperscript]: https://github.com/dominictarr/hyperscript
