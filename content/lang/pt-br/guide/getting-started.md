---
name: Como começar
permalink: '/guide/getting-started'
---

# Como Começar

Aqui, você será guiado a criar um componente simples de relógio contador. Informações mais detalhadas de cada tópico podem ser encontradas nas páginas dedicadas sobre o menu "Guide".


> :information_desk_person: Você [não _tem_ de usar ES2015 para usar Preact](https://github.com/developit/preact-without-babel)... mas deveria.
Esse guia assume que você tem algum tipo de build ES2015 configurado utilizando Babel e/ou webpack/browserify/gulp/grunt/etc. Se você não tem, inicie com o [preact-boilerplate] ou um [template do CodePen ](http://codepen.io/developit/pen/pgaROe?editors=0010).

---


## Importe o que você precisa

O módulo `preact` provê ambos os exports nomeados e `default`, portanto você pode tanto importar tudo sobre um _namespace_ de sua escolha, ou apenas o que precisa como variáveis locais:


**Nomeado:**

```js
import { h, render, Component } from 'preact';

// Dizendo ao Babel pra transformar JSX em chamadas h():
/** @jsx h */
```

**Default:**

```js
import preact from 'preact';

// Dizendo ao Babel pra transformar JSX em chamadas h():
/** @jsx h */
```
> _Imports_ nomeados funcionam bem com aplicações altamente estruturadas, enquanto o _import default_ é rápido e nunca precisa ser atualizado quando se utilizam partes diferentes da biblioteca.

### Pragma global

Ao invés de declarar o _pragma_  `@jsx` no seu código, é melhor configurá-lo em um arquivo `.babelrc`

**Nomeado:**
>**Para Babel 5 e anteriores:**
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
>**Para Babel 5 e anteriores:**
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


## Renderizando JSX

De forma imediata, Preact provê uma função `h()` que transforma seu JSX em elementos Virtual DOM _([leia como aqui](http://jasonformat.com/wtf-is-jsx))_. Também provê uma função `render()` que cria uma árvore DOM a partir da Virtual DOM.

Para renderizar JSX, apenas importe tais funções e use-as assim:

```js
import { h, render } from 'preact';

render((
	<div id="foo">
		<span>Olá, mundo!</span>
		<button onClick={ e => alert("oi!") }>Clique aqui</button>
	</div>
), document.body);
```

Isso deve parecer muito familiar se você já utilizou [hyperscript] ou um de seus [muitos amigos](https://github.com/developit/vhtml).

Renderizar hyperscript com o virtual DOM é desnecessário, no entanto. Queremos renderizar componentes e atualizá-los quando os dados mudarem - É aí que o poder da comparação com o Virtual DOM brilha. 🌟

---


## Componentes

Preact exporta uma classe genérica `Componente`, que pode ser extendida para construir pedaços auto-atualizáveis e encapsulados de Interface de Usuário. Componentes suportam todo os [métodos do ciclo de vida] padrão do React, como `shouldComponentUpdate()` e `componentWillReceiveProps()`. Prover implementações específicas para esses métodos é a maneira recomendada para controlar _quando_ e _como_ os componentes atualizam.

Componentes também tem um método `render()`, mas diferente do React esse método recebe `(props, state)` como argumentos. Isso provê uma maneira ergonômica para desestruturar  `props` e `state` em variáveis locais para serem referenciadas a partir do JSX.

Vamos dar uma olhada em um componente `Clock` bem simples, que mostra o o tempo atual.


```js
import { h, render, Component } from 'preact';

class Clock extends Component {
	render() {
		let time = new Date().toLocaleTimeString();
		return <span>{ time }</span>;
	}
}

// renderiza uma instância de Clock em <body>:
render(<Clock />, document.body);
```

Isso é ótimo. Rodar esse código produz a seguinte estrutura HTML.

```html
<span>10:28:57 PM</span>
```


---


## Ciclo de Vida de Componentes

De modo a ter o tempo do Relógio atualizado a cada segundo, precisamos saber quando `<Clock>` é montado no DOM. _Caso você já tenha utilizado HTML5 Custom Elements, isso é similar aos métodos de ciclo de vida `attachedCallback` e `detachedCallback`._ Preact invoca os seguintes métodos do ciclo de vida se os mesmos estiverem definidos para um Componente.


| Métodos do Ciclo de Vida    | Quando é chamado                                 							|
|-----------------------------|---------------------------------------------------------------|
| `componentWillMount`        | antes do componente ser montado no DOM 			     							|
| `componentDidMount`         | depois do componente ser montado no DOM    			 							|
| `componentWillUnmount`      | antes da remoção do Componente do DOM 					 							|
| `componentWillReceiveProps` | antes das novas props serem aceitas 						 						 	|
| `shouldComponentUpdate`     | antes de `render()`. Retorne `false` para pular a renderização|
| `componentWillUpdate`       | antes de `render()`                              							|
| `componentDidUpdate`        | depois de `render()`                             							|


Então, queremos ter um timer de 1-segundo que inicie uma vez que o Componente seja adicionado ao DOM, e que pare quando o mesmo é removido.
Iremos criar o timer e guardar uma referência para ele em `componentDidMount`, e pará-lo em `componentWillUnmount`. Em cada _tick_ do timer, iremos atualizar o objeto `state` do Componente com um novo valor de tempo. Fazer isso irá automaticamente re-renderizar o componente.

```js
import { h, render, Component } from 'preact';

class Clock extends Component {
	constructor() {
		super();
		// definir o tempo inicial
		this.state.time = Date.now();
	}

	componentDidMount() {
		// Atualizar o timer a cada segundo
		this.timer = setInterval(() => {
			this.setState({ time: Date.now() });
		}, 1000);
	}

	componentWillUnmount() {
		// Parar quando não for renderizável
		clearInterval(this.timer);
	}

	render(props, state) {
		let time = new Date(state.time).toLocaleTimeString();
		return <span>{ time }</span>;
	}
}

// renderiza uma instância de `Clock` em `<body>`
render(<Clock />, document.body);
```


---

Agora temos um [relógio contador](http://jsfiddle.net/developit/u9m5x0L7/embedded/result,js/)!



[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[hyperscript]: https://github.com/dominictarr/hyperscript
