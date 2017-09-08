---
name: Tipos de Componentes
permalink: '/guide/types-of-components'
---

# Tipos de Componentes


Há 2 tipos de componentes no Preact:
- Componentes Clássicos, com [métodos do ciclo de vida] e estado
- Componentes Funcionais Sem Estado, que são funções que aceitam `props` e retornam JSX.

Dentro desses dois tipos, há também algumas maneiras diversas de implementar-se um componente,


## Exemplo

Vamos usar um exemplo: um componente simples `<Link>` que cria um elemento HTML `<a>`:

```js
class Link extends Component {
	render(props, state) {
		return <a href={props.href}>{ props.children }</a>;
	}
}
```

Podemos instanciar/renderizar esse componente como segue:

```xml
<Link href="http://example.com">Algum Texto</Link>
```


### Destructurar `Props` & `State`

Visto que isso é ES6 / ES2015, podemos simplificar ainda mais nosso componente `<Link>` por mapear as chaves de `props` (o primeiro argumento passado pra `render()`) para variáveis locais usando [destructuring](https://github.com/lukehoban/es6features#destructuring):

```js
class Link extends Component {
	render({ href, children }) {
		return <a {...{ href, children }} />;
	}
}
```

Se quiséssemos copiar _todas_ as `props` passadas para o componente `<Link>` para o elemento `<a>`, poderíamos utilizar o [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator):

```js
class Link extends Component {
	render(props) {
		return <a {...props} />;
	}
}
```


### Componentes Funcionais Sem Estado

Por último, podemos ver que esse componente não tem estado - podemos renderizá-lo com as mesmas `props` e receberemos o mesmo resultado todas as vezes.
Quando isso é o caso, é geralmente melhor utilizar um Componente Funcional Sem Estado. Esses são apenas funções que aceitam `props` como argumento e retornam JSX.

```js
const Link = ({ children, ...props }) => (
	<a {...props}>{ children }</a>
);
```

> *Nota de ES2015:* o acima é uma _Arrow Function_ , e porque nós utilizamos parênteses ao invés de chaves, o valor dentro dos parênteses é automaticamente retornado. Você pode ler mais sobre isso [aqui](https://github.com/lukehoban/es6features#arrows).

[métodos do ciclo de vida]: /guide/lifecycle-methods
