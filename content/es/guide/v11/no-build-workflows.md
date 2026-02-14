---
title: Flujos de Trabajo sin Compilación
description: Aunque herramientas de compilación como Webpack, Rollup y Vite son increíblemente poderosas y útiles, Preact soporta completamente la construcción de aplicaciones sin ellas
translation_by:
  - Ezequiel Mastropietro
---

# Flujos de Trabajo sin Compilación

Aunque herramientas de compilación como Webpack, Rollup y Vite son increíblemente poderosas y útiles, Preact soporta completamente la
construcción de aplicaciones sin ellas.

Los flujos de trabajo sin compilación son una forma de desarrollar aplicaciones web renunciando a herramientas de compilación, en su lugar confiando en el navegador
para facilitar la carga y ejecución de módulos. Esta es una excelente manera de comenzar con Preact y puede continuar funcionando
muy bien en todas las escalas.

---

<toc></toc>

---

## Mapas de Importación

Un [Mapa de Importación](https://developer.mozilla.org/es/docs/Web/HTML/Element/script/type/importmap) es una característica más nueva del navegador que te permite controlar cómo los navegadores resuelven los especificadores de módulos, a menudo para convertir especificadores simples como `preact` a una URL de CDN como `https://esm.sh/preact`. Aunque muchos prefieren la estética que los mapas de importación pueden proporcionar, también hay ventajas objetivas de la centralización de dependencias como un manejo de versiones más fácil, reducción/eliminación de duplicación, y mejor acceso a características más poderosas del CDN.

Generalmente recomendamos usar mapas de importación para aquellos que eligen prescindir de herramientas de compilación ya que evitan algunos problemas que puedes encontrar usando URLs de CDN simples en tus especificadores de importación (más sobre eso a continuación).

### Uso Básico

[MDN](https://developer.mozilla.org/es/docs/Web/HTML/Element/script/type/importmap) tiene una gran cantidad de información sobre cómo utilizar mapas de importación, pero un ejemplo básico se ve como sigue:

```html
<!DOCTYPE html>
<html>
	<head>
		<script type="importmap">
			{
				"imports": {
					"preact": "https://esm.sh/preact@10.23.1",
					"htm/preact": "https://esm.sh/htm@3.1.1/preact?external=preact"
				}
			}
		</script>
	</head>
	<body>
		<div id="app"></div>

		<script type="module">
			import { render } from 'preact';
			import { html } from 'htm/preact';

			export function App() {
				return html`
					<h1>Hello, World!</h1>
				`;
			}

			render(
				html`<${App} />`,
				document.getElementById('app')
			);
		</script>
	</body>
</html>
```

Creamos una etiqueta `<script>` con un atributo `type="importmap"`, y luego definimos los módulos que nos gustaría usar dentro de ella como JSON. Más tarde, en una etiqueta `<script type="module">`, podemos importar estos módulos usando especificadores simples, similar a lo que verías en Node.

> **Importante:** Usamos `?external=preact` en el ejemplo anterior ya que https://esm.sh proporciona útilmente el módulo que estás pidiendo, así como sus dependencias -- para `htm/preact`, esto significa también proporcionar una copia de `preact`. Sin embargo, Preact debe ser usado solo como un singleton con sol una sola copia incluída en tu aplicación.
>
> Al usar `?external=preact`, le decimos a `esm.sh` que no debería proporcionar una copia de `preact`, podemos lidiar con eso nosotros mismos. Por lo tanto, el navegador usará nuestro importmap para resolver `preact`, usando la misma instancia de Preact que el resto de nuestro código.

### Recetas y Patrones Comunes

Aunque no es una lista exhaustiva, aquí hay algunos patrones comunes y recetas que puedas encontrar útiles al trabajar con mapas de importación. Si tienes un patrón que te gustaría ver, [ádenoselo](https://github.com/preactjs/preact-www/issues/new)!

Para estos ejemplos estaremos usando https://esm.sh como nuestro CDN -- es un CDN brillante orientado a ESM que es un poco más flexible y poderoso que algunos otros, pero de ninguna manera estás limitado a él. De cualquier forma que elijas servir tus módulos, asegúrate de estar familiarizado con la política con respecto a dependencias: la duplicación de `preact` y algunas otras librerías causará problemas (a menudo sutiles e inesperados). Para `esm.sh`, abordamos esto con el parámetro de consulta `?external`, pero otros CDNs podrían funcionar de manera diferente.

#### Preact with Hooks, Signals, and HTM

```html
<script type="importmap">
	{
		"imports": {
			"preact": "https://esm.sh/preact@10.23.1",
			"preact/": "https://esm.sh/preact@10.23.1/",
			"@preact/signals": "https://esm.sh/@preact/signals@1.3.0?external=preact",
			"htm/preact": "https://esm.sh/htm@3.1.1/preact?external=preact"
		}
	}
</script>
```

#### Aliasing React to Preact

```html
<script type="importmap">
	{
		"imports": {
			"preact": "https://esm.sh/preact@10.23.1",
			"preact/": "https://esm.sh/preact@10.23.1/",
			"react": "https://esm.sh/preact@10.23.1/compat",
			"react/": "https://esm.sh/preact@10.23.1/compat/",
			"react-dom": "https://esm.sh/preact@10.23.1/compat",
			"@mui/material": "https://esm.sh/@mui/material@5.16.7?external=react,react-dom"
		}
	}
</script>
```

## HTM

Aunque JSX es generalmente la forma más popular de escribir aplicaciones Preact, requiere un paso de compilación para convertir la sintaxis no estándar en algo que los navegadores y otros runtimes puedan entender de forma nativa. Escribir llamadas `h`/`createElement` a mano puede ser un poco tedioso aunque con ergonómicas menos que ideales, por lo que en su lugar recomendamos una alternativa similar a JSX llamada [HTM](https://github.com/developit/htm).

En lugar de requerir un paso de compilación (aunque puede usar uno, ver [`babel-plugin-htm`](https://github.com/developit/htm/tree/master/packages/babel-plugin-htm)), HTM usa la sintaxis de [Plantillas Etiquetadas](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Template_literals#plantillas_etiquetadas), una característica de JavaScript que existe desde 2015 y se soporta en todos los navegadores modernos. Esta es una forma cada vez más popular de escribir aplicaciones Preact y es probablemente la más popular para aquellos que eligen prescindir de un paso de compilación.

HTM soporta todas las características estándar de Preact, incluyendo Componentes, Hooks, Señales, etc., la única diferencia siendo la sintaxis usada para escribir el valor de retorno "JSX".

```js
// --repl
import { render } from 'preact';
// --repl-before
import { useState } from 'preact/hooks';
import { html } from 'htm/preact';

function Button({ action, children }) {
	return html`
		<button onClick=${action}>${children}</button>
	`;
}

function Counter() {
	const [count, setCount] = useState(0);

	return html`
		<div class="counter-container">
			<${Button} action=${() => setCount(count + 1)}>Increment<//>
			<input readonly value=${count} />
			<${Button} action=${() => setCount(count - 1)}>Decrement<//>
		</div>
	`;
}

render(
	html`<${Counter} />`,
	document.getElementById('app')
);
```
