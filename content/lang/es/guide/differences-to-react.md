---
name: Diferencias con React
permalink: '/guide/differences-to-react'
---

# Diferencias con React

Preact no pretende ser una reimplementación de React. Existen diferencias. Muchas de estas son triviales, o pueden ser completamente eliminadas utilizando [preact-compat], que es una fina capa sobre Preact que intenta mantener 100% compatibilidad con React.

La razón por la que Preact no intenta incluir absolutamente todas las características de React es para mantenerse **pequeño** y **enfocado** - de otro modo tendría más sentido enviar optimizaciones al proyecto React, que ya es suficientemente complejo y con una estructura de código muy bien diseñada.


## Compatibilidad de versiones

Tanto para Preact como para [preact-compat], la compatibilidad de versiones es medida contra el _actual_ y _anterior_ release **mayor** de React. Cuando se anuncian nuevas características desde el equipo de React, pueden ser agregadas al núcleo de Preact si tiene sentido dadas las [Metas del Proyecto]. Este es un proceso democrático, evolucionando constantemente la discusión y tomando las decisiones públicamente, usando issues y pull requests.

> Así, el sitio web y la documentación reflejan React `0.14.x` y `0.15.x` cuando se discute compatibilidad o se hacen comparaciones.


## ¿Qué está incluido?

- [Componentes de Clases de ES6]
    - _Las clases proveen una forma expresiva e definir componentes que poseen estado_
- [Componentes de Alto Orden]  
    - _Componentes que devuelven otros componentes desde `render()`, efectivamente son wrappers_
- [Componentes funcionales puros sin estado]  
    - _funciones que reciven `props` como argumentos y retornan JSX/VDOM_
- [Contextos]: El soporte para `context` fue agregado en Preact [3.0].
    - _El Contexto es una característica experimental de React, pero fue adoptado por algunas librerías._
- [Refs]: El soporte de funciones refs fue agregador en Preact [4.0]. Los String refs son soportados por `preact-compat`.
    - _Los Refs proveen una forma de referirse a elementos dibujados y elementos hijo._
- Virtual DOM Diffing
    - _Esto está dado por sentado - El diff de Preact es simple pero efectivo, y **[extremadamente](http://developit.github.io/js-repaint-perfs/) [rápido](https://localvoid.github.io/uibench/)**._
- `h()`, Una versión generalizada de `React.createElement`
    - _Esta idea fue originalmente llamada [hyperscript] y tiene valor más allá del ecosistema de React, por eso Preact promueve el estándar original. ([Leer: why `h()`?](http://jasonformat.com/wtf-is-jsx))_
    - _Es también más legible: `h('a', { href:'/' }, h('span', null, 'Home'))`_


## ¿Qué fue agregado?

Preact de hecho agrega algunas características convenientes inspiradas en el trabajo de la comunidad de React:

- `this.props` y `this.state` son pasados a `render()` para tí
    - _Todavía podés referenciarlos manualmente. Es simplemente una forma más clara, particularmente cuando se [desestructura]_
- [Estado conectado] actualiza el estado automáticamente cuando el input cambia
- Batching de actualizaciones del DOM, demorado usando `setTimeout(1)` _(también puede usar requestAnimationFrame)_
- Puedes usar `class` para clases de CSS. `className` es soportado, pero `class` es privilegiado.
- Reciclado y agrupamiento de Componentes y elementos.


## ¿Qué falta?

- Validación de [PropType]: No todo el mundo usa PropTypes, entonces no son parte del núcleo de Preact.
    - _**Las PropTypes son soportadas** en [preact-compat], o también podés usarlas manualmente._
- [Children]: No son necesarios en Preact, porque `props.children` es _siempre un Array_.
    - _`React.Children` está totalmente soportado en [preact-compat]._
- Eventos sintéticos: El soporte de navegadores de Preact no requiere esta sobrecarga.
    - _Preact usa el método nativo `addEventListener` del navegador a la hora de hacer manejo de eventos. Mira [GlobalEventHandlers] para ver una lista completa de eventos disponibles._
    - _Una implementación completa de eventos implica más mentenimiento y problemas de performance, además de una superficie de API más grande._


## ¿Cuál es la diferencia?

Preact y React tienen algunas otras diferencias sutiles:

- `render()` acepta un tercer argumento, que es el elemento raíz a _reemplazar_, de otro modo se agrega al final. Esto puede cambiar ligeramente en una versión futura, quizás auto-detectando que un dibujo de reemplazo es apropiado inspeccionando el nodo raíz.


[Metas del proyecto]: /about/project-goals
[hyperscript]: https://github.com/dominictarr/hyperscript
[3.0]: https://github.com/developit/preact/milestones/3.0
[4.0]: https://github.com/developit/preact/milestones/4.0
[preact-compat]: https://github.com/developit/preact-compat
[PropType]: https://github.com/developit/proptypes
[Contextos]: https://facebook.github.io/react/docs/context.html
[Refs]: https://facebook.github.io/react/docs/more-about-refs.html
[Children]: https://facebook.github.io/react/docs/top-level-api.html#react.children
[GlobalEventHandlers]: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers
[Componentes de Clases de ES6]: https://facebook.github.io/react/docs/reusable-components.html#es6-classes
[Componentes de Alto Orden]: https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
[Componentes funcionales puros sin estado]: https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
[destructuring]: http://www.2ality.com/2015/01/es6-destructuring.html
[Estado conectado]: /guide/linked-state
