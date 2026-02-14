---
title: Diferencias con React
description: Cuáles son las diferencias entre Preact y React. Este documento las describe en detalle
translation_by:
  - Ezequiel Mastropietro
---

# Diferencias con React

Preact no está destinado a ser una reimplementación de React. Hay diferencias. Muchas de estas diferencias son triviales, o pueden ser completamente eliminadas mediante el uso de [preact/compat], que es una capa fina sobre Preact que intenta lograr compatibilidad del 100% con React.

La razón por la que Preact no intenta incluir todas y cada una de las características de React es para mantenerse **pequeño** y **enfocado** - de lo contrario, tendría más sentido simplemente enviar optimizaciones al proyecto de React, que ya es una base de código muy compleja y bien arquitectada.

---

<toc></toc>

---

## Diferencias principales

La principal diferencia entre Preact y React es que Preact no implementa un sistema de eventos sintéticos por razones de tamaño y rendimiento. Preact usa el `addEventListener` estándar del navegador para registrar manejadores de eventos, lo que significa que la denominación y el comportamiento de los eventos funciona igual en Preact que en JavaScript / DOM simple. Consulta la [Referencia de Eventos de MDN] para obtener una lista completa de manejadores de eventos del DOM.

Los eventos estándar del navegador funcionan de manera muy similar a cómo funcionan los eventos en React, con algunas pequeñas diferencias. En Preact:

- los eventos no burbujean a través de componentes `<Portal>`
- se debe usar el estándar `onInput` en lugar de `onChange` de React para entradas de formulario (**solo si no se usa `preact/compat`**)
- se debe usar el estándar `onDblClick` en lugar de `onDoubleClick` de React (**solo si no se usa `preact/compat`**)
- generalmente se debe usar `onSearch` para `<input type="search">`, ya que el botón de borrar "x" no dispara `onInput` en IE11

Otra diferencia notable es que Preact sigue la especificación del DOM más de cerca. Los elementos personalizados son compatibles como cualquier otro elemento, y los eventos personalizados son compatibles con nombres sensibles a mayúsculas y minúsculas (tal como lo son en el DOM).

## Compatibilidad de Versiones

Para tanto preact como [preact/compat], la compatibilidad de versiones se mide contra los lanzamientos principales _actuales_ y _anteriores_ de React. Cuando el equipo de React anuncia nuevas características, pueden ser añadidas al núcleo de Preact si tiene sentido dado los [Objetivos del Proyecto]. Este es un proceso bastante democrático, evolucionando constantemente a través de discussion y decisiones tomadas abiertamente, usando issues y pull requests.

> Por lo tanto, el sitio web y la documentación reflejan React `15.x` a través de `17.x`, con algunas adiciones de `18.x` y `19.x`, cuando se discute compatibilidad o se hacen comparaciones.

## Mensajes de debug y errores

Nuestra arquitectura flexible permite que los addons mejoren la experiencia de Preact de cualquier forma que deseen. Uno de esos addons es `preact/debug` que añade [advertencias y errores útiles](/guide/v10/debugging) y adjunta la extensión del navegador [Preact Developer Tools](https://preactjs.github.io/preact-devtools/), si está instalada. Estos te guían al desarrollar aplicaciones de Preact y facilitan mucho la inspección de lo que está sucediendo. Puedes habilitarlos agregando la declaración de importación relevante:

```js
import 'preact/debug'; // <-- Agrega esta línea en la parte superior de tu archivo de entrada principal
```

Esto es diferente de React, que requiere que un bundler esté presente y elimine los mensajes de depuración en tiempo de compilación verificando `NODE_ENV != "production"`.

## Características únicas de Preact

Preact en realidad añade algunas características convenientes inspiradas en el trabajo de la comunidad (P)React:

### Soporte nativo para ES Modules

Preact fue construido con los ES Modules en mente desde el principio, y fue uno de los primeros frameworks en soportarlos. Puedes cargar Preact a través de la palabra clave `import` directamente en navegadores sin tener que pasarlo primero por un bundler.

### Argumentos en `Component.render()`

Por conveniencia, pasamos `this.props` y `this.state` al método `render()` en componentes de clase. Echa un vistazo a este componente que usa una prop y una propiedad de estado.

```jsx
// Funciona en Preact y React
class Foo extends Component {
	state = { age: 1 };

	render() {
		return (
			<div>
				Name: {this.props.name}, Age: {this.state.age}
			</div>
		);
	}
}
```

En Preact también puede ser escrito así:

```jsx
// Solo funciona en Preact
class Foo extends Component {
	state = { age: 1 };

	render({ name }, { age }) {
		return (
			<div>
				Name: {name}, Age: {age}
			</div>
		);
	}
}
```

Ambos fragmentos renderizan exactamente lo mismo, los argumentos de render se proporcionan por conveniencia.

### Nombres de atributos/propiedades HTML sin procesar

Preact tiene como objetivo coincidir estrechamente con la especificación del DOM que soportan todos los navegadores principales. Cuando se aplican `props` a un elemento, Preact _detecta_ si cada prop debe establecerse como una propiedad o un atributo HTML. Esto permite establecer propiedades complejas en Elementos Personalizados, pero también significa que puedes usar nombres de atributos como `class` en JSX:

```jsx
// This:
<div class="foo" />

// ...is the same as:
<div className="foo" />
```

La mayoría de los desarrolladores de Preact prefieren usar `class` en lugar de `className` porque es más corto de escribir, pero ambos son compatibles.

### SVG dentro de JSX

SVG es bastante interesante en lo que respecta a los nombres de sus propiedades y atributos. Algunas propiedades (y sus atributos) en objetos SVG están en camelCase (p. ej. [clipPathUnits en un elemento clipPath](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/clipPath#Attributes)), algunos atributos son kebab-case (p. ej. [clip-path en muchos elementos SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation)), y otros atributos (generalmente heredados del DOM, p. ej. `oninput`) están en minúsculas.

Preact aplica los atributos SVG tal como se escriben. Esto significa que puedes copiar y pegar fragmentos SVG sin modificar directamente en tu código y ten hacerlos funcionar sin problemas. Esto permite una mayor interoperabilidad con las herramientas que los diseñadores tienden a usar para generar iconos o ilustraciones SVG.

```jsx
// React
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <circle fill="none" strokeWidth="2" strokeLinejoin="round" cx="24" cy="24" r="20" />
</svg>
// Preact (Tenga en cuenta el stroke-width y stroke-linejoin.)
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <circle fill="none" stroke-width="2" stroke-linejoin="round" cx="24" cy="24" r="20" />
</svg>
```

Si vienes de React, es posible que estés acostumbrado a especificar todos los atributos en camelCase. Puedes continuar usando nombres de atributos SVG en camelCase agregando [preact/compat] a tu proyecto, que refleja la API de React y normaliza estos atributos.

### Usa `onInput` en lugar de `onChange`

En gran medida por razones históricas, la semántica del evento `onChange` de React es en realidad la misma que la del evento `onInput` proporcionado por navegadores, que se soporta en todas partes. El evento `input` es el evento mejor adecuado para la mayoría de los casos donde deseas reaccionar cuando se modifica un control de formulario. En núcleo de Preact, `onChange` es el evento [DOM change](https://developer.mozilla.org/es/docs/Web/API/HTMLElement/change_event) estándar que se dispara cuando el usuario _confirma_ el valor de un elemento.

```jsx
// React
<input onChange={e => console.log(e.currentTarget.value)} />

// Preact
<input onInput={e => console.log(e.currentTarget.value)} />
```

Si estás usando [preact/compat], la mayoría de los eventos `onChange` se convierten internamente a `onInput` para emular el comportamiento de React. Este es uno de los trucos que usamos para garantizar la máxima compatibilidad con el ecosistema de React.

### Constructor de JSX

JSX es una extensión de sintaxis para JavaScript que se convierte a llamadas de función anidadas. La idea de usar estas llamadas anidadas para construir estructuras de árbol es anterior a JSX, y fue popularizada previamente en JavaScript por el proyecto [hyperscript]. Este enfoque tiene valor más allá del alcance del ecosistema de React, por lo que Preact promueve el estándar de comunidad generalizado original. Para una discusión más profunda sobre JSX y su relación con Hyperscript, [lee este artículo sobre cómo funciona JSX](https://jasonformat.com/wtf-is-jsx).

**Source:** (JSX)

```jsx
<a href="/">
	<span>Home</span>
</a>
```

**Output:**

```js
// Preact:
h('a', { href: '/' }, h('span', null, 'Home'));

// React:
React.createElement(
	'a',
	{ href: '/' },
	React.createElement('span', null, 'Home')
);
```

En última instancia, si observas el código de salida generado para una aplicación de Preact, es evidente que un "JSX pragma" más corto sin espacios de nombres es tanto más fácil de leer _como_ más adecuado para optimizaciones como minificación. En la mayoría de las aplicaciones de Preact encontrarás `h()`, aunque realmente no importa qué nombre uses ya que también se proporciona una exportación de alias `createElement`.

### No se necesitan contextTypes

La API de `Context` heredada requiere que los Componentes declaren propiedades específicas usando `contextTypes` o `childContextTypes` de React para recibir esos valores. Preact no tiene este requisito: todos los Componentes reciben todas las propiedades de `context` producidas por `getChildContext()` por defecto.

[project goals]: /about/project-goals
[hyperscript]: https://github.com/dominictarr/hyperscript
[preact/compat]: /guide/v10/getting-started#aliasing-react-to-preact
[mdn's event reference]: https://developer.mozilla.org/en-US/docs/Web/Events
