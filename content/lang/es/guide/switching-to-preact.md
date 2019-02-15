---
name: Cambiando a Preact
permalink: '/guide/switching-to-preact
---

# Cambiar a Preact (desde React)

Hay dos formas distintas de moverse de React a Preact:

1. Instalar el alias de`preact-compat`
2. Modificar tus imports a `preact` y eliminar el código incompatible

## Fácil: Alias de `preact-compat`

Cambiar a Preact puede ser tan simple como instalar y usar el alias de `preact-compat` en `react` and y `react-dom`.
Esto te permite continuar escribiendo código de React/ReactDOM sin hacer cambios en tu flujo de trabajo o código.
`preact-compat` agrega unos 2kb a tu bundle, pero tiene la ventaja de soportar la gran mayoría de los modulos de React que puedes encontrar en npm. El paquete `preact-compat` provee todos las modificaciones necesarias sobre el núcleo de Preact para hacerlo andar como `react` y `react-dom`, en un solo módulo.

El proceso de instalación consta de dos pasos.
Primero, tienes que instalar preact y preact-compat (son paquetes separados):

```sh
npm i -S preact preact-compat
```

Con esas dependencias instaladas, configura tu sistema de build para incluir el alias de imports de React para que apunten a Preact en su lugar.


### Cómo hacer el alias de preact-compat

Ahora que tienes las dependencias instaladas, necesitas configurar tu sistema de build para redirigir cualquier import/require que busque por `react` or `react-dom` a `preact-compat`.

#### Alias con Webpack

Simplemente agrega la siguiente configuración de [resolve.alias](https://webpack.github.io/docs/configuration.html#resolve-alias)
en tu `webpack.config.js`:

```json
{
  "resolve": {
    "alias": {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  }
}
```

#### Alias con Browserify

Si usas Browserify, los alias se pueden definir agregando la transformación de [aliasify](https://www.npmjs.com/package/aliasify).

Primero, instala la transformación:  `npm i -D aliasify`

Luego, en tu `package.json`, dile a aliasify que redirija tus import de react a preact-compat:

```json
{
  "aliasify": {
    "aliases": {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  }
}
```

#### Alias manual

Si no usas un sistema de build o quieres cambiar permanentemente a `preact-compat`,
También puedes buscar y reemplazar todos los imports/requires en tu código que es básicamente lo que hace el alias:

> **buscar:**    `(['"])react(-dom)?\1`
>
> **reemplazar:** `$1preact-compat$1`

En este caso probablemente tenga más sentido cambiar directamente a `preact`, en vez de depender de `preact-compat`.
El núcleo de Preact es completo y muchos proyectos de React pueden de hecho pasarse a `preact` con muy poco esfuerzo.
Este enfoque se cubre en la siguiente sección.


### Build y Test

**Ya estás list@!**
Ahora cuando corras tu build, todos los imports de React van a importar `preact-compat` y tu bundle va a ser mucho más pequeño.
Es siempre una buena idea correr tu suite de tests y obviamente cargar tu aplicación para ver como funciona.


---


## Óptimo: Cambiarse a Preact

No necesitas usar `preact-compat` en tu código para migrar de React a Preact.
La API de Preact es casi idéntica a la de React, y muchos proyectos de React pueden ser migrados con pocos cambios o en algunos casos incluso sin tocar el código.

En general, este proceso de cambiar a Preact envuelve unos pocos pasos:

### 1. Instalar Preact

Este es simple: Tienes que instalar la librería para poder usarla!

```sh
npm install --save preact  # ó: npm i -S preact
```

### 2. JSX Pragma: transpilar a `h()`

> **Trasfondo:** Aunque la extensión del lenguaje[JSX] es independiente de React, transpiladores populares
> como [Babel] o [Bublé] convierten JSX por defecto en llamados a `React.createElement()`.
> Existen razones históricas para esto, pero vale la pena entender que las llamadas de función a las que JSX
> transpila son realmente una tecnología preexistente llamada [Hyperscript]. Preact usa esto
> e intenta promover un mejor entendimiento de la simplicidad de JSX usando `h()`
> como su [JSX Pragma].
>
> **TL;DR:** Necesitamos cambiar `React.createElement()` a `h()`

En JSX, el "pragma" es el nombre de la función que maneja la creación de cada elemento:

> `<div />` transpila a `h('div')`
>
> `<Foo />` transpila a `h(Foo)`
>
> `<a href="/">Hola</a>` a `h('a', { href:'/' }, 'Hola')`

En cada uno de los ejemplos anteriores, `h` es el nombre de la función que declaramos como el JSX Pragma.


#### Vía Babel

Si estás usando Babel, puedes setear el JSX Pragma en tu `.babelrc` o el `package.json` (lo que prefieras):

```json
{
  "plugins": [
    ["transform-react-jsx", { "pragma": "h" }]
  ]
}
```


#### Usando comentarios

Si estás trabajando en un editor online que usa Babel (como JSFiddle o Codepen),
puedes setear el JSX Pragma definiendo un comentario cerca del comienzo de tu código:

`/** @jsx h */`


#### Con Bublé

[Bublé] viene con soporte de JSX por defecto. Solo tienes que setear la opción de `jsx`:

`buble({ jsx: 'h' })`


### 3. Actualizar código antiguo

Si bien Preact intenta ser API-compatible con React, hay porciones de la interface que fueron intencionalmente no incluidos.
El más notorio es `createClass()`. Las opiniones son variadas en el tema de clases y POO, pero vale la pena entender que las clases de JavaScript están en las librerías de VDOM para representar tipos de componentes, que es importante cuando trabajamos con el manejo del ciclo de vida de componentes.

Si tu proyecto depende fuertemente en `createClass()`, todavía tienes una gran opción:
Laurence Dorman mantiene una [implementación standalone de `createClass()`](https://github.com/ld0rman/preact-classless-component)
que funciona directamente con preact y pesa unos pocos cientos de bytes.
Alternativamente, puedes convertir automáticamente tus llamados a `createClass()` en clases de ES2015 usando [preact-codemod](https://github.com/vutran/preact-codemod) por Vu Tran.

Otra diferencia que debemos notar es que Preact solo soporta funciones como Refs por defecto.
Los String refs están deprecados en React y van a ser eliminados pronto, esto se debe a que introducen una sorprendente cuota de complejidad y muy poco beneficio.
Si quieres seguir usando String refs, [esta pequeña funcion linkedRef](https://gist.github.com/developit/63e7a81a507c368f7fc0898076f64d8d)
ofrece una versión que va a funcionar en el futuro que popula`this.refs.$$` como hacen las String Refs. La simplicidad de este pequeño wrapper sobre las Function Refs también ayuda a ilustrar por qué las Function Refs son ahora la elección de preferencia.


### 4. Simplificando el renderizado de la raíz

Desde React 0.13, `render()` es provisto por el módulo `react-dom`.
Preact no usa un módulo separado para hacer DOM rendering, porque está enfocado solamente en ser un gran DOM renderer.
Entonces, el último paso para convertir tu código a Preact es cambiar `ReactDOM.render()` en el `render()` de Preact:

```diff
- ReactDOM.render(<App />, document.getElementById('app'));
+ render(<App />, document.body);
```

Es también interestante ver que el `render()` de Preact es no-destructivo, entonces dibujar en el `<body>` está perfecto (recomendado, de hecho).
Esto es posible porque Preact no asume que controla todo el elemento raíz que le pases.  El segundo argumento a `render()`
es de hecho el `padre` - es decir el elemento de DOM _dentro_ del que dibujamos.  si quieres redibujar desde la raíz (quizás para Hot
Module Replacement), `render()` acepta un elemento a reemplazar como su tercer argumento:

```js
// render inicial:
render(<App />, document.body);

// actualizar en el lugar:
render(<App />, document.body, document.body.lastElementChild);
```

En el ejemplo anterior,  estamos usando que el último hijo es la raíz que dibujamos anteriormente.
Mientras que esto funciona en muchos casos (jsfiddles, codepens, etc), lo mejor es tener mayor control.
Es por eso que `render()` retorna el elemento raíz: Lo pasas como el tercer argumento para redibujar en el lugar.
El siguiente ejemplo muestra como redibujar en respuesta del módulo Hot Module Replacement de Webpack cuando hay un cambio:

```js
// El root contiene el nodo raíz de nuestra app:
let root;

function init() {
  root = render(<App />, document.body, root);
}
init();

// ejemplo: Redibujar cuando Webpack HMR cambia:
if (module.hot) module.hot.accept('./app', init);
```

La técnica completa puede ser vista en [preact-boilerplate](https://github.com/developit/preact-boilerplate/blob/master/src/index.js#L6-L18).


[babel]: https://babeljs.io
[bublé]: https://buble.surge.sh
[JSX]: https://facebook.github.io/jsx/
[JSX Pragma]: http://www.jasonformat.com/wtf-is-jsx/
[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[hyperscript]: https://github.com/dominictarr/hyperscript
