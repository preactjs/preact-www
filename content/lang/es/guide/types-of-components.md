---
name: Types of Components
permalink: '/guide/types-of-components'
---

# Tipos de Componentes


Hay dos tipos de componentes en Preact:

- Componentes clásicos, con [métodos de ciclo de vida] y estado
- Componentes funcionales sin estado, que son funciones que reciben `props` y devuelven [JSX].

Dentro de estos dos tipos, también hay diferentes maneras de implementar componentes.


## Ejemplo

Supongamos que tenemos un componente `<Link>` que crea un elemento `<a>` de HTML:

```js
class Link extends Component {
	render(props, state) {
		return <a href={props.href}>{ props.children }</a>;
	}
}
```

Podemos instanciar/renderizar este componente de la siguiente manera:

```xml
<Link href="http://example.com">Some Text</Link>
```


### Destructurar Props y State

Debido a ES6 / ES2015 podemos simplificar, aún más, nuestro componente `<Link>`, pasando solamente las `props` (el primer argumento de `render()`) que necesitamos a variables locales usando [destructuring](https://github.com/lukehoban/es6features#destructuring):

```js
class Link extends Component {
	render({ href, children }) {
		return <a {...{ href, children }} />;
	}
}
```

Si quisiéramos copiar _todas_ las `props`, que le pasamos a nuestro componente `<Link>` dentro del elemento `<a>` podemos usar el [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator):

```js
class Link extends Component {
	render(props) {
		return <a {...props} />;
	}
}
```


### Componentes Funcionales Sin Estado

Por último, podemos ver como este componente no tiene estado - por lo que cada vez que lo renderizemos con las mismas `props`, siempre vamos a obtener el mismo resultado. Cuando este sea el caso, es mejor utilizar Componentes Funcionales Sin Estado. Estos componentes son funciones que simplemente reciben `props` como un argumento, y devuelven JSX.

```js
const Link = ({ children, ...props }) => (
	<a {...props}>{ children }</a>
);
```

> *ES2015 Nota:* en el ejemplo anterior se utiliza una [Arrow Function](https://github.com/lukehoban/es6features#arrows), y debido a que estamos usando paréntesis en vez de llaves para el cuerpo de la función, el valor entre los paréntesis se devuelve automaticamente. Puedes leer más sobre esto [aquí](https://github.com/lukehoban/es6features#arrows).
