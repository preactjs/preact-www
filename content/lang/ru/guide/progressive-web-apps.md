---
name: Прогрессивные веб-приложения
permalink: '/guide/progressive-web-apps'
---

# Прогрессивные веб-приложения

## Обзор

Preact это отличный выбор для [прогрессивных веб-приложений](https://developers.google.com/web/progressive-web-apps/) которые быстро загружаются, и сразу становятся интерактивными.

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/load-less-script.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Меньше скриптов</h3>
          </div>
          <p class="_summary">[Небольшой размер](/about/project-goals) Preact полезен, когда у вас есть ограничение в кол-ве загружаемых данных. На рядовом мобильном устройстве большой размер js-бандла приводит к увеличению времени на загрузку, разбор и исполнение вашего кода. Это может привести к тому, что пользователи будут долго ждать, перед тем как им станет возможно взаимодействовать с вашим приложением. Сокращая библиотечный код в ваших пакетах, ваш сайт загружается быстрее.</p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/faster-tti.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Быстрее становится интерактивным</h3>
          </div>
          <p class="_summary">Если Вы стремитесь к тому чтобы с вашим сайтом можно было [взаимодействовать в течении 5 секунд](https://infrequently.org/2016/09/what-exactly-makes-something-a-progressive-web-app/), то каждый килобайт на счету. [Переключение с React на Preact](/guide/switching-to-preact) в ваших проектах может урезать множество килобайт, и позволит вам получить работающее клиентское приложение в течение времени одного round-trip. Это делает его отличным решением для прогрессивных веб-приложений которые пытаются урезать как можно больше кода в каждом роуте.
          </p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/building-block.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Строительный блок, который отлично работает с экосистемой React</h3>
          </div>
          <p class="_summary">Если вам нужно использовать реактовый [рендеринг на стороне сервера](https://facebook.github.io/react/docs/react-dom-server.html), для быстрого получения пикселей на экране, или использовать [React Router](https://github.com/ReactTraining/react-router) для навигации, Preact хорошо работает с многими библиотеками в экосистеме.</p>
        </div>
    </li>
</ol>

## Этот сайт является PWA (Прогрессивным веб-приложением)

Фактически, сайт, на котором вы сейчас находитесь, - это прогрессивное веб-приложение! Здесь он становится интерактивным в течение 5 секунд после открытия на Nexus 5X по 3G:

<img src="../assets/pwa-guide/timeline.jpg" alt="Трассировка в Chrome_DevTools Timeline сайта preactjs.com на Nexus 5X"/>

Статический контент сайта хранится в (Service Worker) Cache Storage, что позволяет мгновенно загружать его при повторных посещениях.

## Советы по повышению производительности

While Preact is a drop-in that should work well for your PWA, it can also be used with a number of other tools and techniques. These include:

В то время как замена React на Preact это достаточно лёгкий способ оптимизировать ваше PWA-приложение, его также можно использовать с рядом других инструментов и техник. К ним относятся:

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/code-splitting.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://webpack.github.io/docs/code-splitting.html">Разделение кода</a></strong> разбивает ваш код, таким образом что ваш пользователь получает то что ему необходимо в данный момент. Ленивая загрузка остального кода по мере необходимости улучшает время загрузки страницы. Поддерживается через Webpack.</p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/service-worker-caching.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/getting-started/primers/service-workers">Кэширование Service Worker</a></strong> позволяет вам кешировать статические и динамические ресурсы в вашем приложении, обеспечивая мгновенную загрузку и более быструю интерактивность при повторных посещениях. Выполняйте это с помощью [sw-precache](https://github.com/GoogleChrome/sw-precache#wrappers-and-starter-kits) или [offline-plugin](https://github.com/NekR/offline-plugin).
          </p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/prpl.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/performance/prpl-pattern/">PRPL</a></strong> поощряет предварительную передачу данных или предварительную загрузку ресурсов в браузер, ускоряя загрузку последующих страниц. Он строится на кодовом разделении и Service Worker кэшировании.
          </p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/lighthouse.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://github.com/GoogleChrome/lighthouse/">Lighthouse</a></strong> позволяет вам проверять производительность и лучшие практики вашего прогрессивного веб-приложения, чтобы вы знали, насколько хорошо работает ваше приложение.</p>
        </div>
    </li>
</ol>
