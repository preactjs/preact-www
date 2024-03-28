---
name: Progressive Web Apps
permalink: '/guide/progressive-web-apps'
---

# Progressive Web Apps

Preact ist eine ausgezeichnete Wahl für [progressive Web Apps](https://web.dev/learn/pwa/), für die schnelles Laden und rasche Interaktivitätsmöglichkeiten erwünscht sind. [Preact CLI](https://github.com/preactjs/preact-cli) kodifiziert dies in einem schnellen Baukastenwerkzeug, dass von Grund auf eine PWA (Progressive Web App) mit einem [Lighthouse][LH]-Score von 100 schafft.

[LH]: https://developers.google.com/web/tools/lighthouse/

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/load-less-script.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Weniger Skripte laden</h3>
          </div>
          <p class="_summary">Preact's <a href="/about/project-goals">kleine Größe</a> ist sehr wertvoll, wenn nur ein begrenztes Ladezeitenkontingent verfügbar ist. Man kann davon ausgehen, dass das Laden von großen JavaScript-Bibliotheken mit mobilen Endgeräten immense Wartezeiten bis zur Benutzbarkeit der Applikation führen kann. Das Laden, Evaluieren und Berechnen der Skripte ist zu ressourcenhungrig. Das Reduzieren der Größe von Bibliotheken führt automatisch zu verbesserten Ladezeiten, da folglich auch weniger Code geladen und berechnet werden muss.</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/faster-tti.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Schneller zur Interaktivität</h3>
          </div>
          <p class="_summary"><p>Wenn man darauf abzielt, <a href="https://infrequently.org/2016/09/what-exactly-makes-something-a-progressive-web-app/">Interaktivität in unter 5 Sekunden</a> zu erreichen, zählt jeder einzelne KB. <a href="/guide/v8/switching-to-preact">Von React zu Preact zu wechseln</a> reduziert die Größe einer Applikation um einige KBs, was wiederum zu führt, dass Interaktivität innerhalb einer RTT (Paketlaufzeit) erreicht werden kann. Daher geben Preact und Progressive Web Apps ein wundervolles Paar ab, wenn man den Code für jede Route größtmöglich reduzieren möchte.</p></p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/building-block.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3> Ein Baustein, der perfekt mit Reacts Ökosystem harmoniert</h3>
          </div>
          <p class="_summary"><p>Wo auch immer man Reacts <a href="https://facebook.github.io/react/docs/react-dom-server.html">serverseitiges Rendern</a> einsetzen muss, um Pixel flink auf dem Bildschirm erscheinen zu lassen, oder <a href="https://github.com/ReactTraining/react-router">React Router</a> zur Navigation verwendet, lässt sich Preact wundervoll integrieren, da es gut mit einer Vielzahl von Bibliotheken des React-Ökosystem zusammenarbeitet.</p></p>
        </div>
    </li>
</ol>

## Diese Seite ist eine PWA

In der Tat ist genau diese Website eine Progressive Web App! Hier ist zu sehen, wie die App am Beispiel einer Trace ausgehend von einem Nexus 5X über 3G in unter 5 Sekunden interaktiv wird:

<img src="/pwa-guide/timeline.jpg" alt="Eine DevTools-Zeitleisten-Trace der preactjs.com-Seite auf einem Nexus 5X"/>

Statische Seiteninhalte werden in der (Service Worker) Cache Storage API gespeichert, die blitzschnelles Laden bei wiederholten Besuchen ermöglicht.

## Leistungstipps

Während Preact einfach in einer PWA zu integrieren ist und reibungslos funktionieren sollte, kann es auch mit einer Reihe von anderen Werkzeugen und Techniken verwendet werden. Diese beinhalten:

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/code-splitting.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://webpack.js.org/guides/code-splitting/">Code-Splitting</a></strong>  teilt den Code auf, sodass man genau den Teil des Codes an den Nutzer ausliefern kann, den er für die angeforderte Seite benötigt. Den Rest der Seite bei Bedarf mithilfe von Lazy-loading aufzurufen, verbessert Ladezeiten immens. Dies wird auch über Webpack unterstützt.</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/service-worker-caching.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/getting-started/primers/service-workers">Service Worker caching</a></strong> erlaubt das vom Internet getrennte Cachen von statischen und dynamischen Ressourcen. Dies erlaubt augenblickliches Laden und schnellere Interaktivität bei wiederholtem Besuchen einer Seite. Dieses Verhalten kann mit <a href="https://github.com/GoogleChrome/sw-precache#wrappers-and-starter-kits">sw-precache</a> oder <a href="https://github.com/NekR/offline-plugin">offline-plugin</a> erreicht werden.</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/prpl.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/performance/prpl-pattern/">PRPL</a></strong> fördert das  vorzeitige Pushen bzw. vorladende Elemente im Browser. Auch so wird die Ladezeit von nachfolgenden Seiten verkürzt, indem es auf Code-Splitting und SW-Caching aufbaut.</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/lighthouse.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://github.com/GoogleChrome/lighthouse/">Lighthouse</a></strong> erlaubt es, die Leistung und Funktionalitäten einer Progressiven Web App zu testen, damit man stets darüber aufgeklärt ist, wie performant eine App wirklich ist.</p>
        </div>
    </li>
</ol>

## Preact CLI

[Preact CLI](https://github.com/preactjs/preact-cli/) ist das offizielle Baukastenwerkzeug für Preact-Projekte. Es besteht aus einem minimalstabhängigen Kommandozeilenwerkzeug, das eigenen Preact-Code in eine hochoptimierte Progressive Web App verpackt. Preact CLI zielt darauf ab, alle obengenannten Empfehlungen zu automatisieren, damit man sich einzig und allein auf das Erstellen von großartigen Komponenten konzentrieren kann.

Anbei einige Funktionen, die Preact CLI mitliefert:


- Automatisches, lückenloses Code-Splitting für URL-Routen
- Automatisches Generieren und Installieren eines ServiceWorkers
- Generierung von HTTP2/Push-Headern (oder Preload Meta Tags), die auf der URL basieren
- Vorzeitiges Rendern, dass zu schnellen "Time To First Paint"-Resultaten führt
- Bedingungsweises Laden von Polyfills, falls diese benötigt werden

Da [Preact CLI](https://github.com/preactjs/preact-cli/) im Inneren von [Webpack](https://webpack.js.org) angetrieben wird, kann man eine `preact.config.js`-Datei definieren und somit den Build-Prozess auf seine eigenen Anforderungen genau abstimmen. Sollte man also Anpassungen vornehmen, kann man immer noch die Vorteile einzelner wundervollen Standardeinstellungen nutzen. Außerdem kann man so einfach Aktualisierungen vornehmen, sollte eine neue Version von `preact-cli` veröffentlich werden.
