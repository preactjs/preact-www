---
title: Referencia de la API
description: Aprende más sobre todas las funciones exportadas del módulo Preact
translation_by:
  - Ezequiel Mastropietro
---

# Referencia de la API

Esta página sirve como una visión general rápida de todas las funciones exportadas.

---

<toc></toc>

---

## preact

El módulo `preact` proporciona solo la funcionalidad esencial como crear elementos VDOM y renderizar componentes. Utilidades adicionales se proporcionan mediante los distintos submódulos, como `preact/hooks`, `preact/compat`, `preact/debug`, etc.

### Component

`Component` es una clase base que puede ser extendida para crear componentes con estado en Preact.

En lugar de ser instanciados directamente, los componentes son gestionados por el renderizador y creados según sea necesario.

```js
import { Component } from 'preact';

class MyComponent extends Component {
	// (see below)
}
```

#### Component.render(props, state)

Todos los componentes deben proporcionar una función `render()`. La función render recibe las props y el estado actual del componente, y debe devolver un Elemento Virtual DOM (normalmente un elemento JSX), un Array o `null`.

```jsx
import { Component } from 'preact';

class MyComponent extends Component {
	render(props, state) {
		// props es igual a this.props
		// state es igual a this.state

		return <h1>Hello, {props.name}!</h1>;
	}
}
```

Para aprender más sobre los componentes y cómo pueden usarse, consulta la [Documentación de Componentes](/guide/v10/components).

### render()

`render(virtualDom, containerNode)`

Renderiza un Elemento Virtual DOM dentro de un elemento DOM padre `containerNode`. No retorna nada.

```jsx
// --repl
// Árbol del DOM antes del renderizado:
// <div id="container"></div>

import { render } from 'preact';

const Foo = () => <div>foo</div>;

render(<Foo />, document.getElementById('container'));

// Después del renderizado:
// <div id="container">
//  <div>foo</div>
// </div>
```

El primer argumento debe ser un Elemento Virtual DOM válido, que representa un componente o un elemento. Al pasar un Componente, es importante dejar que Preact haga la instanciación en lugar de invocar tu componente directamente, lo que puede causar errores inesperados:

```jsx
const App = () => <div>foo</div>;

// NO HACER: Invocar componentes directamente significa que no se contarán como un
// VNode y, por lo tanto, no se podrá utilizar la funcionalidad relacionada con los vnodes.
render(App(), rootElement); // ERROR
render(App, rootElement); // ERROR

// HACER: Pasar componentes utilizando h() o JSX permite que Preact se renderice correctamente:
render(h(App), rootElement); // success
render(<App />, rootElement); // success
```

### hydrate()

`hydrate(virtualDom, containerNode)`

Si ya has pre-renderizado o renderizado en el servidor tu aplicación a HTML, Preact puede omitir la mayor parte del trabajo de renderizado al cargar en el navegador. Esto se puede habilitar cambiando de `render()` a `hydrate()`, que omite la mayor parte del diffing pero aún así adjunta los listeners de eventos y configura tu árbol de componentes. Esto solo funciona cuando se usa junto con pre-renderizado o [Renderizado en el Servidor](/guide/v10/server-side-rendering).

```jsx
// --repl
import { hydrate } from 'preact';

const Foo = () => <div>foo</div>;
hydrate(<Foo />, document.getElementById('container'));
```

### h() / createElement()

`h(type, props, ...children)`

Devuelve un Elemento Virtual DOM con las `props` dadas. Los Elementos Virtual DOM son descripciones ligeras de un nodo en la jerarquía de la UI de tu aplicación, esencialmente un objeto de la forma `{ type, props }`.

Después de `type` y `props`, cualquier parámetro adicional se recopila en la propiedad `children`.
Los hijos pueden ser cualquiera de los siguientes:

- Valores escalares (string, number, boolean, null, undefined, etc)
- Elementos Virtual DOM anidados
- Arrays infinitamente anidados de los anteriores

```js
import { h } from 'preact';

h('div', { id: 'foo' }, 'Hello!');
// <div id="foo">Hello!</div>

h('div', { id: 'foo' }, 'Hello', null, ['Preact!']);
// <div id="foo">Hello Preact!</div>

h('div', { id: 'foo' }, h('span', null, 'Hello!'));
// <div id="foo"><span>Hello!</span></div>
```

### toChildArray

`toChildArray(componentChildren)`

Esta función auxiliar convierte un valor de `props.children` en un Array plano sin importar su estructura o anidamiento. Si `props.children` ya es un array, se devuelve una copia. Esta función es útil en casos donde `props.children` puede no ser un array, lo que puede ocurrir con ciertas combinaciones de expresiones estáticas y dinámicas en JSX.

Para Elementos Virtual DOM con un solo hijo, `props.children` es una referencia al hijo. Cuando hay múltiples hijos, `props.children` siempre es un Array. El helper `toChildArray` proporciona una forma consistente de manejar todos los casos.

```jsx
import { toChildArray } from 'preact';

function Foo(props) {
	const count = toChildArray(props.children).length;
	return <div>I have {count} children</div>;
}

// props.children es "bar"
render(<Foo>bar</Foo>, container);

// props.children es [<p>A</p>, <p>B</p>]
render(
	<Foo>
		<p>A</p>
		<p>B</p>
	</Foo>,
	container
);
```

### cloneElement

`cloneElement(virtualElement, props, ...children)`

Esta función te permite crear una copia superficial de un Elemento Virtual DOM.
Generalmente se usa para añadir o sobrescribir `props` de un elemento:

```jsx
function Linkout(props) {
	// agregar target="_blank" al enlace:
	return cloneElement(props.children, { target: '_blank' });
}
render(
	<Linkout>
		<a href="/">home</a>
	</Linkout>
);
// <a href="/" target="_blank">home</a>
```

### createContext

`createContext(initialState)`

Crea un nuevo objeto Context que puede usarse para pasar datos a través del árbol de componentes sin tener que pasar props manualmente por cada nivel.

Consulta la sección en la [documentación de Context](/guide/v10/context#createcontext).

```jsx
import { createContext } from 'preact';

const MyContext = createContext(defaultValue);
```

### createRef

`createRef(initialValue)`

Crea un nuevo objeto Ref que actúa como un valor local y estable que persistirá entre renders. Esto puede usarse para almacenar referencias al DOM, instancias de componentes o cualquier valor arbitrario.

Consulta la [documentación de Referencias](/guide/v10/refs#createref) para más detalles.

```jsx
import { createRef, Component } from 'preact';

class MyComponent extends Component {
    inputRef = createRef(null);

    // ...
}
```

### Fragment

Un tipo especial de componente que puede tener hijos, pero no se renderiza como un elemento DOM.
Los Fragments hacen posible devolver múltiples hijos hermanos sin necesidad de envolverlos en un contenedor DOM:

```jsx
// --repl
import { Fragment, render } from 'preact';

render(
	<Fragment>
		<div>A</div>
		<div>B</div>
		<div>C</div>
	</Fragment>,
	document.getElementById('container')
);
// Renderiza:
// <div id="container>
//   <div>A</div>
//   <div>B</div>
//   <div>C</div>
// </div>
```

### isValidElement

`isValidElement(virtualElement)`

Verifica si el valor proporcionado es un VNode válido de Preact.

```jsx
import { isValidElement, h } from 'preact';

isValidElement(<div />); // true
isValidElement(h('div')); // true

isValidElement('div'); // false
isValidElement(null); // false
```

### options

Consulta la documentación de [Option Hooks](/guide/v10/options) para más detalles.

## preact/hooks

Consulta la documentación de [Hooks](/guide/v10/hooks) para más detalles. Ten en cuenta que la página incluye algunos "hooks específicos de Compat" que no están disponibles en `preact/hooks`, solo en `preact/compat`.

## preact/compat

`preact/compat` es nuestra capa de compatibilidad que te permite usar Preact como reemplazo directo de React. Proporciona todas las APIs de `preact` y `preact/hooks`, además de algunas adicionales para igualar la API de React.

### Children

Ofrecido por compatibilidad, `Children` es un wrapper alrededor de la función [`toChildArray`](#tochildarray) del núcleo. Es bastante innecesario en aplicaciones Preact.

#### Children.map

`Children.map(children, fn, [context])`

Itera sobre los hijos y devuelve un nuevo array, igual que [`Array.prototype.map`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

```jsx
function List(props) {
	const children = Children.map(props.children, child => (
		<li>{child}</li>
	));
	return (
		<ul>
			{children}
		</ul>
	);
}
```

> Nota: Puede reemplazarse por `toChildArray(props.children).map(...)`.

#### Children.forEach

`Children.forEach(children, fn, [context])`

Itera sobre los hijos pero no devuelve un nuevo array, igual que [`Array.prototype.forEach`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).

```jsx
function List(props) {
	const children = [];
	Children.forEach(props.children, child =>
		children.push(<li>{child}</li>)
	);
	return (
		<ul>
			{children}
		</ul>
	);
}
```

> Nota: Puede reemplazarse por `toChildArray(props.children).forEach(...)`.

#### Children.count

`Children.count(children)`

Devuelve el número total de hijos.

```jsx
function MyComponent(props) {
	const children = Children.count(props.children);
	return <div>I have {children.length} children</div>;
}
```

> Nota: Puede reemplazarse por `toChildArray(props.children).length`.

#### Children.only

`Children.only(children)`

Lanza un error si el número de hijos no es exactamente uno. De lo contrario, devuelve el único hijo.

```jsx
function List(props) {
	const singleChild = Children.only(props.children);
	return (
		<ul>
			{singleChild}
		</ul>
	);
}
```

#### Children.toArray

`Children.count(children)`

Convierte sus hijos en un array plano. Es un alias de [`toChildArray`](#tochildarray).

```jsx
function MyComponent(props) {
	const children = Children.toArray(props.children);
	return <div>I have {children.length} children</div>;
}
```

> Nota: Puede reemplazarse por `toChildArray(props.children)`.

### createPortal

`createPortal(virtualDom, containerNode)`

Permite renderizar en otra parte del árbol DOM diferente al padre natural de tu componente.

```html
<html>
	<body>
		<!-- Las modales deben renderizarse acá -->
		<div id="modal-root"></div>
		<!-- La app se renderiza acá -->
		<div id="app"></div>
	</body>
</html>
```

```jsx
import { createPortal } from 'preact/compat';
import { MyModal } from './MyModal.jsx';

function App() {
	const container = document.getElementById('modal-root');
	return (
		<div>
			<h1>My App</h1>
			{createPortal(<MyModal />, container)}
		</div>
	);
}
```

### PureComponent

La clase `PureComponent` funciona de manera similar a `Component`. La diferencia es que `PureComponent` omitirá el renderizado cuando las nuevas props sean iguales a las anteriores. Para esto, se comparan las props antiguas y nuevas mediante una comparación superficial, verificando la igualdad referencial de cada propiedad. Esto puede acelerar mucho las aplicaciones evitando renders innecesarios. Funciona añadiendo un hook de ciclo de vida `shouldComponentUpdate` por defecto.

```jsx
import { render } from 'preact';
import { PureComponent } from 'preact/compat';

class Foo extends PureComponent {
	render(props) {
		console.log('render');
		return <div />;
	}
}

const dom = document.getElementById('root');
render(<Foo value="3" />, dom);
// Enseña en consola: "render"

// Se renderiza por segunda vez, no enseña nada en consola
render(<Foo value="3" />, dom);
```

> Nota: la ventaja de `PureComponent` solo se nota cuando el render es costoso. Para árboles de hijos simples puede ser más rápido simplemente hacer el `render` que el coste de comparar las props.

### memo

`memo` es para componentes funcionales lo que `PureComponent` es para clases. Usa la misma función de comparación internamente, pero te permite especificar tu propia función especializada optimizada para tu caso de uso.

```jsx
import { memo } from 'preact/compat';

function MyComponent(props) {
	return <div>Hello {props.name}</div>;
}

// Uso con la función de comparación predeterminada
const Memoed = memo(MyComponent);

// Uso con función de comparación personalizada
const Memoed2 = memo(MyComponent, (prevProps, nextProps) => {
	// Solo volver a renderizar cuando cambie `name`.
	return prevProps.name === nextProps.name;
});
```

> La función de comparación es diferente de `shouldComponentUpdate` en que verifica si los dos objetos props son **iguales**, mientras que `shouldComponentUpdate` verifica si son diferentes.

### forwardRef

En algunos casos, al escribir un componente, quieres permitir que el usuario obtenga una referencia específica más abajo en el árbol. Con `forwardRef` puedes "reenviar" la propiedad `ref`:

```jsx
import { createRef, render } from 'preact';
import { forwardRef } from 'preact/compat';

const MyComponent = forwardRef((props, ref) => {
	return <div ref={ref}>Hello world</div>;
});

// Uso: `ref` contendrá la referencia al `div` interno en lugar de
// `MyComponent`
const ref = createRef();
render(<MyComponent ref={ref} />, dom);
```

Este componente es más útil para autores de librerías.

> **Nota:** Esto es menos probable que sea útil en Preact v11 ya que [las refs ahora se reenvían por defecto](/guide/v11/upgrade-guide#refs-are-forwarded-by-default).

### StrictMode

`<StrictMode><App /></StrictMode>`

Ofrecido estrictamente por compatibilidad, `<StrictMode>` es simplemente un alias de [`Fragment`](#Fragment). No proporciona comprobaciones ni advertencias adicionales, todas ellas son proporcionadas por [`preact/debug`](#preactdebug).

```jsx
import { StrictMode } from 'preact/compat';

render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.getElementById('root')
);
```

### Suspense

`<Suspense fallback={...}>...</Suspense>`

Un componente que puede usarse para "esperar" a que se complete alguna operación asíncrona antes de renderizar sus hijos. Mientras espera, renderizará el contenido `fallback` proporcionado.

```jsx
import { Suspense } from 'preact/compat';

function MyComponent() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MyLazyComponent />
        </Suspense>
    );
}
```

### lazy

`lazy(loadingFunction)`

Permite posponer la carga de un componente hasta que realmente se necesite. Esto es útil para dividir el código y cargar partes de tu aplicación de forma perezosa.

```jsx
import { lazy } from 'preact/compat';

const MyLazyComponent = lazy(() => import('./MyLazyComponent.jsx'));
```

## preact/debug

`preact/debug` proporciona utilidades de depuración de bajo nivel que pueden ayudar a identificar problemas para quienes construyen herramientas muy específicas sobre Preact. Es muy poco probable que un usuario normal deba usar directamente alguna de las funciones siguientes; en su lugar, importa `preact/debug` en la raíz de tu aplicación para habilitar advertencias y mensajes de error útiles.

### resetPropWarnings

`resetPropWarnings()`

Reinicia el historial interno de advertencias de tipos de prop ya registradas. Esto es útil al ejecutar tests para asegurar que cada test comience con un estado limpio.

```jsx
import { resetPropWarnings } from 'preact/debug';
import PropTypes from 'prop-types';

function Foo(props) {
	return <h1>{props.title}</h1>;
}

Foo.propTypes = {
	title: PropTypes.string.isRequired
};

render(<Foo />, document.getElementById('app'));
// Registros: Advertencia: Tipo de propiedad fallido: La propiedad `title` está marcada como obligatoria en `Foo`, pero su valor es `indefinido`.

expect(console.error).toHaveBeenCalledOnce();

resetPropWarnings();

//...

```

### getCurrentVNode

`getCurrentVNode()`

Obtiene el VNode actual que se está renderizando.

```jsx
import { render } from 'preact';
import { getCurrentVNode } from 'preact/debug';

function MyComponent() {
	const currentVNode = getCurrentVNode();
	console.log(currentVNode); // Enseña en consola: Object { type: MyComponent(), props: {}, key: undefined, ref: undefined, ... }

	return <h1>Hello World!</h1>
}

render(<MyComponent />, document.getElementById('app'));
```

### getDisplayName

`getDisplayName(vnode)`

Devuelve una representación en string del tipo de un Elemento Virtual DOM, útil para depuración y mensajes de error.

```js
import { h } from 'preact';
import { getDisplayName } from 'preact/debug';

getDisplayName(h('div')); // "div"
getDisplayName(h(MyComponent)); // "MyComponent"
getDisplayName(h(() => <div />)); // "<empty string>"
```

### getOwnerStack

`getOwnerStack(vnode)`

Devuelve la pila de componentes capturada hasta este punto.

```jsx
import { render, options } from 'preact';
import { getOwnerStack } from 'preact/debug';

const oldVNode = options.diffed;
options.diffed = (vnode) => {
	if (vnode.type === 'h1') {
		console.log(getOwnerStack(vnode));
		// Enseña en consola:
		//
		// in h1 (at /path/to/file.jsx:17)
		// in MyComponent (at /path/to/file.jsx:20)
	}
	if (oldVNode) oldVNode(vnode);
};

function MyComponent() {
	return <h1>Hello World!</h1>;
}

render(<MyComponent />, document.getElementById('app'));
```

### captureOwnerStack

`captureOwnerStack()`

Devuelve la pila de componentes capturada hasta este punto. Es una combinación de [`getCurrentVNode()`](#getcurrentvnode) y [`getOwnerStack()`](#getownerstack).

```jsx
import { render } from 'preact';
import { getCurrentVNode } from 'preact/debug';

function MyComponent() {
	const currentVNode = getCurrentVNode();
	console.log(currentVNode);
	// Enseña en consola:
	//
	// in MyComponent
	// in App (at /path/to/file.jsx:15)

	return <h1>Hello World!</h1>
}

function App() {
	return <MyComponent />;
}

render(<App />, document.getElementById('app'));
```

## preact/devtools

### addHookName

`addHookName(value, name)`

Muestra una etiqueta personalizada para un hook en las devtools. Esto puede ser útil cuando tienes múltiples hooks del mismo tipo en un solo componente y quieres poder distinguirlos.

```jsx
import { addHookName } from 'preact/devtools';
import { useState } from 'preact/hooks';

function useCount(init) {
	return addHookName(useState(init), 'count');
}

function App() {
	const [count, setCount] = useCount(0);
	return (
		<button onClick={() => setCount(c => c + 1)}>
			{count}
		</button>;
	);
}
```

## preact/jsx-runtime

Una colección de funciones que pueden ser usadas por transpiladores de JSX, como la [transformación "automatic runtime" de Babel](https://babeljs.io/docs/babel-plugin-transform-react-jsx#react-automatic-runtime) o la [transformación "precompile" de Deno](https://docs.deno.com/runtime/reference/jsx/#jsx-precompile-transform). No están necesariamente pensadas para uso directo.

### jsx

`jsx(type, props, [key], [isStaticChildren], [__source], [__self])`

Devuelve un Elemento Virtual DOM con las `props` dadas. Similar a `h()` pero implementa la API "automatic runtime" de Babel.

```js
import { jsx } from 'preact/jsx-runtime';

jsx('div', { id: 'foo', children: 'Hello!' });
// <div id="foo">Hello!</div>
```

### jsxs

Alias de [`jsx`](#jsx), proporcionado por compatibilidad.

### jsxDev

Alias de [`jsx`](#jsx), proporcionado por compatibilidad.

### Fragment

Re-exportación de [`Fragment`](#fragment) desde el núcleo.

### jsxTemplate

`jsxTemplate(templates, ...exprs)`

Crea un vnode de plantilla. Utilizado por la transformación "precompile" de Deno.

### jsxAttr

`jsxAttr(name, value)`

Serializa un atributo HTML a una cadena. Usado por la transformación "precompile" de Deno.

### jsxEscape

`jsxEscape(value)`

Escapa un hijo dinámico pasado a [`jsxTemplate`](#jsxtemplate). Usado por la transformación "precompile" de Deno.

## preact/test-utils

Una colección de utilidades para facilitar el testeo de componentes Preact. Normalmente son usadas por librerías de testing como [`enzyme`](/guide/v10/unit-testing-with-enzyme) o [`@testing-library/preact`](/guide/v10/preact-testing-library) en vez de directamente por los usuarios.

### setupRerender

`setupRerender()`

Configura una función de rerender que vaciará la cola de renders pendientes

### act

`act(callback)`

Ejecuta una función de test y vacía todos los efectos y renders pendientes después de invocarla.

### teardown

`teardown()`

Desmonta el entorno de test y reinicia el estado interno de Preact
