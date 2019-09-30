---
name: Getting Started
permalink: '/guide/getting-started'
---

# Primeros pasos

Esta guía lo ayuda a comenzar a desarrollar aplicaciones Preact. Hay 3 formas populares de hacerlo.

##

Si recién está comenzando, le recomendamos ir con [preact-cli](#best-practices-powered-with-preact-cli).


+ [No hay ruta de herramientas de construcción](#no-build-tools-route)
	+ [Alternativas a JSX](#alternatives-to-jsx)
+ [Mejores prácticas basadas en `preact-cli`](#best-practices-powered-with-preact-cli)
	+ [Preparándose para el desarrollo](#getting-ready-for-development)
	+ [Hacer una construcción de producción](#making-a-production-build)
+ [Integración en una tubería existente](#integrating-into-an-existing-pipeline)
	+ [Configurando JSX](#setting-up-jsx)
	+ [Aliasing de Reaccionar a Preact](#aliasing-react-to-preact)
		+ [Aliasing en webpack](#aliasing-in-webpack)
		+ [Aliasing en parcel](#aliasing-in-parcel)
		+ [Aliasing en jest](#aliasing-in-jest)



## No hay ruta de herramientas de construcción

Preact se ha empaquetado fácilmente para usarlo directamente en el navegador. Esto no requiere ninguna herramienta de compilación en absoluto.


```js
import { h, Component, render } from 'https://unpkg.com/preact';

// Create your app
const app = h('div', null, 'Hello World!');

// Inject your application into the an element with the id `app`.
// Make sure that such an element exists in the dom ;)
render(app, document.getElementById('app'));
```

La única diferencia es que no puede usar JSX, porque JSX necesita ser transpilado. Te cubrimos con una alternativa en la siguiente sección. Así que sigue leyendo.


### Alternativas a JSX 

Escribir llamadas sin formato `h` o `createElement` todo el tiempo es mucho menos divertido que usar algo similar a JSX. JSX tiene la ventaja de tener un aspecto similar al HTML, lo que hace que sea más fácil de entender para muchos desarrolladores en nuestra experiencia. Sin embargo, requiere un paso integrado, por lo que recomendamos una alternativa llamada [htm](https://github.com/developit/htm). 

En pocas palabras, [htm](https://github.com/developit/htm) se puede describir mejor como: sintaxis similar a JSX en JavaScript sin necesidad de un transpilador. En lugar de usar una sintaxis personalizada, se basa en cadenas de plantillas con etiquetas nativas que se agregaron a JavaScript hace un tiempo.

```js
import { h, Component, render } from 'https://unpkg.com/preact';
import htm from 'https://unpkg.com/htm';

// Initialize htm with Preact
const html = htm.bind(h);

const app = html`<div>Hello World!</div>`
render(app, document.getElementById('app'));
```
Es una forma muy popular de escribir aplicaciones Preact y le recomendamos que consulte el archivo [README](https://github.com/developit/htm) de htm si está interesado en seguir esta ruta.


## Mejores prácticas con `preact-cli`

El proyecto `preact-cli` es una solución preparada para agrupar aplicaciones Preact con la configuración óptima de agrupador que es mejor para la aplicación web moderna. Se basa en proyectos de herramientas estándar como `webpack`, `babel` y `postcss`. Debido a la simplicidad, esta es la forma más popular de utilizar Preact entre nuestros usuarios.

Como su nombre lo indica, `preact-cli` es una herramienta de línea de comandos que se puede ejecutar en el terminal de su máquina. Instálelo globalmente ejecutando:

```node 
 npm install -g preact-cli
```

Después de eso, tendrá un nuevo comando en su terminal llamado `preact`. Con él puedes crear una nueva aplicación ejecutando el siguiente comando:

```node 
 preact create default my-project
```

El comando anterior extrae la plantilla de `preactjs-templates/default`, solicita información y genera el proyecto en `./my-project/`.

> Consejo: Cualquier repositorio de Github con una carpeta `'template'` puede usarse como plantilla personalizada: 
`preact create <username>/<repository> <project-name>`.



### Preparándose para el desarrollo

Ahora estamos listos para comenzar nuestra aplicación. Para iniciar el servidor de desarrollo, ejecute el siguiente comando dentro de la carpeta del proyecto recién generado (`my-project` en este ejemplo):

```node 
# Go into the generated project folder
cd my-project/

# Start the devserver
npm run dev
```

Una vez que el servidor está activo, puede acceder a su aplicación en la URL que se imprimió en la consola. ¡Ahora estás listo para desarrollar tu aplicación!


### Realiza una compilación para producción 

Llega un momento en que debe implementar su aplicación en algún lugar. La CLI entrega un práctico comando `build` que generará una compilación altamente optimizada para su ambiente de producción.

```node 
npm run build
```

Al finalizar, tendrá una nueva carpeta `build/` que se puede implementar directamente en un servidor.

> Para obtener una lista completa de todos los comandos disponibles, consulte la lista en el archivo [README](https://github.com/preactjs/preact-cli#cli-options) de preact-cli.


## Integración en una tubería existente

Si ya tiene una tubería de herramientas existente configurada, es muy probable que esto incluya un paquete. Las opciones más populares son paquete [webpack](https://webpack.js.org/), [rollup](https://rollupjs.org/) o [parcel](https://parceljs.org/). Preact funciona de fábrica con todos ellos. ¡No se necesitan cambios!



### Configuración de JSX 

Para transpilar JSX, necesita un complemento de babel que lo convierta en un código JavaScript válido. 
El que todos usamos es [@babel/plugin-transform-react-jsx](https://webpack.js.org/). Una vez instalado, debe especificar la función para JSX que debe usarse:


```json
{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "pragma": "h",
      "pragmaFrag": "Fragment",
    }]
  ]
}
```


> [babeljs](https://babeljs.io/) tiene una de las mejores documentaciones que existen. Recomendamos encarecidamente consultarlo en busca de preguntas sobre babel y cómo configurarlo.


### Aliasing de Reaccionar a Preact

En algún momento, probablemente querrás utilizar el vasto ecosistema de reacción. Las bibliotecas y componentes escritos originalmente para React funcionan a la perfección con nuestra capa de compatibilidad. Para utilizarlo, debemos señalar todas las importaciones de `react` y `react-dom` a Preact. Este paso se llama aliasing.


#### Aliasing en webpack

Para crear un alias de cualquier paquete en el paquete web, debe agregar la sección `resolve.alias` a su configuración. Dependiendo de la configuración que esté utilizando, esta sección ya puede estar presente, pero le faltan los alias para Preact.

```js
const config = { 
   //...snip
  "resolve": { 
    "alias": { 
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
     // Must be below test-utils
    },
  }
}
```
#### Aliasing en Parcel

Parcel usa el archivo `package.json` estándar para leer las opciones de configuración bajo una clave de `alias`.

```json
{
  "alias": {
    "react": "preact/compat",
    "react-dom/test-utils": "preact/test-utils",
    "react-dom": "preact/compat"
  },
}
```

#### Aliasing en Jest

Similar a los paquetes, [jest](https://jestjs.io/) permite reescribir las rutas de los módulos. La sintaxis es un poco diferente, por ejemplo, en webpack, porque se basa en expresiones regulares. Agregue esto a su configuración de jest:

```json
{
  "moduleNameMapper": {
    "react": "preact/compat"
    "react-dom/test-utils": "preact/test-utils"
    "react-dom": "preact/compat"
  }
}
```

