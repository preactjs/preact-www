---
title: Comenzando
description: Cómo empezar con Preact. Aprenderemos cómo configurar las herramientas (si las hay) y comenzar a escribir una aplicación
translation_by:
  - Ezequiel Mastropietro
---

# Comenzando

¿Nuevo en Preact? ¿Nuevo en Virtual DOM? Consulta el [tutorial](/tutorial).

Esta guía te ayuda a empezar y comenzar a desarrollar aplicaciones Preact, usando 3 opciones populares.
Si eres nuevo en Preact, recomendamos comenzar con [Vite](#create-a-vite-powered-preact-app).

---

<toc></toc>

---

## Ruta sin herramientas de compilación

Preact está empaquetado para ser usado directamente en el navegador, y no requiere ninguna compilación o herramientas:

```html
<script type="module">
	import { h, render } from 'https://esm.sh/preact';

	// Crea tu app
	const app = h('h1', null, 'Hello World!');

	render(app, document.body);
</script>
```

[🔨 Edítelo en Glitch](https://glitch.com/~preact-no-build-tools)

La desventaja principal de desarrollar de esta forma es la falta de JSX, que requiere un paso de compilación. Una alternativa ergonómica y performante a JSX se documenta en la siguiente sección.

### Alternativas a JSX

Escribir llamadas raw `h` o `createElement` puede ser tedioso. JSX tiene la ventaja de parecer similar a HTML, lo que lo hace más fácil de entender para muchos desarrolladores en nuestra experiencia. Sin embargo, JSX requiere un paso de compilación, por lo que altamente recomendamos una alternativa llamada [HTM][htm].

[HTM][htm] es una sintaxis similar a JSX que funciona en JavaScript estándar. En lugar de requerir un paso de compilación, utiliza la sintaxis de [Plantillas Etiquetadas](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Template_literals#plantillas_etiquetadas) propia de JavaScript, que fue añadida en 2015 y se soporta en [todos los navegadores modernos](https://caniuse.com/#feat=template-literals). Esta es una forma cada vez más popular de escribir aplicaciones Preact, ya que hay menos partes móviles que entender que en una configuración tradicional de herramientas de construcción frontend.

```html
<script type="module">
	import { h, render } from 'https://esm.sh/preact';
	import htm from 'https://esm.sh/htm';

	// Inicializa htm con Preact
	const html = htm.bind(h);

	function App(props) {
		return html`
			<h1>Hello ${props.name}!</h1>
		`;
	}

	render(
		html`<${App} name="World" />`,
		document.body
	);
</script>
```

[🔨 Edítelo en Glitch](https://glitch.com/~preact-with-htm)

> **Consejo:** HTM también proporciona una versión conveniente de Preact con una única importación:
>
> `import { html, render } from 'https://esm.sh/htm/preact/standalone'`

Para una solución más escalable, consulta [Mapas de Importación -- Uso Básico](/guide/v11/no-build-workflows#basic-usage), y para más información sobre HTM, consulta su [documentación][htm].

[htm]: https://github.com/developit/htm

## Crear una aplicación Preact con Vite

[Vite](https://vitejs.dev) se ha convertido en una herramienta increíblemente popular para construir aplicaciones en muchos frameworks en los últimos años, y Preact no es la excepción. Está construido sobre herramientas populares como ES modules, Rollup, y ESBuild. Vite, a través de nuestro inicializador o su plantilla de Preact, no requiere configuración o conocimiento previo para comenzar, y esta simplicidad lo hace una forma muy popular de usar Preact.

Para empezar rápidamente con Vite, puedes usar nuestro inicializador `create-preact`. Esta es una aplicación de interfaz de línea de comandos (CLI) interactiva que se puede ejecutar en la terminal en tu máquina. Usándola, puedes crear una nueva aplicación ejecutando lo siguiente:

```bash
npm init preact
```

Esto te guiará a través de la creación de una nueva aplicación Preact y te dará algunas opciones como soporte para TypeScript, enrutamiento (vía `preact-iso`), y soporte para ESLint.

> **Consejo:** Ninguna de estas decisiones necesita ser final, siempre puedes añadir o eliminar de tu proyecto más tarde si cambias de opinión.

### Listarse para el desarrollo

Ahora estamos listos para iniciar nuestra aplicación. Para iniciar un servidor de desarrollo, ejecuta el siguiente comando dentro de tu carpeta de proyecto recién generada:

```bash
# Ve a la carpeta del proyecto generado
cd my-preact-app

# Inicia un servidor de desarrollo
npm run dev
```

Una vez que el servidor haya comenzado, imprimira una URL de desarrollo local para abrir en tu navegador.
¡Ahora estás listo para comenzar a codificar tu aplicación!

### Hacer una compilación de producción

Llega un momento en el que necesitas desplegar tu aplicación en algún lugar. Vite viene con un práctico comando `build` que generará una compilación de producción altamente optimizada.

```bash
npm run build
```

Al completarse, tendrás una nueva carpeta `dist/` que se puede desplegar directamente en un servidor.

> Para una lista completa de todos los comandos disponibles y sus opciones, consulta la [Documentación de la CLI de Vite](https://vitejs.dev/guide/cli.html).

## Integrando en un Pipeline Existente

Si ya tienes un pipeline de herramientas existente configurado, es muy probable que esto incluya un bundler. Las opciones más populares son [webpack](https://webpack.js.org/), [rollup](https://rollupjs.org) o [parcel](https://parceljs.org/). ¡Preact funciona de inmediato con todos ellos, sin cambios importantes necesarios!

### Configurando JSX

Para transpilar JSX, necesitas un plugin de Babel que lo convierta en código JavaScript válido. El que todos usamos es [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx). Una vez instalado, necesitas especificar la función para JSX que debe usarse:

```json
{
	"plugins": [
		[
			"@babel/plugin-transform-react-jsx",
			{
				"pragma": "h",
				"pragmaFrag": "Fragment"
			}
		]
	]
}
```

> [Babel](https://babeljs.io/) tiene algunas de las mejores documentaciones por ahí. Altamente recomendamos consultarla para preguntas sobre Babel y cómo configurarlo.

### Aliasing React a Preact

En algún momento, probablemente querrás hacer uso del vasto ecosistema de React. Las librerías y Componentes originalmente escritos para React funcionan sin problemas con nuestra capa de compatibilidad. Para hacer uso de ella, necesitamos apuntar todas las importaciones de `react` y `react-dom` a Preact. Este paso se llama _aliasing_.

> **Nota:** Si estás usando Vite (vía `@preact/preset-vite`), Preact CLI, o WMR, estos alias se manejan automáticamente para ti por defecto.

#### Aliasing en Webpack

Para hacer alias de cualquier paquete en Webpack, necesitas agregar la sección `resolve.alias` a tu configuración. Dependiendo de la configuración que uses, esta sección puede ya estar presente, pero faltando los alias para Preact.

```js
const config = {
	//...
	resolve: {
		alias: {
			react: 'preact/compat',
			'react-dom/test-utils': 'preact/test-utils',
			'react-dom': 'preact/compat', // Debe estar debajo de test-utils
			'react/jsx-runtime': 'preact/jsx-runtime'
		}
	}
};
```

#### Aliasing en Node

Cuando se ejecuta en Node, los alias de bundler (Webpack, Rollup, etc.) no funcionan, como se puede ver en NextJS. Para arreglarlo, podemos usar alias directamente en nuestro `package.json`:

```json
{
	"dependencies": {
		"react": "npm:@preact/compat",
		"react-dom": "npm:@preact/compat"
	}
}
```

#### Aliasing en Parcel

Parcel usa el archivo estándar `package.json` para leer opciones de configuración bajo una clave `alias`.

```json
{
	"alias": {
		"react": "preact/compat",
		"react-dom/test-utils": "preact/test-utils",
		"react-dom": "preact/compat",
		"react/jsx-runtime": "preact/jsx-runtime"
	}
}
```

#### Aliasing en Rollup

Para hacer alias dentro de Rollup, necesitarás instalar [@rollup/plugin-alias](https://github.com/rollup/plugins/tree/master/packages/alias). El plugin necesitará ser colocado antes de tu [@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve)

```js
import alias from '@rollup/plugin-alias';

module.exports = {
	plugins: [
		alias({
			entries: [
				{ find: 'react', replacement: 'preact/compat' },
				{ find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
				{ find: 'react-dom', replacement: 'preact/compat' },
				{ find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' }
			]
		})
	]
};
```

#### Aliasing en Jest

[Jest](https://jestjs.io/) permite la reescritura de rutas de módulos similar a los bundlers. Estas reescrituras se configuran usando expresiones regulares en tu configuración de Jest:

```json
{
	"moduleNameMapper": {
		"^react$": "preact/compat",
		"^react-dom/test-utils$": "preact/test-utils",
		"^react-dom$": "preact/compat",
		"^react/jsx-runtime$": "preact/jsx-runtime"
	}
}
```

#### Aliasing en TypeScript

TypeScript, incluso cuando se usa junto con un bundler, tiene su propio proceso de resolución de tipos. Para garantizar que se usen los tipos de Preact en lugar de los de React, querrás agregar la siguiente configuración a tu `tsconfig.json` (o `jsconfig.json`):

```json
{
  "compilerOptions": {
    ...
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

Además, es posible que desees habilitar `skipLibCheck` como lo hacemos en el ejemplo anterior. Algunas librerías de React usan tipos que pueden no ser proporcionados por `preact/compat` (aunque hacemos nuestro mejor para arreglar esto), y como tal, estas librerías podrían ser la fuente de errores de compilación de TypeScript. Al establecer `skipLibCheck`, puedes decirle a TS que no necesita hacer una verificación completa de todos los archivos `.d.ts` (generalmente limitados a tus librerías en `node_modules`) lo que corregirá estos errores.

#### Aliasing con Mapas de Importación

```html
<script type="importmap">
	{
		"imports": {
			"preact": "https://esm.sh/preact@10.23.1",
			"preact/": "https://esm.sh/preact@10.23.1/",
			"react": "https://esm.sh/preact@10.23.1/compat",
			"react/": "https://esm.sh/preact@10.23.1/compat/",
			"react-dom": "https://esm.sh/preact@10.23.1/compat"
		}
	}
</script>
```

Consulta también [Mapas de Importación -- Recetas y Patrones Comunes](/guide/v11/no-build-workflows#recipes-and-common-patterns) para más ejemplos.
