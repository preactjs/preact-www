---
name: Progressive Web Apps
permalink: '/guide/progressive-web-apps'
---

# Progressive Web Apps

## Übersicht

Preact ist eine hervorragende Wahl zur Entwicklung von [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/), die schnell laden und interaktiv werden.

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/load-less-script.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Weniger Code laden</h3>
          </div>
          <p class="_summary">Die [geringe Größe](/about/project-goals) von Preact ist hilfreich, wenn Performance ein kritischer Gesichtspunkt einer Anwendung ist. Bei durchschnittlichen mobilen Endgeräten wirkt sich das Laden umfangreicher Javascript-Pakete negativ auf die Ladezeit und die Ausführung des Codes aus. Damit müssen Besucher länger warten, bis sie mit einer Anwendung interagieren können. Indem die Libraries, die einer Anwendung zugrunde liegen, klein gehalten werden, wird auch die Anwendung schneller geladen.</p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/faster-tti.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Schnellerer Start</h3>
          </div>
          <p class="_summary"><p>Wenn dein Ziel ist, [in weniger als 5 Sekunden interaktiv zu sein](https://infrequently.org/2016/09/what-exactly-makes-something-a-progressive-web-app/), zählt jedes Kilobyte. [Von React zu Preact zu wechseln](/guide/switching-to-preact) kann einige Kilobyte bei jedem Aufruf sparen helfen und schnelle Verfügbarkeit der Anwendung gewährleisten. Damit ist es für Progressive Web Apps essenziell, dass jede Route mit so wenig wie möglich Code auskommt.</p></p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/building-block.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Ein perfekter Baustein für React-Umgebungen</h3>
          </div>
          <p class="_summary"><p>Ob du das [Server-side Rendering](https://facebook.github.io/react/docs/react-dom-server.html) von React benötigtst, um schnell etwas auf dem Bildschirm anzuzeigen oder den [React Router](https://github.com/ReactTraining/react-router) für die Navigation einsetzt: Preact arbeitet reibungslos mit diesen und vielen anderen Libraries aus der React-Welt zusammen. </p></p>
        </div>
    </li>
</ol>

## Diese Website ist eine PWA

Die Website, auf der du dich gerade befindest, ist eine Progressive Web App!. Hier zeigen wir, wie die Website auf einem Nexus 5X mit einer 3G-Verbindung binnen 5 Sekunden zur Verfügung steht:

<img src="../assets/pwa-guide/timeline.jpg" alt="Ein DevTools-Trace von preactjs.com auf einem Nexus 5X"/>

Statische Seiteninhalte werden durch die (Service Worker) Cache Storage API gespeichert, so dass sie bei wiederkehrenden Besucher sofort zur Verfügung stehen.

## Performance-Tipps

In Ergänzung zum Einsatz von Preact in einer PWA können weitere Tools und Techniken eingesetzt werden, darunter:

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/code-splitting.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://webpack.github.io/docs/code-splitting.html">Code-splitting</a></strong>, das den Code so aufteilt, dass nur die Teile, die jeweils für eine Seite benötigt werden, ausgeliefert werden, während der Rest nach Bedarf per Lazy-loading geladen wird, um die Ladezeit zu optimieren. Wird von Webpack unterstützt.</p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/service-worker-caching.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/getting-started/primers/service-workers">Service Worker Caching</a></strong> erlaubt es, statische und dynamische Ressourcen in einem Offline-Cache zwischenzuspeichern, wodurch das sofortige Laden und schnellere Interaktivität bei wiederholten Besuchen erzielt wird. Dies kann durch den Einsatz von [sw-precache](https://github.com/GoogleChrome/sw-precache#wrappers-and-starter-kits) oder [offline-plugin](https://github.com/NekR/offline-plugin) erreicht werden.</p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/prpl.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/performance/prpl-pattern/">PRPL</a></strong> erlaubt es, vorausschauend Daten an den Browser zu senden, wodurch Folgeseiten schneller geladen werden. Basiert auf Code-splitting und Caching. </p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/lighthouse.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://github.com/GoogleChrome/lighthouse/">Lighthouse</a></strong> unterstützt die Prüfung und Bewertung der Performance und weist auf Best Practices in Progressive Web App hin.</p>
        </div>
    </li>
</ol>
