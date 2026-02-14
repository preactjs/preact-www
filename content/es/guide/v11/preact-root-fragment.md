---
title: preact-root-fragment
description: Una implementación independiente y heredada de Preact 10+ del parámetro deprecado `replaceNode` de Preact 10
translation_by:
  - Ezequiel Mastropietro
---

# preact-root-fragment

preact-root-fragment es una implementación independiente y más flexible de Preact 10+ del parámetro deprecado `replaceNode` de Preact 10.

Proporciona una forma de renderizar o hidratar un árbol Preact usando un subconjunto de los hijos dentro del elemento padre pasado a render():

```html
<body>
	<div id="root"> ⬅ pasamos esto a render() como elemento DOM padre...

		<script src="/etc.js"></script>

		<div class="app"> ⬅ ... pero queremos usar este árbol, no el script
			<!-- ... -->
		</div>
	</div>
</body>
```

---

<toc></toc>

---

## ¿Por qué necesito esto?

Esto es particularmente útil para [hidratación parcial](https://jasonformat.com/islands-architecture/), que a menudo requiere renderizar múltiples árboles Preact distintos en el mismo elemento DOM padre. Imagina el escenario de abajo - ¿qué elementos pasaríamos a `hydrate(jsx, parent)` tal que cada `<section>` del widget se hidrate sin interferir con los otros?

```html
<div id="sidebar">
  <section id="widgetA"><h1>Widget A</h1></section>
  <section id="widgetB"><h1>Widget B</h1></section>
  <section id="widgetC"><h1>Widget C</h1></section>
</div>
```

Preact 10 proporcionaba un argumento tercero algo oscuro para `render` e `hydrate` llamado `replaceNode`, que podría ser usado para el caso anterior:

```jsx
render(<A />, sidebar, widgetA); // renderizar en <div id="sidebar">, pero solo mirar <section id="widgetA">
render(<B />, sidebar, widgetB); // lo mismo, pero solo mirar widgetB
render(<C />, sidebar, widgetC); // lo mismo, pero solo mirar widgetC
```

Aunque el argumento `replaceNode` resultó útil para manejar escenarios como el anterior, estaba limitado a un único elemento DOM y no podía acomodar árboles Preact con múltiples elementos raíz. Tampoco manejaba bien las actualizaciones cuando múltiples árboles eran montados en el mismo elemento DOM padre, lo que resulta ser un escenario de uso clave.

En lo sucesivo, proporcionamos esta funcionalidad como una librería independiente llamada `preact-root-fragment`.

## Cómo funciona

`preact-root-fragment` proporciona una función `createRootFragment`:

```ts
createRootFragment(parent: ContainerNode, children: ContainerNode | ContainerNode[]);
```

Llamar a esta función con un elemento DOM padre y uno o más elementos hijo devuelve un "Fragment Persistente". Un fragmento persistente es un elemento DOM falso, que pretende contener los hijos proporcionados mientras los mantiene en su elemento padre real existente. Puede ser pasado a `render()` o `hydrate()` en lugar del argumento `parent`.

Usando el ejemplo anterior, podemos cambiar el uso deprecado `replaceNode` por `createRootFragment`:

```jsx
import { createRootFragment } from 'preact-root-fragment';

render(<A />, createRootFragment(sidebar, widgetA));
render(<B />, createRootFragment(sidebar, widgetB));
render(<C />, createRootFragment(sidebar, widgetC));
```

Ya que estamos creando "Fragmentos Persistentes" padres separados para pasar a cada llamada de `render()`, Preact tratará cada uno como un árbol de DOM Virtual independiente.

## Múltiples Elementos Raíz

A diferencia del parámetro `replaceNode` de Preact 10, `createRootFragment` puede aceptar un Array de hijos que se usarán como los elementos raíz al renderizar. Esto es particularmente útil cuando se renderiza un árbol de DOM Virtual que produce múltiples elementos raíz, como un Fragment o un Array:

```jsx
import { createRootFragment } from 'preact-root-fragment';
import { render } from 'preact';

function App() {
  return (
    <>
      <h1>Example</h1>
      <p>Hello world!</p>
    </>
  );
}

// Usa solo los últimos dos elementos hijo dentro de <body>:
const children = [].slice.call(document.body.children, -2);

render(<App />, createRootFragment(document.body, children));
```

## Soporte de versiones de Preact

Esta librería funciona con Preact 10 y 11.