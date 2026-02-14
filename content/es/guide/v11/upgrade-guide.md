---
title: Actualizar desde Preact 10.x
description: Actualiza tu aplicación Preact 10.x a Preact 11
translation_by:
  - Ezequiel Mastropietro
---

# Actualizar desde Preact 10.x

Preact 11 tiene como objetivo ser una actualización con cambios de ruptura mínimos desde Preact 10.x, lo que nos permite aumentar las versiones de los navegadores a los que nos dirigimos y limpiar parte del código heredado. Para la mayoría de los usuarios, esta actualización debería ser sencilla y rápida, con solo unos pocos cambios que pueden requerir atención.

Este documento está destinado a guiarte a través de la actualización de una aplicación existente de Preact 10.x a Preact 11. Cubre los cambios de ruptura y los pasos para asegurar una transición fluida.

---

<toc></toc>

---

## Preparando tus aplicaciones

### Versiones de Navegadores Soportadas

Preact 11.x soportará los siguientes navegadores sin polyfills adicionales:

- Chrome >= 40
- Safari >= 9
- Firefox >= 36
- Edge >= 12

Si necesitas soportar versiones de navegadores más antiguas, necesitarás usar polyfills.

### Versiones TypeScript Soportadas

TS v5.1 será la versión mínima soportada nueva para la línea de lanzamiento 11.x. Si estás en una versión anterior, por favor actualiza antes de actualizar a Preact 11.

Aumentar nuestra versión mínima de TS nos permite aprovechar algunas mejoras clave que el equipo de TS ha hecho para tipificación JSX, arreglando un puñado de problemas de tipo de larga data y fundamentales que no pudimos abordar nosotros mismos.

### Los Bundles ESM se distribuyen como `.mjs`

Preact 11.x distribuirá todos los paquetes (bundles) ESM con la extensión `.mjs`, eliminando las copias `.module.js` que proporcionaba la versión 10.x. Esto debería solucionar algunos problemas con las herramientas que han experimentado algunos usuarios, además de simplificar los paquetes de distribución.

Los paquetes CJS y UMD seguirán proporcionándose y sin cambios.

## Qué hay de nuevo

### Hidratación 2.0

Preact 11 introduce algunas mejoras significativas al proceso de hidratación, particularmente alrededor de la suspensión de componentes. Mientras que Preact X tenía limitaciones que requerían a los usuarios siempre devolver exactamente 1 nodo DOM por límite asincrónico, Preact 11 permite 0 o 2+ nodos DOM, permitiendo diseños de componentes más flexibles.

Los siguientes ejemplos ahora son válidos en Preact 11:

```jsx
function X() {
  // Alguna operación perezosa, como inicializar análisis
  return null;
};

const LazyOperation = lazy(() => /* import X */);
```

```jsx
function Y() {
  // `<Fragment>` desaparece al renderizar, dejando dos elementos `<p>` DOM
  return (
    <Fragment>
      <p>Foo</p>
      <p>Bar</p>
    </Fragment>
  );
};

const SuspendingMultipleChildren = lazy(() => /* import Y */);
```

Para una descripción más completa de los problemas conocidos y cómo los hemos abordado, consulta [RFC: Hidratación 2.0 (preactjs/preact#4442)](https://github.com/preactjs/preact/issues/4442)

### `Object.is` para verificaciones de igualdad en argumentos de hook

Preact 11 usa `Object.is` para verificaciones de igualdad en argumentos de hook, alineándose más estrechamente con el comportamiento de React. Es decir, esto ahora soporta el uso de `NaN` como un valor de estado o dependencia de `useEffect`/`useMemo`/`useCallback`.

En Preact 10, el siguiente ejemplo se volvería a renderizar cada vez que se hace clic en el botón, mientras que en Preact 11, no lo hará:

```jsx
import { useState, useEffect } from 'preact/hooks';

function App() {
	const [count, setCount] = useState(0);

	return <button onClick={() => setCount(NaN)}>Establecer contador a NaN</button>;
}
```

## Cambios de API

### Las referencias se reenvían por defecto

Las referencias ahora se reenvían por defecto, lo que permite usarlas como cualquier otra propiedad. Ya no necesitarás usar `forwardRef` de `preact/compat` para disponer de esta funcionalidad.

```jsx
function MyComponent({ ref }) {
	return <h1 ref={ref}>¡Hola, mundo!</h1>;
}

<MyComponent ref={myRef} />;
// Preact 10: myRef.current es una instancia de MyComponent
// Preact 11: myRef.current es el elemento <h1> DOM
```

> **Nota**: Al usar `preact/compat`, las referencias no se reenviarán a los componentes de clase. React solo reenvía las referencias a los componentes de función, por lo que emulamos ese comportamiento para cualquiera que use la capa de compatibilidad.
>
> Para los usuarios de Preact puro, **las referencias se reenviarán** a los componentes de clase, al igual que a los componentes de función.

Si necesitas continuar usando el comportamiento anterior, puedes usar el siguiente fragmento para revertir al comportamiento de Preact 10:

```js
import { options } from 'preact';

const oldVNode = options.vnode;
options.vnode = (vnode) => {
    if (vnode.props.ref) {
        vnode.ref = vnode.props.ref;
        delete vnode.props.ref;
    }

	if (oldVNode) oldVNode(vnode);
}
```

### Mover el sufijo automático `px` para propiedades de estilo a `preact/compat`

Preact 11 ha movido el sufijo automático `px` para los valores de estilo numéricos del núcleo a `preact/compat`.

```jsx
<h1 style={{ height: 500 }}>¡Hola Mundo!</h1>
// Preact 10: <h1 style="height:500px">¡Hola Mundo!</h1>
// Preact 11: <h1 style="height:500">¡Hola Mundo!</h1>
```

### Mover el soporte de `defaultProps` a `preact/compat`

Esto se ha movido a `preact/compat` ya que se utiliza menos comúnmente hoy en día debido al auge de los componentes funcionales y los hooks.

### Eliminar el parámetro `replaceNode` de `render()`

El tercer parámetro opcional de `render()` se ha eliminado en Preact 11, ya que existían numerosos errores y casos excepcionales en la implementación, además de algunos casos de uso clave que no podía acomodar correctamente.

Si esto es algo que todavía necesitas, proporcionamos una implementación independiente compatible con Preact 10 a través del paquete [`preact-root-fragment`](https://github.com/preactjs/preact-root-fragment).

```html
<div id="root">
	<section id="widgetA"><h1>Widget A</h1></section>
	<section id="widgetB"><h1>Widget B</h1></section>
	<section id="widgetC"><h1>Widget C</h1></section>
</div>
```

```jsx
// Preact 10
import { render } from 'preact';

render(<App />, root, widgetC);

// Preact 11
import { render } from 'preact';
import { createRootFragment } from 'preact-root-fragment';

render(<App />, createRootFragment(root, widgetC));
```

### Eliminar la propiedad `Component.base`

Estamos eliminando `Component.base` ya que siempre se ha sentido como si filtrara la salida del DOM conectado al Componente.

Si todavía necesitas esto, puedes acceder al DOM con `this.__v.__e`; `.__v` es una propiedad ofuscada que se refiere al VNode asociado con el componente, y `.__e` es el nodo DOM asociado a ese VNode.

### Eliminar `SuspenseList` de `preact/compat`

La implementación y el soporte para el renderizado en el lado del servidor siempre han sido un poco confusos e incompletos, por lo que hemos optado por eliminarlo.

### Tipos

#### `useRef` requiere un valor inicial

De forma similar al cambio realizado en React 19, hemos cambiado la firma del tipo `useRef` para que requiera un valor inicial. Proporcionar un valor inicial simplifica parte de la inferencia de tipos y ayuda a los usuarios a evitar algunos problemas de tipado.

#### Reducción en el espacio de nombres `JSX`

TypeScript utiliza el espacio de nombres especial `JSX` para alterar cómo se tipifica e interpreta JSX. En la versión 10, ampliamos enormemente este espacio de nombres para incluir una variedad de tipos útiles, pero muchos de estos se implementan mejor en el espacio de nombres `preact`.

A partir de Preact 11, el espacio de nombres `JSX` solo contendrá los tipos que TS requiere, como `Element`, `IntrinsicElements`, etc., y el resto se moverá al espacio de nombres `preact`. Esto también debería ayudar a los editores e IDEs al resolver tipos para las sugerencias de auto-importación.

```ts
 // Preact 10
import { JSX } from 'preact';

type MyCustomButtonProps = JSX.ButtonHTMLAttributes & { ... }

// Preact 11
import { ButtonHTMLAttributes } from 'preact';

type MyCustomButtonProps = ButtonHTMLAttributes & { ... }
```
