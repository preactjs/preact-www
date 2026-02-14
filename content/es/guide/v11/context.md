---
title: Context
description: Context te permite pasar props a través de componentes intermedios. Este documento describe tanto la API nueva como la antigua
---

# Context

Context es una forma de pasar datos a través del árbol de componentes sin tener que pasarlos a través de cada componente intermedio mediante props. En pocas palabras, permite que los componentes en cualquier parte de la jerarquía se suscriban a un valor y se notifiquen cuando cambie, trayendo actualizaciones de estilo pub-sub a Preact.

No es inusual encontrarse en situaciones en las que un valor de un componente abuelo (o superior) necesita ser pasado hacia un hijo, frecuentemente sin que el componente intermedio lo necesite. Este proceso de pasar props hacia abajo a menudo se refiere como "prop drilling" y puede ser engorroso, propenso a errores y simplemente repetitivo, especialmente a medida que la aplicación crece y más valores tienen que ser pasados a través de más capas. Este es uno de los problemas clave que Context tiene como objetivo abordar proporcionando una forma para que un hijo se suscriba a un valor más arriba en el árbol de componentes, accediendo al valor sin que sea pasado como prop.

Hay dos formas de usar context en Preact: mediante la más nueva API `createContext` y la API de context heredada. En estos días hay muy pocas razones para recurrir nunca a la API heredada pero está documentada aquí por completitud.

---

<toc></toc>

---

## API de Context Moderno

### Creando un Context

Para crear un nuevo context, usamos la función `createContext`. Esta función toma un estado inicial como argumento y devuelve un objeto con dos propiedades de componente: `Provider`, para que el context esté disponible para los descendientes, y `Consumer`, para acceder al valor del context (principalmente en componentes de clase).

```jsx
import { createContext } from 'preact';

export const Theme = createContext('light');
export const User = createContext({ name: 'Guest' });
export const Locale = createContext(null);
```

### Configurando un Provider

Una vez hemos creado un context, debemos hacerlo disponible para los descendientes usando el componente `Provider`. El `Provider` debe ser dado una prop `value`, representando el valor inicial del context.

> El valor inicial establecido desde `createContext` solo se usa en la ausencia de un `Provider` encima del consumer en el árbol. Esto puede ser útil para testear componentes de forma aislada, ya que evita la necesidad de crear un `Provider` envolvente alrededor de tu componente.

```jsx
import { createContext } from 'preact';

export const Theme = createContext('light');

function App() {
	return (
		<Theme.Provider value="dark">
			<SomeComponent />
		</Theme.Provider>
	);
}
```

> **Consejo:** Puedes tener múltiples providers del mismo context en toda tu aplicación pero solo el más cercano al consumer será utilizado.

### Usando el Context

Hay tres formas de consumir un context, en gran medida dependiente de tu estilo de componente preferido: `static contextType` (componentes de clase), el hook `useContext` (componentes funcionales/hooks), y `Context.Consumer` (todos los componentes).

<tab-group tabstring="contextType, useContext, Context.Consumer">

```jsx
// --repl
import { render, createContext, Component } from 'preact';

const SomeComponent = props => props.children;
// --repl-before
const ThemePrimary = createContext('#673ab8');

class ThemedButton extends Component {
	static contextType = ThemePrimary;

	render() {
		const theme = this.context;
		return <button style={{ background: theme }}>Themed Button</button>;
	}
}

function App() {
	return (
		<ThemePrimary.Provider value="#8f61e1">
			<SomeComponent>
				<ThemedButton />
			</SomeComponent>
		</ThemePrimary.Provider>
	);
}
// --repl-after
render(<App />, document.getElementById('app'));
```

```jsx
// --repl
import { render, createContext } from 'preact';
import { useContext } from 'preact/hooks';

const SomeComponent = props => props.children;
// --repl-before
const ThemePrimary = createContext('#673ab8');

function ThemedButton() {
	const theme = useContext(ThemePrimary);
	return <button style={{ background: theme }}>Themed Button</button>;
}

function App() {
	return (
		<ThemePrimary.Provider value="#8f61e1">
			<SomeComponent>
				<ThemedButton />
			</SomeComponent>
		</ThemePrimary.Provider>
	);
}
// --repl-after
render(<App />, document.getElementById('app'));
```

```jsx
// --repl
import { render, createContext } from 'preact';

const SomeComponent = props => props.children;
// --repl-before
const ThemePrimary = createContext('#673ab8');

function ThemedButton() {
	return (
		<ThemePrimary.Consumer>
			{theme => <button style={{ background: theme }}>Themed Button</button>}
		</ThemePrimary.Consumer>
	);
}

function App() {
	return (
		<ThemePrimary.Provider value="#8f61e1">
			<SomeComponent>
				<ThemedButton />
			</SomeComponent>
		</ThemePrimary.Provider>
	);
}
// --repl-after
render(<App />, document.getElementById('app'));
```

</tab-group>

### Actualizando el Context

Los valores estáticos pueden ser útiles, pero más a menudo queremos ser capaces de actualizar el valor del context dinámicamente. Para hacer eso, aprovechamos los mecanismos estándar de estado de componentes:

```jsx
// --repl
import { render, createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';

const SomeComponent = props => props.children;
// --repl-before
const ThemePrimary = createContext(null);

function ThemedButton() {
	const { theme } = useContext(ThemePrimary);
	return <button style={{ background: theme }}>Themed Button</button>;
}

function ThemePicker() {
	const { theme, setTheme } = useContext(ThemePrimary);
	return (
		<input
			type="color"
			value={theme}
			onChange={e => setTheme(e.currentTarget.value)}
		/>
	);
}

function App() {
	const [theme, setTheme] = useState('#673ab8');
	return (
		<ThemePrimary.Provider value={{ theme, setTheme }}>
			<SomeComponent>
				<ThemedButton />
				{' - '}
				<ThemePicker />
			</SomeComponent>
		</ThemePrimary.Provider>
	);
}
// --repl-after
render(<App />, document.getElementById('app'));
```

## API de Context Heredada

Esta API se considera heredada y debe evitarse en código nuevo, tiene problemas conocidos y solo existe por razones de compatibilidad hacia atrás.

Una de las diferencias clave entre esta API y la nueva es que esta API no puede actualizar un hijo cuando un componente entre el hijo y el provider cancela el renderizado mediante `shouldComponentUpdate`. Cuando esto ocurre, el hijo **no** recibirá el valor de context actualizado, frecuentemente resultando en tearing (parte de la UI usando el valor nuevo, parte usando el viejo).

Para pasar un valor a través del context, un componente necesita tener el método `getChildContext`, devolviendo el valor intended del context. Los descendientes pueden entonces acceder al context mediante el segundo argumento en componentes funcionales o `this.context` en componentes basados en clases.

```jsx
// --repl
import { render } from 'preact';

const SomeOtherComponent = props => props.children;
// --repl-before
function ThemedButton(_props, context) {
	return <button style={{ background: context.theme }}>Themed Button</button>;
}

class App extends Component {
	getChildContext() {
		return {
			theme: '#673ab8'
		};
	}

	render() {
		return (
			<div>
				<SomeOtherComponent>
					<ThemedButton />
				</SomeOtherComponent>
			</div>
		);
	}
}
// --repl-after
render(<App />, document.getElementById('app'));
```
