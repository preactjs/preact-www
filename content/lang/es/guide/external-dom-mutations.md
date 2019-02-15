---
name: Mutaciones externas del DOM
permalink: '/guide/external-dom-mutations'
---

# Mutaciones externas del DOM


## Introducción

A veces existe la necesidad de trabajar con librerías de terceros que esperan tener la libertad de mutar el DOM a piacere, persistir estado en él, o que no tienen límites de componentes. Hay excelentes UI toolkits o elementos reusables que operan de esta manera. En Preact (y de manera similar en React), trabajando con este tipo de librerías requiere que le digas al algoritmo de rendering/diffing del Virtual DOM que no debe intentar _volver atrás_ cualquier mutación external del DOM realizada dentro de un Componente específico (o el elemento del DOM que representa).


## Técnica

Esto puede ser tan simple como definir un método `shouldComponentUpdate()` en tu componente, y haciendolo retornar siempre `false`:

```js
class Block extends Component {
  shouldComponentUpdate() {
    return false;
  }
}
```

... o más corto:

```js
class Block extends Component {
  shouldComponentUpdate = () => false;
}
```

Con este gancho en el ciclo de vida y diciendole a Preact que no re-dibuje el componente cuando hay cambios en el árbol del VDOM, tu componente ahora tiene una referencia a su elemento de DOM raíz que puede ser tratado como estático hasta que el componente es desmontado. Como con cualquier otro componente, su referencia es llamada `this.base`, y corresponde a la raíz del elemento JSX que fue retornado de `render()`.

---

## Paso a paso de ejemplo

Este es un ejemplo de como "apagar" el redibujo de un componente. Notemos que `render()` sigue siendo invocado como parte de la creación y montado del componente, en orden de generar la estructura inicial del DOM.

```js
class Example extends Component {
  shouldComponentUpdate() {
    // no re-dibujar vía diff:
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // acá puedes hacer algo con las props entrantes si lo necesitas
  }

  componentDidMount() {
    // ahora montado puedes modificar libremente el DOM:
    let thing = document.createElement('maybe-a-custom-element');
    this.base.appendChild(thing);
  }

  componentWillUnmount() {
    // el componente será removido del DOM, realiza cualquier limpieza
  }

  render() {
    return <div class="example" />;
  }
}
```


## Demostración

[![demo](https://i.gyazo.com/a63622edbeefb2e86d6c0d9c8d66e582.gif)](https://www.webpackbin.com/bins/-KflCmJ5bvKsRF8WDkzb)

[**View this demo on Webpackbin**](https://www.webpackbin.com/bins/-KflCmJ5bvKsRF8WDkzb)


## Ejemplos de la vida real

Alternativamente, puedes ver esta técnica en acción en [preact-token-input](https://github.com/developit/preact-token-input/blob/master/src/index.js) - usa un componente como un foothold en el DOM, luego lo desactiva y deja que [tags-input](https://github.com/developit/tags-input) tome el rumbo más tarde.  Un ejemplo más complejo es [preact-richtextarea](https://github.com/developit/preact-richtextarea), que usa esta técnica para evitar redibujar un `<iframe>` editable.
