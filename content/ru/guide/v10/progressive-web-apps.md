---
name: Прогрессивные веб-приложения
permalink: '/guide/progressive-web-apps'
description: 'Прогрессивные веб-приложения (PWA) позволяют запускать приложения в автономном режиме. Они хорошо работают с Preact'
---

# Прогрессивные веб-приложения

Preact — отличный выбор для [прогрессивных веб-приложений](https://web.dev/learn/pwa/), которые должны быстро загружаться и становиться интерактивными. [Preact CLI](https://github.com/preactjs/preact-cli/) кодирует это в инструмент мгновенной сборки, который позволяет получить PWA с оценкой 100 баллов [Lighthouse][LH] прямо из коробки.

[LH]: https://developers.google.com/web/tools/lighthouse/

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/load-less-script.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Загружает меньше скриптов</h3>
          </div>
          <p class="_summary"><a href="/about/project-goals">Небольшой размер</a> Preact ценен при ограниченном бюджете на производительность загрузки. На среднем мобильном оборудовании загрузка больших пакетов JS приводит к увеличению времени загрузки, разбора и вычисления. Это может привести к тому, что пользователи будут долго ждать, прежде чем смогут взаимодействовать с вашим приложением.  Сокращая библиотечный код в своих пакетах, вы ускоряете загрузку, передавая пользователям меньший объем кода.</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/faster-tti.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Более быстрое время достижения интерактивности</h3>
          </div>
          <p class="_summary">Если вы стремитесь к <a href="https://infrequently.org/2016/09/what-exactly-makes-something-a-progressive-web-app/">интерактивности, превышающей 5 секунд</a>, то каждый КБ имеет значение. <a href="/guide/v10/switching-to-preact">Переключение React на Preact</a> в ваших проектах позволяет сэкономить несколько КБ и получить интерактивность за один RTT. Это позволяет использовать его в прогрессивных веб-приложениях, стремящихся максимально сократить объем кода для каждого маршрута.</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/building-block.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Строительный блок, который отлично работает с экосистемой React</h3>
          </div>
          <p class="_summary">Нужно ли вам использовать <a href="https://facebook.github.io/react/docs/react-dom-server.html">серверный рендеринг</a> React для быстрого вывода пикселей на экран или использовать <a href="https://github.com/ReactTraining/react-router">React Router</a> для навигации? Неважно! Preact хорошо работает со многими библиотеками в экосистеме.</p>
        </div>
    </li>
</ol>

## Данный сайт — тоже PWA

Сайт, на котором вы сейчас находитесь, также является прогрессивным веб-приложением! Здесь он работает в интерактивном режиме менее 5 секунд в трассировке с Nexus 5X через 3G:

<img src="/pwa-guide/timeline.jpg" style="display: block;" alt="Трассировка DevTools Timeline сайта preactjs.com на Nexus 5X"/>

Статический контент сайта хранится в (Service Worker) Cache Storage API, что обеспечивает его мгновенную загрузку при повторных посещениях.

## Советы по производительности

Хотя Preact — это готовый продукт, который должен хорошо работать с PWA, его можно использовать и с рядом других инструментов и технологий. К ним относятся:

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/code-splitting.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://webpack.js.org/guides/code-splitting/">Разделение кода</a></strong> разбивает ваш код таким образом, что вы поставляете на страницу только то, что нужно пользователю. Ленивая загрузка остальной части по мере необходимости улучшает время загрузки страницы. Поддержка через webpack или Rollup.</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/service-worker-caching.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/getting-started/primers/service-workers">Кэширование Service Worker</a></strong> позволяет кэшировать статические и динамические ресурсы в автономном режиме в вашем приложении, обеспечивая мгновенную загрузку и более быструю интерактивность при повторных посещениях. Сделайте это с помощью <a href="https://developers.google.com/web/tools/workbox">Workbox</a>.</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/prpl.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/performance/prpl-pattern/">PRPL</a></strong> поощряет упреждающую отправку или предварительную загрузку ресурсов в браузер, ускоряя загрузку последующих страниц. Он основан на разделении кода и программном кэшировании.</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/lighthouse.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://github.com/GoogleChrome/lighthouse/">Lighthouse</a></strong> позволяет вам проверять производительность и лучшие практики вашего прогрессивного веб-приложения, чтобы вы знали, насколько хорошо работает ваше приложение.</p>
        </div>
    </li>
</ol>

## Preact CLI

[Preact CLI](https://github.com/preactjs/preact-cli/) — официальный инструмент сборки проектов Preact. Это однозависимый инструмент командной строки, который объединяет ваш код Preact в высоко оптимизированное прогрессивное веб-приложение. Его цель — выполнить все вышеперечисленные рекомендации автоматически, чтобы вы могли сосредоточиться на написании отличных компонентов.

Вот несколько особенностей, которые заложены в Preact CLI:

- Автоматическое, бесшовное разделение кода для маршрутов URL
- Автоматическое создание и установка ServiceWorker
- Генерация заголовков HTTP2/Push (или метатегов предварительной загрузки) на основе URL-адреса
- Предварительное окрашивание для ускорения времени до первой покраски
- Условная загрузка полифиллов при необходимости

Поскольку [Preact CLI](https://github.com/preactjs/preact-cli/) работает на базе [Webpack](https://webpack.js.org), вы можете определить `preact.config.js` и настроить процесс сборки под свои нужды. Даже если вы что-то настраиваете, вы всё равно сможете воспользоваться преимуществами замечательных настроек по умолчанию и обновляться по мере выхода новых версий `preact-cli`.
