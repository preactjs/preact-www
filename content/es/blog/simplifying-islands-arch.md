---
title: Simplificando la arquitectura de Islas
date: 2024-10-27
authors:
  - reaper
translation_by:
  - Ezequiel Mastropietro
---

> Esta es una versión ligeramente modificada del escrito original en https://barelyhuman.github.io/preact-islands-diy

# Islas

## Introducción

Esta guía es un recorrido sencillo para entender cómo funciona la arquitectura de islas
y cómo poder configurar la tuya usando herramientas que ya tienes a mano.

Antes que nada, ¿qué son las islas? Puedes leer más sobre su origen en

[Islands Architecture - Jason Miller &rarr;](https://jasonformat.com/islands-architecture/)

## ¿Por qué?

Para muchos desarrolladores que han trabajado con renderizado en servidor por un
tiempo, esperábamos que la tecnología frontend tomara un giro hacia el renderizado
en servidor en algún momento, ya que la obtención y procesamiento de datos casi
siempre es más rápida en el servidor, donde estás más cerca de los datos.

Esa es una de las muchas razones, pero hay otras sobre las que todo el mundo
está debatiendo, así que lo dejaremos a los expertos.

Pasemos a implementar el concepto.

# Empezando

## Implementación básica

La implementación básica se puede generalizar para la mayoría de las apps con
SSR + hidratación en cliente.

Aquí tienes un resumen

1. Renderizar inicialmente la vista en el servidor como una página estática.
2. Hidratar la app en el cliente

Para entrar en los detalles de cada uno.

### Renderizado inicial en el servidor

En este paso, aún construyes el árbol de componentes con la librería UI que estés
usando, Vue, React, Preact, Solid, etc. Y luego aplanas el árbol de componentes para
quedarte solo con los datos estáticos e inmediatamente computables. En este caso,
no se ejecutan efectos secundarios ni código de gestión de estado.

La salida es un documento HTML estático que puedes enviar al cliente.

Ya que esta guía está ligada a [preact](https://preactjs.com/), vamos a usar
una librería del equipo de preact que nos ayuda a lograr esto.

Aquí tienes cómo sería una implementación muy rudimentaria de renderizar un
componente en el servidor.

Estamos usando `express.js` aquí como ejemplo debido a que es la primera elección de
muchos principiantes; el proceso es mayormente el mismo para cualquier otro motor de
servidor que elijas. Hapi, Koa, Fastify, etc.

```js
// server.js
import { h } from 'preact';
import preactRenderToString from 'preact-render-to-string';

// ...configuración restante de express.js

const HomePage = () => {
	return h('h1', {}, 'hello');
};

app.get('/', async (req, res) => {
	res.send(preactRenderToString(h(HomePage, {})));
});
```

Aquí la mayor parte del trabajo la hace `preactRenderToString`, y todo lo que
hacemos es escribir componentes. Con un poco de magia en el bundling, deberíamos
poder escribir en JSX para hacerlo un poco más amigable.

### Hidratar

Bien, un término que verás mucho por ahí.

- Hidratación parcial
- Hidratación progresiva
- añadir más a medida que encuentren más formas

Para decirlo simplemente, es enlazar la interactividad a un elemento del DOM con
estado/efectos/eventos _existentes_.

Ese estado/efectos/eventos _existentes_ podría ser enviado desde el servidor, pero
si trabajas con un componente que puede manejar lo suyo y la lógica está bien
contenida, simplemente montas el componente en el DOM con las ligaduras necesarias.

Como ejemplo, esto podría verse así

```js
// client.js
import { hydrate } from 'preact';
import Counter from './Counter';

const main = () => {
	// suponiendo que el servidor también haya renderizado el componente con el siguiente ID.
	const container = document.getElementById('counter');
	hydrate(h(Counter, {}), container);
};

main();
```

Similar al paso de renderizado en servidor, usamos un helper de `preact` para ayudar
a hidratar un componente. Podrías usar `render`, pero como el elemento ya fue renderizado
por el servidor, renderizarlo otra vez no tendría sentido, así que le pedimos a preact
que intente añadir los eventos y el estado necesarios en su lugar.

Lo que he explicado arriba se llama Hidratación Parcial, puesto que no hidratas la
app entera sino solo ciertas partes.

## Profundizando

No hay mucho más que necesites saber para entender cómo hacer una app basada en la
arquitectura de islas pero, ahora entremos en la implementación.

# El Código

La arquitectura a nivel de código para esto es muy similar a la mayoría de los modelos
SSR y Vite tiene una buena explicación de cómo escribir tu propio ssr con vite

[&rarr; Vite Guides - Server-Side Rendering](https://vitejs.dev/guide/ssr.html)

Nosotros usamos webpack en su lugar, para hacerlo un poco más explícito y fácil de explicar.

> Nota: Puedes obtener el código referenciado en [barelyhuman/preact-islands-diy](http://github.com/barelyhuman/preact-islands-diy/)

## `server/app.js`

Comenzando con el archivo `server/app.js`. Si tienes el código abierto localmente te será
útil al leer esto.

El snippet de código abajo solo resalta las áreas necesarias

```js
import preactRenderToString from 'preact-render-to-string';
import HomePage from '../pages/HomePage.js';
import { h } from 'preact';
import { withManifestBundles } from '../lib/html.js';

const app = express();

app.get('/', async (req, res) => {
	res.send(
		withManifestBundles({
			body: preactRenderToString(h(HomePage, {}))
		})
	);
});
```

Mirando las importaciones, tenemos las mismas importaciones mencionadas en la
sección [Comenzando](#getting-started) y no ha cambiado mucho.

La única adición aquí es el helper `withManifestBundles` que es de lo que hablaremos a continuación.

## `lib/html.js`

El helper de HTML varía en las diferentes variantes de la plantilla, pero solo
recorreremos la versión de `webpack` que está en la rama `main`.

El caso de uso base del helper es poder recorrer un JSON de manifest que lista
qué archivos están siendo bundleados por webpack y sus rutas con hash cuando se
usan en producción.

Esto es requerido puesto que no sabremos el hash y necesitamos una forma programática
de averiguarlo.

Este manifest es generado por la configuración cliente de webpack que revisaremos
en un momento.

```js
// fetch el manifest de la salida del cliente
import manifest from '../../dist/js/manifest.json';

export const withManifestBundles = ({ styles, body }) => {
	// recorrer cada clave del manifiesto y construir
  // una etiqueta de script para cada una.
	const bundledScripts = Object.keys(manifest).map(key => {
		const scriptPath = `/public/js/${manifest[key]}`;
		return `<script src=${scriptPath}></script>`;
	});

	return `<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<style id="_goober">
				${styles}
			</style>
		</head>

		<body>
			${body}
		</body>
		${bundledScripts.join('')}
	</html>`;
};
```

Como se explica en los comentarios, simplemente tomamos todos los archivos que
necesitamos desde el manifest e inyectamos etiquetas `<script>` en el HTML final
que se envía desde el servidor.

Pasando a la configuración que hace posible construir esto.

## `webpack.config.*.js`

Intenté mantener la configuración de webpack lo más mínima posible para no asustar
a la gente, así que revisemos la configuración.

```js
// webpack.config.server.js
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	mode: process.env.NODE_ENV != 'production' ? 'development' : 'production',
	target: 'node',
	entry: path.resolve(__dirname, './src/server/app.js'),
	output: {
		filename: 'server.js',
		path: path.resolve(__dirname, './dist')
	},
	stats: 'errors-warnings',
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [{ test: /\.jsx?$/, loader: 'babel-loader' }]
	},
	externals: [nodeExternals()]
};
```

La mayoría de las opciones no necesitan explicación, y el único loader que tenemos
es `babel-loader` ya que usamos una solución CSS-IN-JS para el estilado.

No hay nada mágico aquí, simplemente le damos el punto de entrada `server/app.js`
y dejamos que lo compile al mismo directorio que la salida del cliente.

Pasando a la configuración del lado cliente, que añade algunas cosas más aparte de
proveer una entrada y obtener una salida.

Esto está acortado para explicar las partes relevantes

```js
// webpack.config.client.js

const entryPoints = glob
	.sync(path.resolve(__dirname, './src/client') + '/**/*.js', {
		absolute: true
	})
	.reduce((acc, path) => {
		const entry = path.match(/[^\/]+\.jsx?$/gm)[0].replace(/.jsx?$/, '');
		acc[entry] = path;
		return acc;
	}, {});
```

Así que la primera sección básicamente encuentra todos los archivos en `src/client`
y crea un objeto de entradas para webpack.

Ejemplo: si `src/client/app.client.js` es un archivo entonces la salida del anterior
sería

```json
{
	"app.client": "./src/client/app.client.js"
}
```

esto no es nada especial, es solo cómo webpack espera que se definan las entradas.

Todo lo demás es configuración genérica que también está presente en el lado del servidor

```js
{
	plugins: [
		new WebpackManifestPlugin({
			publicPath: '',
			basePath: '',
			filter: file => {
				return /\.mount\.js$/.test(file.name);
			}
		})
	];
}
```

Luego tenemos el plugin del manifest, que comprueba los archivos que tienen la cadena
`mount` en su nombre; esto se hace para asegurarnos de que solo se carguen los archivos
de entrada y no archivos aleatorios y lo hacemos especificando un tipo de extensión
específico para el archivo.

Algunos frameworks usan una carpeta `islands` para separar islas de archivos de entrada.
Nosotros en su lugar separamos las entradas de las islas y dejamos que el usuario decida
qué montar como isla y qué no.

El `WebpackManifestPlugin` anterior genera un `manifest.json` en `dist/public/js`
que contiene los nombres de los archivos bundleados que usamos en `lib/html.js`.

## `.babelrc`

Esta es la última parte de la configuración, donde le indicas a babel que el runtime
JSX que use sea el de preact y no el de react.

Bastante autoexplicativo, pero si necesitas detalles sobre la opción revisa la docs de
[babel](https://babeljs.io/) y [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx)

```json
// .babelrc
{
	"plugins": [
		[
			"@babel/plugin-transform-react-jsx",
			{ "runtime": "automatic", "importSource": "preact" }
		]
	]
}
```

## Carpetas

Ahora podemos pasar a la importancia de cada carpeta aquí.

> **Nota**: Ten en cuenta que puedes mezclar y combinar las carpetas si lo necesitas,
> solamente asegúrate de editar las configuraciones para manejar los cambios. Si no,
> la estructura actual es suficientemente buena para la mayoría de aplicaciones

## `client`

El `src/client` en esta rama `main` se usa para escribir el código de `mount` que
se envía con el HTML renderizado.

Añades montados selectivos basados en páginas y selectores que quieras usar, aunque
esto descargue varios archivos JS, esos archivos no deben tener más que el código de
montaje; tus islas deben ser autosuficientes y auto-contenidas. Puedes, sin embargo,
enviar un dataset inicial desde el servidor como un atributo `data-*` pero esto debe
ser serializable o se perderá.

También puedes añadir un wrapper para crear una isla manualmente, pero los
web-components no están ampliamente soportados así que si quieres soporte legado, es
mejor montar manualmente como se mostró arriba.

Ejemplo:

```js
// src/client/index.mount.js

import { h, hydrate } from 'preact';

// configurar goober
import { setup } from 'goober';
setup(h);

// se puede mover a un archivo util y utilizar desde allí,
// en este archivo como ejemplo por ahora.
const mount = async (Component, elm) => {
	if (elm?.dataset?.props) {
		const props = JSON.parse(elm.dataset.props);
		delete elm.dataset.props;
		hydrate(<Component {...props} />, elm);
	}
};

const main = async () => {
	// Carga diferida y vuelve a montar el contador como un componente del lado del cliente si es necesario.
  // Una mejor manera sería verificar si el elemento `counter` existe en
  // el DOM antes incluso de importar el componente para evitar descargas innecesarias
  // de JS.

	const Counter = (await import('../components/Counter.js')).default;
	mount(Counter, document.getElementById('counter'));
};

main();
```

## components

El nombre es bastante obvio; como no hacemos una segregación estricta aquí sobre
qué es y qué no es una isla, puedes poner todos tus componentes aquí como normalmente.

## layouts

Los separo porque me gusta mantener los layouts lejos de los componentes ya que a
veces tienen más que solo condiciones de renderizado. No es necesario en este caso
porque en la mayoría de los casos ejecutarías tus layouts en el servidor y no en el cliente.

## lib

Contiene funciones helper comunes para cliente y servidor, ya que ambos se bundlean
separadamente y las dependencias se inyectan según sea necesario.

## pages

Esta carpeta actúa como almacenamiento para plantillas. Así que todo lo que el servidor
vaya a renderizar como página iría aquí. La capacidad de usar layouts y otros componentes
como en una app normal de preact ayuda a construir plantillas componibles, pero aún así
es más sencillo tenerlas separadas del código de componentes.

## public

Lo que necesite ser entregado estáticamente por express se pone aquí; webpack se
encarga de copiar todo al directorio final.

## server

Autoexplicativo, archivos del lado servidor. En la mayoría de casos te gustaría mover
rutas a archivos separados y quizá añadir middlewares para añadir una función helper
que renderice componentes de preact por ti.

Algo así definitivamente pertenece al servidor y no al cliente, así que mantenlo en esta carpeta.

Ejemplo

```js
app.use((req, res, next) => {
	res.render = (comp, data) => {
		return res.write(preactRenderToString(h(comp, { ...data })));
	};
});

// y en algún otro lugar de la aplicación

const handler = (req, res) => {
	return res.status(200).render(Homepage, { username: 'reaper' });
};
```

Eso es realmente todo el código que contribuye a configurar tu propia hidratación
parcial / arquitectura de islas con nodejs.

La mayor parte de esto se puede lograr con casi todos los bundlers y con un poco más
de modificación en cómo se generan las configuraciones, puedes lograr una experiencia
de desarrollo similar a la de astro aunque es mejor usar astro si no te apetece mantener
configs manualmente.
