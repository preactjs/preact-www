---
name: Actualización desde Preact 8.x
description: 'Actualice su aplicación Preact 8.x a Preact X'
---

# Actualización desde Preact 8.x

Este documento pretende guiarle en la actualización de una aplicación Preact 8.x existente a Preact X y se divide en 3 secciones principales

Preact X trae muchas nuevas y excitantes características como `Fragments`, `hooks` y una compatibilidad mejorada con el ecosistema React. Tratamos de mantener los cambios de última hora al mínimo posible, pero no pudimos eliminarlos todos por completo sin comprometer nuestro conjunto de características.

---

<div><toc></toc></div>

---

## Actualización de dependencias

_Note: A lo largo de esta guía usaremos el cliente `npm` y los comandos deberían ser fácilmente aplicables a otros gestores de paquetes como `yarn`._

Comencemos Primero instala Preact X:

```bash
npm install preact
```

Debido a que compat se ha movido al núcleo, ya no hay necesidad de `preact-compat`. Elimínelo con:

```bash
npm remove preact-compat
```

### Actualización de las bibliotecas relacionadas con preact

Para garantizar un ecosistema estable para nuestros usuarios (especialmente para nuestros usuarios empresariales) hemos lanzado importantes actualizaciones de las librerías relacionadas con Preact X. Si estás usando `preact-render-to-string` necesitas actualizarlo a la versión que funciona con X.

| Library                   | Preact 8.x | Preact X |
| ------------------------- | ---------- | -------- |
| `preact-render-to-string` | 4.x        | 5.x      |
| `preact-router`           | 2.x        | 3.x      |
| `preact-jsx-chai`         | 2.x        | 3.x      |
| `preact-markup`           | 1.x        | 2.x      |

### Compat ha pasado al núcleo

Para hacer que las librerías React de terceros funcionen con Preact enviamos una capa de **compatibilidad** que puede ser importada a través de `preact/compat`. Anteriormente estaba disponible como un paquete separado, pero para facilitar la coordinación lo hemos movido al repositorio principal. Así que tendrás que cambiar las declaraciones de importación o alias existentes de `preact-compat` a `preact/compat` (fíjate en la barra).

Tenga cuidado de no cometer errores ortográficos. Uno común parece ser escribir `compact` en lugar de `compat`. Si tienes problemas con eso, piensa en `compat` como la capa de `compatibilidad` para react. De ahí viene el nombre.

> Si estás usando `preact-cli` este paso ya está hecho por ti :tada:

### Bibliotecas de terceros

Debido a la naturaleza de los cambios de última hora, es posible que algunas bibliotecas existentes dejen de funcionar con X. La mayoría de ellas ya se han actualizado siguiendo nuestro calendario beta, pero es posible que te encuentres con alguna en la que no sea así.

#### preact-redux

`preact-redux` es una de esas librerías que aún no ha sido actualizada. La buena noticia es que `preact/compat` es mucho más compatible con React y funciona con los enlaces React llamados `react-redux`. Cambiando a él se resolverá la situación. Asegúrate de que has aliaseado `react` y `react-dom` a `preact/compat` en tu empaquetador.

1. Elimine `preact-redux`
2. Instale `react-redux`

#### mobx-preact

Debido a nuestra mayor compatibilidad con el ecosistema react, este paquete ya no es necesario. Utilice `mobx-react` en su lugar.

1. Elimine `mobx-preact`
2. Instale `mobx-react`

#### styled-components

Preact 8.x sólo funcionaba hasta `styled-components@3.x`. Con Preact X esta barrera ya no existe y trabajamos con la última versión de `styled-components`. Asegúrese de que ha [aliased react to preact](/guide/v10/getting-started#aliasing-react-to-preact) correctamente.

#### preact-portal

El componente `Portal` forma parte ahora de `preact/compat`.

1. Elimine `preact-portal`
2. Import `createPortal` from `preact/compat`

## Preparar el código

### Uso de exportaciones con nombre

Para mejorar el soporte de tree-shaking ya no incluimos una exportación `default` en preact core. La ventaja de este enfoque es que sólo el código que necesita se incluirá en su paquete.

```js
// Preact 8.x
import Preact from "preact";

// Preact X
import * as preact from "preact";

// Preferred: Named exports (works in 8.x and Preact X)
import { h, Component } from "preact";
```

_Note: Este cambio no afecta a `preact/compat`. Sigue teniendo un nombre y una exportación por defecto para seguir siendo compatible con react._

### `render()` siempre diferencia los hijos existentes

En Preact 8.x, las llamadas a `render()` siempre añadían los elementos al contenedor.

```jsx
// Marcado existente:
<body>
  <div>hello</div>
</body>

render(<p>foo</p>, document.body);
render(<p>bar</p>, document.body);

// Salida de Preact 8.x:
<body>
  <div>hello</div>
  <p>foo</p>
  <p>bar</p>
</body>
```

Para difundir los hijos existentes en Preact 8, era necesario proporcionar un nodo DOM existente.

```jsx
// Marcado existente:
<body>
  <div>hello</div>
</body>

let element;
element = render(<p>foo</p>, document.body);
element = render(<p>bar</p>, document.body, element);

// Salida de Preact 8.x:
<body>
  <div>hello</div>
  <p>bar</p>
</body>
```

En Preact X, `render()` siempre difiere los hijos DOM dentro del contenedor. Así que si tu contenedor contiene DOM que no ha sido renderizado por Preact, Preact intentará diferenciarlo con los elementos que le pases. Este nuevo comportamiento se asemeja más al de otras librerías VDOM.

```jsx
// Marcado existente:
<body>
  <div>hello</div>
</body>

render(<p>foo</p>, document.body);
render(<p>bar</p>, document.body);

// Salida de Preact 8.x:
<body>
  <p>bar</p>
  <div>hello</div>
</body>
```

Si buscas un comportamiento que coincida exactamente con el funcionamiento del método `render` de React, utiliza el método `render` exportado por `preact/compat`.

### `props.children` no siempre es un `array`

En Preact X ya no podemos garantizar que `props.children` sea siempre de tipo `array`. Este cambio ha sido necesario para resolver ambigüedades en el análisis sintáctico de `Fragments` y componentes que devuelven un `array` de hijos. En la mayoría de los casos no se notará. Sólo en los casos en los que se utilicen métodos de array en `props.children` será necesario utilizar `toChildArray`. Esta función siempre devolverá un array.

```jsx
// Preact 8.x
function Foo(props) {
  // `.length` es un método de array. En Preact X cuando `props.children` no es un
  // array, esta línea lanzará una excepción
  const count = props.children.length;
  return <div>Tengo {count} hijos</div>;
}

// Preact X
import { toChildArray } from "preact";

function Foo(props) {
  const count = toChildArray(props.children).length;
  return <div>Tengo {count} hijos</div>;
}
```

### No accedas a `this.state` de forma sincrónica

En Preact X el estado de un componente ya no será mutado sincrónicamente. Esto significa que la lectura de `this.state` justo después de una llamada a `setState` devolverá los valores anteriores. En su lugar, debe utilizar una función de devolución de llamada para modificar el estado que depende de los valores anteriores.

```jsx
this.state = { counter: 0 };

// Preact 8.x
this.setState({ counter: this.state.counter + 1 });

// Preact X
this.setState(prevState => {
  // Alternativamente devolver `null` aquí para abortar la actualización del estado
  return { counter: prevState.counter + 1 };
});
```

### La función `dangerouslySetInnerHTML` omitirá la difusión de los hijos.

Cuando un `vnode` tiene la propiedad `dangerouslySetInnerHTML` establecida Preact omitirá la difusión de los hijos del `vnode`.

```jsx
<div dangerouslySetInnerHTML="foo">
  <span>Me saltaré</span>
  <p>Yo también</p>
</div>
```

## Notas para los autores de bibliotecas

Esta sección está dirigida a los autores de librerías que mantienen paquetes para ser usados con Preact X. Puedes saltarte esta sección si no estás escribiendo ninguna.

### La forma del `VNode` ha cambiado

Hemos renombrado/movido las siguientes propiedades:

- `attributes` -> `props`
- `nodeName` -> `type`
- `children` -> `props.children`

Por mucho que lo intentábamos, siempre nos encontrábamos con casos extremos con librerías de terceros escritas para react. Este cambio en nuestra forma `vnode` eliminó muchos errores difíciles de detectar y hace que nuestro código `compat` sea mucho más limpio.

### Los nodos de texto adyacentes ya no están unidos

En Preact 8.x teníamos esta función que nos permitía unir notas de texto adyacentes como optimización. Esto ya no es válido para X porque ya no hacemos diferencias directamente contra el dom. De hecho, nos dimos cuenta de que perjudicaba el rendimiento en X y por eso la eliminamos. Tomemos el siguiente ejemplo:

```jsx
// Preact 8.x
console.log(<div>foo{"bar"}</div>);
// Registra una estructura como esta:
//   div
//     text

// Preact X
console.log(<div>foo{"bar"}</div>);
// Registra una estructura como esta:
//   div
//     text
//     text
```
