---
name: Progressive Web Apps
permalink: '/guide/progressive-web-apps'
---

# Progressive Web Apps

## Vue d'ensemble

Preact est un excellent choix pour les [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/) qui souhaitent être chargée et devenir interactive rapidement. [Preact CLI](https://github.com/developit/preact-cli/) codifie cela dans un outil de build qui vous donne une PWA avec un score de 100 dans [Lighthouse][LH] directement.

[LH]: https://developers.google.com/web/tools/lighthouse/

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/load-less-script.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Moins de script chargé</h3>
          </div>
          <p class="_summary">La petite taille de Preact est précieuse lors vous avez un budget performance serré. Sur un terminal mobile moyen, le chargement de gros bundles de JavaScript mènent à des temps de chargement, d'analyse et d'évaluation plus longs. Cela peut faire attendre les utilisateurs plus longtemps avant qu'ils puissent intéragir avec votre application. En rognant sur le code de la bibliothèque dans vos bundles, vous améliorez le temps de chargement en livrant moins de code à vos utilisateurs.</p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/faster-tti.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Etre interactif plus rapidement</h3>
          </div>
          <p class="_summary">Si vous voulez être [interactif en moins de 5 secondes](https://infrequently.org/2016/09/what-exactly-makes-something-a-progressive-web-app/), chaque Ko compte. [Passer de React à Preact](/guide/switching-to-preact) dans vos projets peut vous faire économiser de nombreux Ko et vous permettre d'être interactif en un RTT. Cela fonctionne très bien pour les Progressive Web Apps qui essayent de servir le moins de code possible pour chaque route.</p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/building-block.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Un bloc de construction qui fonctionne merveilleusement avec l'ecosystème React</h3>
          </div>
          <p class="_summary">Que vous ayez besoin d'utiliser le [rendu côté serveur](https://facebook.github.io/react/docs/react-dom-server.html) de React pour afficher quelque chose à l'écran rapidement, ou d'utiliser [React Router](https://github.com/ReactTraining/react-router) pour la navigation, Preact fonctionne bien avec de nombreuses bibliothèques de l'écosystème.</p>
        </div>
    </li>
</ol>

## Ce site est une PWA

En fait, le site sur lequel vous vous trouvez actuellement est une Progressive Web App!. Il est interactif en moins de 5 secondes sur un Nexus 5X en 3G :

<img src="../assets/pwa-guide/timeline.jpg" alt="A DevTools Timeline trace of the preactjs.com site on a Nexus 5X"/>

Le contenu statique du site est stocké dans l'API Cache Storage (Service Worker), ce qui permet un affichage instantanné lors des visites répétées.

## Astuces de performances

En plus d'être une solution qui fonctionne bien pour votre PWA, Preact peut aussi être utilisé avec beaucoup d'autres outils et techniques. Ceux-ci incluent :

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/code-splitting.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://webpack.github.io/docs/code-splitting.html">Le Code-splitting</a></strong> divise votre code de manière à ce que vous puissiez servir uniquement ce dont l'utilisateur a besoin pour une page. Charger le reste à la demande améliore le temps de chargement de la page. Ceci est supporté via Webpack.</p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/service-worker-caching.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/getting-started/primers/service-workers">Le cache des Service Worker</a></strong> vous permet de mettre en cache hors-ligne des ressources statiques et dynamiques de votre application, offrant un chargement instantané et une interactivité plus rapide lors des visites répétées. Vous pouvez faire cela avec [sw-precache](https://github.com/GoogleChrome/sw-precache#wrappers-and-starter-kits) ou [offline-plugin](https://github.com/NekR/offline-plugin).</p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/prpl.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/performance/prpl-pattern/">Le PRPL</a></strong> encourage à pousser ou précharger des ressources vers le navigateur de manière préemptive, afin d'améliorer le temps de chargement des pages suivantes. Cela fonctionne grâve au code-splitting et au cache du Service Worker.</p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/lighthouse.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://github.com/GoogleChrome/lighthouse/">Lighthouse</a></strong> vous permet d'auditer la performance et l'utilisation des bonnes pratiques de votre Progressive Web App afin que vous sachiez si votre application est performante ou non.</p>
        </div>
    </li>
</ol>

## Preact CLI

[Preact CLI](https://github.com/developit/preact-cli/) est l'outil de build officiel pour les projets Preact. C'est une simple dépendance en ligne de commande qui regroupe votre code Preact dans une Progressive Web App hautement optimisée. Son but est de rendre toutes les recommendations précédentes automatiques, afin que vous puissez vous concentrer sur l'écriture de bons composants.

Voici quelques choses fournies par Preact CLI :

- Code-splitting automatique et simple pour vos routes
- Génération et installation automatique d'un Service Worker
- Génération de headers HTTP2/Push (ou balises meta de préchargement) basés sur l'URL
- Pré-rendu pour un Time To First Paint rapide
- Chargement de polyfills si nécessaire

Puisque [Preact CLI](https://github.com/developit/preact-cli/) utilise [Webpack](https://webpack.js.org), vous pouvez définir un fichier `preact.config.js` et personnaliser le processus de build pour qu'il corresponde à vos besoins. Même si vous personnalisez des choses, vous pourrez toujours profiter des supers paramètres par défaut, et vous pourrez faire les mises à jours lorsque de nouvelles versions de `preact-cli` sortiront. 
