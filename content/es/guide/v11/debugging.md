---
title: Depuración de Aplicaciones Preact
description: Cómo depurar aplicaciones Preact cuando algo sale mal
---

# Depuración de Aplicaciones Preact

Preact incluye muchas herramientas para facilitar la depuración. Están empaquetadas en una única importación y pueden ser incluidas importando `preact/debug`.

Esto incluye integración con nuestra propia extensión [Preact Devtools] para Chrome y Firefox.

Imprimiremos una advertencia o un error siempre que detectemos algo incorrecto como un anidamiento incorrecto en elementos `<table>`.

---

<toc></toc>

---

## Instalación

La [Preact Devtools] puede ser instalada en la tienda de extensiones de tu navegador.

- [Para Chrome](https://chrome.google.com/webstore/detail/preact-developer-tools/ilcajpmogmhpliinlbcdebhbcanbghmd)
- [Para Firefox](https://addons.mozilla.org/es/firefox/addon/preact-devtools/)
- [Para Edge](https://microsoftedge.microsoft.com/addons/detail/hdkhobcafnfejjieimdkmjaiihkjpmhk)

Una vez instalada, necesitamos importar `preact/debug` en algún lugar para inicializar la conexión con la extensión. Asegúrate de que esta importación sea **la primera** importación en toda tu aplicación.

> `@preact/preset-vite` incluye el paquete `preact/debug` automáticamente. ¡Puedes omitir de forma segura los pasos de configuración y eliminación si lo estás usando!

Aquí hay un ejemplo de cómo puede verse el archivo de entrada principal de tu aplicación.

```jsx
// Debe ser la primera importación
import 'preact/debug';
import { render } from 'preact';
import App from './components/App';

render(<App />, document.getElementById('root'));
```

### Eliminar devtools de la producción

La mayoría de bundlers te permiten eliminar código cuando detectan que una rama dentro de una declaración `if` nunca será golpeada. Podemos usar esto para incluir `preact/debug` solo durante el desarrollo y guardar esos preciosos bytes en una compilación de producción.

```jsx
// Debe ser la primera importación
if (process.env.NODE_ENV === 'development') {
	// Debe usar require aquí ya que las declaraciones de importación solo se pueden
	// existir en el nivel superior.
	require('preact/debug');
}

import { render } from 'preact';
import App from './components/App';

render(<App />, document.getElementById('root'));
```

Asegúrate de establecer la variable `NODE_ENV` al valor correcto en tu herramienta de compilación.

## Depuración de Señales

Si estás usando Preact Signals en tu aplicación, hay herramientas especializadas de depuración disponibles:

- **[Signals Debug](https://github.com/preactjs/signals/blob/main/packages/debug)** - Una herramienta de desarrollo que proporciona una salida detallada de consola sobre actualizaciones de señales, ejecuciones de efectos y recalculos de valores calculados.
- **[Signals DevTools](https://github.com/preactjs/signals/blob/main/packages/devtools-ui)** - Interfaz de usuario visual de DevTools para depurar y visualizar Preact Signals en tiempo real. Puedes incrustarlo directamente en tu página para demostraciones, o integrarlo en herramientas personalizadas.

> **Nota:** Estas son herramientas independientes del framework de la librería de Signals. Aunque funcionan muy bien con Preact, no son específicas de Preact.

## Advertencias y Errores de Depuración

A veces puedes obtener advertencias o errores cuando Preact detecta código inválido. Estos deben ser corregidos para asegurar que tu aplicación funciona sin problemas.

### Padre `undefined` pasado a `render()`

Esto significa que el código está intentando renderizar tu aplicación a nada en lugar de a un nodo DOM. Es la diferencia entre:

```jsx
// Lo que Preact recibió
render(<App />, undefined);

// vs lo que esperó
render(<App />, actualDomNode);
```

La razón principal por la que ocurre este error es que el nodo DOM no está presente cuando se llama a la función `render()`. Asegúrate de que existe.

### Componente `undefined` pasado a `createElement()`

Preact lanzará este error siempre que pases `undefined` en lugar de un componente. La causa común para este es mezclar `default` y exportaciones `named`.

```jsx
// app.js
export default function App() {
	return <div>Hello World</div>;
}

// index.js: Incorrecto, porque `app.js` no tiene una exportación nombrada
import { App } from './app';
render(<App />, dom);
```

El mismo error se lanzará cuando es al revés. Cuando declares una exportación `named` e intentas usarla como exportación `default`. Una forma rápida de comprobar esto (en caso de que tu editor no lo haga ya), es simplemente registrar la importación:

```jsx
// app.js
export function App() {
	return <div>Hello World</div>;
}

// index.js
import App from './app';

console.log(App);
// Registra: { default: [Function] } en lugar del componente
```

### Se pasó un literal JSX como JSX dos veces

Pasar un literal JSX o componente en JSX nuevamente es inválido y disparará este error.

```jsx
const Foo = <div>foo</div>;
// Inválido: Foo ya contiene un Elemento JSX
render(<Foo />, dom);
```

Para arreglar esto, podemos simplemente pasar la variable directamente:

```jsx
const Foo = <div>foo</div>;
render(Foo, dom);
```

### Anidamiento incorrecto de tabla detectado

Los analizadores HTML tienen reglas muy estrictas sobre cómo deben estar estructuradas las tablas, desviándose de las cuales conducirá a errores de renderizado que pueden ser difíciles de depurar. Para ayudarte con esto, Preact puede detectar anidamiento incorrecto en varias situaciones e imprimirá advertencias para detectar esto temprano. Para aprender más sobre cómo deben ser estructuradas las tablas, recomendamos altamente [la documentación de MDN](https://developer.mozilla.org/es/docs/Learn/HTML/Tables/Basics).

> **Nota:** En este contexto, "estricto" se refiere a la _salida_ del analizador HTML, no a la _entrada_. Los navegadores son bastante indulgentes e intentan corregir HTML inválido donde pueden para asegurar que las páginas aún se pueden mostrar. Sin embargo, para librerías VDOM como Preact esto puede llevar a problemas ya que el contenido de entrada podría no coincidir con la salida una vez que el navegador lo ha corregido, del cual Preact no será consciente.
>
> Por ejemplo, los elementos `<tr>` siempre deben ser un hijo de elementos `<tbody>`, `<thead>` o `<tfoot>` por la especificación, pero si escribieras un `<tr>` directamente dentro de una `<table>`, el navegador intentará corregir esto envolviéndolo en un elemento `<tbody>` para ti. Preact esperará por lo tanto que la estructura DOM sea `<table><tr></tr></table>` pero el DOM real construido por el navegador sería `<table><tbody><tr></tr></tbody></table>`.

### Propiedad `ref` inválida

Cuando la propiedad `ref` contiene algo inesperado lanzaremos este error. Esto incluye `refs` basadas en strings que han sido deprecadas hace tiempo.

```jsx
// válido
<div ref={e => {/* ... */)}} />

// válido
const ref = createRef();
<div ref={ref} />

// Inválido
<div ref="ref" />
```

### Manejador de evento inválido

A veces puedes pasar accidentalmente un valor incorrecto a un manejador de evento. Siempre deben ser una `function` o `null` si quieres removerlo. Todos los otros tipos son inválidos.

```jsx
// válido
<div onClick={() => console.log("click")} />

// inválido
<div onClick={console.log("click")} />
```

### Hook solo puede ser invocado desde métodos de render

Este error ocurre cuando intentas usar un hook fuera de un componente. Solo son soportados dentro de un componente de función.

```jsx
// Inválido, debe ser usado dentro de un componente
const [value, setValue] = useState(0);

// válido
function Foo() {
	const [value, setValue] = useState(0);
	return <button onClick={() => setValue(value + 1)}>{value}</button>;
}
```

### Obtener `vnode.[property]` está deprecado

Con Preact X hicimos algunos cambios significativos a nuestra forma interna `vnode`.

| Preact 8.x         | Preact 10.x            |
| ------------------ | ---------------------- |
| `vnode.nodeName`   | `vnode.type`           |
| `vnode.attributes` | `vnode.props`          |
| `vnode.children`   | `vnode.props.children` |

### Se encontraron hijos con la misma key

Un aspecto único de las librerías basadas en virtual-dom es que tienen que detectar cuándo se mueve un hijo. Sin embargo, para saber cuál es cuál, necesitamos marcarlos de alguna forma. _Esto solo es necesario cuando estás creando hijos dinámicamente._

```jsx
// Ambos hijos tendrán la misma key "A"
<div>
	{['A', 'A'].map(char => (
		<p key={char}>{char}</p>
	))}
</div>
```

La forma correcta de hacerlo es darles keys únicas. En la mayoría de los casos, los datos sobre los que estás iterando tendrán alguna forma de `id`.

```jsx
const persons = [
	{ name: 'John', age: 22 },
	{ name: 'Sarah', age: 24 }
];

// En algún lugar más adelante en tu componente
<div>
	{persons.map(({ name, age }) => {
		return (
			<p key={name}>
				{name}, Age: {age}
			</p>
		);
	})}
</div>;
```

[preact devtools]: https://preactjs.github.io/preact-devtools/
