---
title: TypeScript
description: Preact tiene soporte integrado de TypeScript. ¡Aprende cómo usarlo!
translation_by:
  - Ezequiel Mastropietro
---

# TypeScript

¡Preact incluye definiciones de tipo TypeScript, que son usadas por la librería misma!

Cuando usas Preact en un editor consciente de TypeScript (como VSCode), puedes beneficiarte de la información de tipo añadida mientras escribes JavaScript regular. Si quieres añadir información de tipo a tus propias aplicaciones, puedes usar [anotaciones JSDoc](https://fettblog.eu/typescript-jsdoc-superpowers/), o escribir TypeScript y transpilar a JavaScript regular. Esta sección se enfoca en lo último.

---

<toc></toc>

---

## Configuración de TypeScript

TypeScript incluye un compilador JSX completo que puedes usar en lugar de Babel. Agrega la siguiente configuración a tu `tsconfig.json` para transpilar JSX a JavaScript compatible con Preact:

```json
// Transformación Clásica
{
	"compilerOptions": {
		"jsx": "react",
		"jsxFactory": "h",
		"jsxFragmentFactory": "Fragment"
		//...
	}
}
```

```json
// Transformación Automática, disponible en TypeScript >= 4.1.1
{
	"compilerOptions": {
		"jsx": "react-jsx",
		"jsxImportSource": "preact"
		//...
	}
}
```

Si usas TypeScript dentro de una cadena de herramientas Babel, establece `jsx` en `preserve` y deja que Babel maneje la transpilación. Aún necesitas especificar `jsxFactory` y `jsxFragmentFactory` para obtener los tipos correctos.

```json
{
	"compilerOptions": {
		"jsx": "preserve",
		"jsxFactory": "h",
		"jsxFragmentFactory": "Fragment"
		//...
	}
}
```

En tu `.babelrc`:

```javascript
{
  presets: [
    "@babel/env",
    ["@babel/typescript", { jsxPragma: "h" }],
  ],
  plugins: [
    ["@babel/transform-react-jsx", { pragma: "h" }]
  ],
}
```

Renombra tus archivos `.jsx` a `.tsx` para que TypeScript analice correctamente tu JSX.

## Configuración TypeScript preact/compat

Tu proyecto podría necesitar soporte para el ecosistema React más amplio. Para que tu aplicación se compile, podrías necesitar deshabilitar la verificación de tipos en tu `node_modules` y agregar rutas a los tipos como esto. De esta forma, tu alias funcionará correctamente cuando las librerías importen React.

```json
{
  "compilerOptions": {
    // ...
    "skipLibCheck": true,
    "baseUrl": "./",
    "paths": {
      "react": ["./node_modules/preact/compat/"],
      "react/jsx-runtime": ["./node_modules/preact/jsx-runtime"],
      "react-dom": ["./node_modules/preact/compat/"],
      "react-dom/*": ["./node_modules/preact/compat/*"]
    }
  }
}
```

## Tipificación de componentes

Hay diferentes formas de tipar componentes en Preact. Los componentes de clase tienen variables de tipo genérico para asegurar la seguridad de tipo. TypeScript ve una función como un componente funcional mientras devuelva JSX. Hay múltiples soluciones para definir props para componentes funcionales.

### Componentes de función

Tipar componentes de función regulares es tan fácil como agregar información de tipo a los argumentos de la función.

```tsx
interface MyComponentProps {
	name: string;
	age: number;
}

function MyComponent({ name, age }: MyComponentProps) {
	return (
		<div>
			Mi nombre es {name}, tengo {age.toString()} años.
		</div>
	);
}
```

Puedes establecer props predeterminados estableciendo un valor predeterminado en la firma de la función.

```tsx
interface GreetingProps {
	name?: string; // ¡name es opcional!
}

function Greeting({ name = 'User' }: GreetingProps) {
	// name es al menos "User"
	return <div>Hello {name}!</div>;
}
```

Preact también envía un tipo `FunctionComponent` para anotar funciones anónimas. `FunctionComponent` también añade un tipo para `children`:

```tsx
import { h, FunctionComponent } from 'preact';

const Card: FunctionComponent<{ title: string }> = ({ title, children }) => {
	return (
		<div class="card">
			<h1>{title}</h1>
			{children}
		</div>
	);
};
```

`children` es de tipo `ComponentChildren`. Puedes especificar children por ti mismo usando este tipo:

```tsx
import { h, ComponentChildren } from 'preact';

interface ChildrenProps {
	title: string;
	children: ComponentChildren;
}

function Card({ title, children }: ChildrenProps) {
	return (
		<div class="card">
			<h1>{title}</h1>
			{children}
		</div>
	);
}
```

### Componentes de clase

La clase `Component` de Preact se tipifica como genérica con dos variables de tipo genérico: Props y State. Ambos tipos predeterminan al objeto vacío, y puedes especificarlos según tus necesidades.

```tsx
// Tipos para props
interface ExpandableProps {
	title: string;
}

// Tipos para state
interface ExpandableState {
	toggled: boolean;
}

// Vincular genéricos a ExpandableProps y ExpandableState
class Expandable extends Component<ExpandableProps, ExpandableState> {
	constructor(props: ExpandableProps) {
		super(props);
		// this.state es un objeto con un campo booleano `toggle`
		// debido a ExpandableState
		this.state = {
			toggled: false
		};
	}
	// `this.props.title` es string debido a ExpandableProps
	render() {
		return (
			<div class="expandable">
				<h2>
					{this.props.title}{' '}
					<button
						onClick={() => this.setState({ toggled: !this.state.toggled })}
					>
						Alternar
					</button>
				</h2>
				<div hidden={this.state.toggled}>{this.props.children}</div>
			</div>
		);
	}
}
```

Los componentes de clase incluyen children por defecto, tipificado como `ComponentChildren`.

## Heredando propiedades HTML

Cuando escribimos componentes como `<Input />` que envuelven el HTML `<input>`, la mayoría de las veces querríamos heredar las props que se pueden usar en el elemento input HTML nativo. Para hacer esto podemos hacer lo siguiente:

```tsx
import { InputHTMLAttributes } from 'preact';

interface InputProperties extends InputHTMLAttributes {
	mySpecialProp: any;
}

const Input = (props: InputProperties) => <input {...props} />;
```

Ahora cuando usamos `Input` sabrá sobre propiedades como `value`, ...

## Tipificación de eventos

Preact emite eventos DOM regulares. Mientras tu proyecto TypeScript incluya la librería `dom` (establécela en `tsconfig.json`), tienes acceso a todos los tipos de evento disponibles en tu configuración actual.

```tsx
import type { TargetedMouseEvent } from "preact";

export class Button extends Component {
  handleClick(event: TargetedMouseEvent<HTMLButtonElement>) {
    alert(event.currentTarget.tagName); // Alerta BUTTON
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.props.children}
      </button>
    );
  }
}
```

Si prefieres funciones en línea, puedes prescindir de tipificar explícitamente el objetivo del evento actual ya que se infiere del elemento JSX:

```tsx
export class Button extends Component {
	render() {
		return (
			<button onClick={event => alert(event.currentTarget.tagName)}>
				{this.props.children}
			</button>
		);
	}
}
```

## Tipificación de referencias

La función `createRef` también es genérica, y te permite vincular referencias a tipos de elementos. En este ejemplo, nos aseguramos de que la referencia solo se pueda vincular a `HTMLAnchorElement`. Usar `ref` con cualquier otro elemento hace que TypeScript lance un error:

```tsx
import { h, Component, createRef } from 'preact';

class Foo extends Component {
	ref = createRef<HTMLAnchorElement>();

	componentDidMount() {
		// current es de tipo HTMLAnchorElement
		console.log(this.ref.current);
	}

	render() {
		return <div ref={this.ref}>Foo</div>;
		//          ~~~
		//       💥 Error! Ref solo se puede usar para HTMLAnchorElement
	}
}
```

Esto ayuda mucho si quieres asegurarte de que los elementos a los que haces `ref` son elementos de entrada que se pueden, por ejemplo, enfocar.

## Tipificación de contexto

`createContext` intenta inferir tanto como sea posible de los valores iniciales que pasas a:

```tsx
import { h, createContext } from 'preact';

const AppContext = createContext({
	authenticated: true,
	lang: 'en',
	theme: 'dark'
});
// AppContext es de tipo preact.Context<{
//   authenticated: boolean;
//   lang: string;
//   theme: string;
// }>
```

También requiere que pases todas las propiedades que definiste en el valor inicial:

```tsx
function App() {
	// Esto falla 💥 ya que no hemos definido theme
	return (
		<AppContext.Provider
			value={{
	 //    ~~~~~
	 // 💥 Error: theme no definido
				lang: 'de',
				authenticated: true
			}}
		>
			{}
			<ComponentThatUsesAppContext />
		</AppContext.Provider>
	);
}
```

Si no quieres especificar todas las propiedades, puedes mezclar valores predeterminados con sobrescrituras:

```tsx
const AppContext = createContext(appContextDefault);

function App() {
	return (
		<AppContext.Provider
			value={{
				lang: 'de',
				...appContextDefault
			}}
		>
			<ComponentThatUsesAppContext />
		</AppContext.Provider>
	);
}
```

O trabajas sin valores predeterminados y usas vincular la variable de tipo genérico para vincular el contexto a un cierto tipo:

```tsx
interface AppContextValues {
  authenticated: boolean;
  lang: string;
  theme: string;
}

const AppContext = createContext<Partial<AppContextValues>>({});

function App() {
  return (
    <AppContext.Provider
      value={{
        lang: "de"
      }}
    >
      <ComponentThatUsesAppContext />
    </AppContext.Provider>
  );
```

Todos los valores se vuelven opcionales, por lo que tienes que hacer comprobaciones nulas cuando los usas.

## Tipificación de hooks

La mayoría de hooks no necesitan ninguna información de tipificación especial, pero pueden inferir tipos de su uso.

### useState, useEffect, useContext

`useState`, `useEffect` y `useContext` todos cuentan con tipos genéricos para que no necesites anotar extra. A continuación se muestra un componente mínimo que usa `useState`, con todos los tipos inferidos de los valores predeterminados de la firma de la función.

```tsx
const Counter = ({ initial = 0 }) => {
	// ya que initial es un número (¡valor predeterminado!), clicks es un número
	// setClicks es una función que acepta
	// - un número
	// - una función que devuelve un número
	const [clicks, setClicks] = useState(initial);
	return (
		<>
			<p>Clics: {clicks}</p>
			<button onClick={() => setClicks(clicks + 1)}>+</button>
			<button onClick={() => setClicks(clicks - 1)}>-</button>
		</>
	);
};
```

`useEffect` hace comprobaciones adicionales para que solo devuelvas funciones de limpieza.

```typescript
useEffect(() => {
	const handler = () => {
		document.title = window.innerWidth.toString();
	};
	window.addEventListener('resize', handler);

	// ✅  si devuelves algo de la devolución de llamada del efecto
	// TIENE que ser una función sin argumentos
	return () => {
		window.removeEventListener('resize', handler);
	};
});
```

`useContext` obtiene la información del tipo del objeto predeterminado que pasas a `createContext`.

```tsx
const LanguageContext = createContext({ lang: 'en' });

const Display = () => {
	// lang será de tipo string
	const { lang } = useContext(LanguageContext);
	return (
		<>
			<p>Tu idioma seleccionado: {lang}</p>
		</>
	);
};
```

### useRef

Al igual que `createRef`, `useRef` se beneficia de vincular una variable de tipo genérico a un subtipo de `HTMLElement`. En el ejemplo a continuación, nos aseguramos de que `inputRef` solo se pueda pasar a `HTMLInputElement`. `useRef` generalmente se inicializa con `null`, con la bandera `strictNullChecks` habilitada, necesitamos verificar si `inputRef` realmente está disponible.

```tsx
import { h } from 'preact';
import { useRef } from 'preact/hooks';

function TextInputWithFocusButton() {
	// inicializa con null, pero dile a TypeScript que estamos buscando un HTMLInputElement
	const inputRef = useRef<HTMLInputElement>(null);
	const focusElement = () => {
		// las comprobaciones de null estrictas necesitan que verifiquemos si inputEl y current existen.
		// pero una vez que current existe, es de tipo HTMLInputElement, por lo que
		// ¡tiene el método focus! ✅
		if (inputRef && inputRef.current) {
			inputRef.current.focus();
		}
	};
	return (
		<>
			{/* además, inputRef solo se puede usar con elementos input */}
			<input ref={inputRef} type="text" />
			<button onClick={focusElement}>Enfocar el input</button>
		</>
	);
}
```

### useReducer

Para el hook `useReducer`, TypeScript intenta inferir tantos tipos como sea posible de la función reductora. Consulta por ejemplo un reductor para un contador.

```typescript
// El tipo de estado para la función reductora
interface StateType {
	count: number;
}

// Un tipo de acción, donde el `type` puede ser cualquiera de
// "reset", "decrement", "increment"
interface ActionType {
	type: 'reset' | 'decrement' | 'increment';
}

// El estado inicial. No necesita anotación
const initialState = { count: 0 };

function reducer(state: StateType, action: ActionType) {
	switch (action.type) {
		// TypeScript se asegura de que manejemos todos los posibles
		// tipos de acción, y proporciona auto-complete para cadenas de tipo
		case 'reset':
			return initialState;
		case 'increment':
			return { count: state.count + 1 };
		case 'decrement':
			return { count: state.count - 1 };
		default:
			return state;
	}
}
```

Una vez que usamos la función reductora en `useReducer`, inferimos varios tipos y realizamos comprobaciones de tipos para argumentos pasados.

```tsx
function Counter({ initialCount = 0 }) {
	// TypeScript se asegura de que la reductora tenga máximo dos argumentos, y que
	// el estado inicial sea del tipo StateType.
	// Además:
	// - state es del tipo StateType
	// - dispatch es una función para enviar ActionType
	const [state, dispatch] = useReducer(reducer, { count: initialCount });

	return (
		<>
			Contador: {state.count}
			{/* TypeScript asegura que las acciones enviadas sean del tipo ActionType */}
			<button onClick={() => dispatch({ type: 'reset' })}>Reiniciar</button>
			<button onClick={() => dispatch({ type: 'increment' })}>+</button>
			<button onClick={() => dispatch({ type: 'decrement' })}>-</button>
		</>
	);
}
```

La única anotación necesaria está en la función reductora misma. Los tipos de `useReducer` también aseguran que el valor de retorno de la función reductora sea del tipo `StateType`.

## Extendiendo tipos JSX incorporados

Podrías tener [elementos personalizados](/guide/v10/web-components) que quieras usar en JSX, o podrías desear agregar atributos adicionales a todos o algunos elementos HTML para funcionar con una librería particular. Para hacer esto, necesitarás usar "Module augmentation" (aumento de módulo) para extender y/o alterar los tipos que Preact proporciona.

### Extendiendo `IntrinsicElements` para elementos personalizados

```tsx
function MyComponent() {
	return <loading-bar showing={true}></loading-bar>;
	//      ~~~~~~~~~~~
	//   💥 Error! Property 'loading-bar' no existe en el tipo 'JSX.IntrinsicElements'.
}
```

```tsx
// global.d.ts

declare global {
	namespace preact.JSX {
		interface IntrinsicElements {
			'loading-bar': { showing: boolean };
		}
	}
}

// ¡Esta exportación vacía es importante! Le dice a TS que trate esto como un módulo
export {};
```

### Extendiendo `HTMLAttributes` para atributos personalizados globales

Si quieres agregar un atributo personalizado a todos los elementos HTML, puedes extender la interfaz `HTMLAttributes`:

```tsx
function MyComponent() {
	return <div custom="foo"></div>;
	//          ~~~~~~
	//       💥 Error! El tipo '{ custom: string; }' no se puede asignar al tipo 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.
	//                   La propiedad 'custom' no existe en el tipo 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.
}
```

```tsx
// global.d.ts

declare module 'preact' {
	interface HTMLAttributes {
		custom?: string | undefined;
	}
}

// ¡Esta exportación vacía es importante! Le dice a TS que trate esto como un módulo
export {};
```

### Extendiendo interfaces por elemento para atributos personalizados

A veces podrías no querer agregar un atributo personalizado de forma global, sino solo a un elemento específico. En este caso, puedes extender la interfaz del elemento específico:

```tsx
// global.d.ts

declare module 'preact' {
	interface HeadingHTMLAttributes {
		custom?: string | undefined;
	}
}

// ¡Esta exportación vacía es importante! Le dice a TS que trate esto como un módulo
export {};
```

Sin embargo, actualmente hay 5 elementos especiales (`<a>`, `<area>`, `<img>`, `<input>`, y `<select>`) que necesitas manejar un poco diferente: a diferencia de otros elementos, estos elementos tienen sus interfaces prefijadas con `Partial...` así que necesitarás asegurarte de que tus interfaces coincidan con ese patrón:

```ts
// global.d.ts

declare module 'preact' {
	interface PartialAnchorHTMLAttributes {
		custom?: string | undefined;
	}
}

// ¡Esta exportación vacía es importante! Le dice a TS que trate esto como un módulo
export {};
```

> **Nota**: Hacemos esto para soportar mejores tipos ARIA/accesibilidad para estos elementos, ya que sus roles ARIA son un tipo de unión discriminada por la especificación (por ejemplo, si `<a>` tiene un atributo `href`, puede tener algunos roles específicos, pero si no lo tiene, puede ser un conjunto diferente de roles). Para facilitar esto necesitamos usar la palabra clave `type` en TypeScript, pero esto rompe la capacidad de aumentar el tipo ya que ya no es una interfaz simple. Nuestros tipos accesibles intersecan interfaces `Partial...` sin embargo, así que simplemente podemos aumentarlas en su lugar.
