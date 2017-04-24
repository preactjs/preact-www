---
name: Progressive Web Apps
permalink: '/guide/progressive-web-apps'
---

# Progressive Web Apps

## Introducción

Preact es una excelente elección para [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/) que quieren cargar y ser interactivas rápidamente.

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/load-less-script.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Carga menos scripts</h3>
          </div>
          <p class="_summary">El [pequeño tamaño](/about/project-goals) de Preact es valioso cuando tu presupuesto de performance de carga es apretado. En promedio el hardware mobile, cargando grandes bundles de JS acarrean una carga, tiempos de parseo y evaluación mayores. Esto puede dejar a los usuarios esperando un largo tiempo antes que puedan interactuar con tu aplicación.  Acortando el código de tu librería en tus bundles, cargas más rápido enviando menos código a tus usuarios. </p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/faster-tti.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Tiempo de interacción más rápido</h3>
          </div>
          <p class="_summary">Si estás buscando ser [interactivo en menos de 5s](https://infrequently.org/2016/09/what-exactly-makes-something-a-progressive-web-app/), cada KB importa. [Cambiando React por Preact](/guide/switching-to-preact) en tus proyectos puede acortar múltiples KBs y permitirte ser interactivo pronto. Esto es adecuado en una Progressive Web App intentando eliminar todo el código posible que no se necesita en cada ruta.</p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/building-block.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Un ladrillo que funciona genial con el ecosistema de React</h3>
          </div>
          <p class="_summary">Ya sea que necesites usar el [server-side rendering](https://facebook.github.io/react/docs/react-dom-server.html) de React para mostrar pixels en la pantalla rápidamente o usar [React Router](https://github.com/ReactTraining/react-router) para la navegación, Preact funciona bien con muchas librerías del ecosistema. </p>
        </div>
    </li>
</ol>

## Este sitio es una PWA

De hecho, este sitio en el que estás ahora es una Progressive Web App!. Está siendo interactiva antes de los 5 segundos en un trace de un Nexus 5 sobre 3G:

<img src="../assets/pwa-guide/timeline.jpg" alt="Un Timeline de DevTools tracea el sitio de preactjs.com en un Nexus 5X"/>

El contenido estático del sitio se guarda en el (Service Worker) usando la Cache Storage API, permitiendo la carga instantánea en visitas sucesivas.

## Tips de performance

Así como Preact debería funcionar bien con tu PWA, también puede ser usado con un gran número de herramientas y técnicas. Por ejemplo estas:

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/code-splitting.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://webpack.github.io/docs/code-splitting.html">Code-splitting</a></strong> parte tu código para que solo entregues lo que el usuario necesita en una página. Haciendo Lazy-loading del resto de la aplicación, mejorando el tiempo de carga. Soportado en Webpack.</p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/service-worker-caching.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/getting-started/primers/service-workers">Caching en Service Worker</a></strong> te permite guardar contenido y recursos dinámicos de tu app offline, permitiendo la carga instantánea e interactividad más rápida en futuras visitas. Realizando esto con [sw-precache](https://github.com/GoogleChrome/sw-precache#wrappers-and-starter-kits) o el [offline-plugin](https://github.com/NekR/offline-plugin).</p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/prpl.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/performance/prpl-pattern/">PRPL</a></strong> sugiere empujar deliveradamente o pre-cargar recursos al navegador, haciendo las cargas subsiguientes más rápidas. Se construye sobre code-splitting y SW caching. </p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/lighthouse.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://github.com/GoogleChrome/lighthouse/">Lighthouse</a></strong> te permite auditar la performande y buenas prácticas de tu Progressive Web App para que sepas cuan performante tu app funciona.</p>
        </div>
    </li>
</ol>
