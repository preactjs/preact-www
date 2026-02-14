---
title: Hooks de Opción
description: Preact tiene varios hooks de opción que te permiten adjuntar callbacks a varias etapas del proceso de diffing
---

# Hooks de Opción

Callbacks para plugins que pueden cambiar la renderización de Preact.

Preact soporta una serie de callbacks diferentes que pueden ser usados para observar o cambiar cada etapa del proceso de renderizado, comúnmente referido como "Hooks de Opción" (no confundir con [hooks](/guide/v10/hooks)). Estos se usan frecuentemente para extender el conjunto de características de Preact mismo, o para crear herramientas de prueba especializadas. Todos nuestros addons como `preact/hooks`, `preact/compat` y nuestra extensión devtools se basan en estos callbacks.

Esta API está principalmente destinada a autores de herramientas o librerías que deseen extender Preact.

---

<toc></toc>

---

## Versionado y Soporte

Los Hooks de Opción se envían en Preact, y como tal están semanticamente versionados. Sin embargo, no tienen la misma política de deprecación, lo que significa que las versiones principales pueden cambiar la API sin un período de anuncio extendido antes del lanzamiento. Esto también es cierto para la estructura de APIs internas expuestas a través de Hooks de Opción, como objetos `VNode`.

## Estableciendo Hooks de Opción

Puedes establecer Hooks de Opción en Preact modificando el objeto exportado `options`.

Cuando defines un hook, siempre asegúrate de llamar a un hook previamente definido con ese nombre si había uno. Sin esto, la cadena de llamadas se romperá y el código que depende del hook previamente instalado se romperá, resultando en que addons como `preact/hooks` o DevTools dejen de funcionar. Asegúrate de pasar los mismos argumentos al hook original, también - a menos que tengas una razón específ ica para cambiarlos.

```js
import { options } from 'preact';

// Almacena hook anterior
const oldHook = options.vnode;

// Configura tu propio hook de opciones
options.vnode = vnode => {
	console.log("Hey I'm a vnode", vnode);

	// Llama al hook definido previamente si lo hubiera.
	if (oldHook) {
		oldHook(vnode);
	}
};
```

Ninguno de los hooks actualmente disponibles excluyendo `options.event` tienen valores de retorno, por lo que el manejo de valores de retorno del hook original no es necesario.

## Hooks de Opción Disponibles

#### `options.vnode`

**Firma:** `(vnode: VNode) => void`

El Hook de Opción más común, `vnode` se invoca siempre que se crea un objeto VNode. VNodes son la representación de Preact de elementos de DOM Virtual, comúnmente pensados como "Elementos JSX".

#### `options.unmount`

**Firma:** `(vnode: VNode) => void`

Invocado inmediatamente antes de que un vnode sea desmontado, cuando su representación de DOM aún está asociada.

#### `options.diffed`

**Firma:** `(vnode: VNode) => void`

Invocado inmediatamente después de que un vnode sea renderizado, una vez que su representación de DOM se construye o transforma al estado correcto.

#### `options.event`

**Firma:** `(event: Event) => any`

Invocado justo antes de que un evento de DOM sea manejado por su escucha virtual de DOM asociado. Cuando `options.event` está establecido, el evento que es el argumento del escucha de eventos se reemplaza con el valor de retorno de `options.event`.

#### `options.requestAnimationFrame`

**Firma:** `(callback: () => void) => void`

Controla la programación de efectos y funcionlidad basada en efectos en `preact/hooks`.

#### `options.debounceRendering`

**Firma:** `(callback: () => void) => void`

Una función de "aplazamiento" de tiempo que se usa para procesar cambios por lotes en la cola de renderizado global de componentes.

Por defecto, Preact usa un `setTimeout` de duración cero.

#### `options.useDebugValue`

**Firma:** `(value: string | number) => void`

Llamado cuando el hook `useDebugValue` en `preact/hooks` es llamado.
