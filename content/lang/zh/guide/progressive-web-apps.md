---
name: Progressive Web Apps
permalink: '/guide/progressive-web-apps'
---

# 渐进式 Web 应用程序（Progressive Web Apps）

## 概述
 
Preact 是希望快速加载和交互的 [渐进式 Web 应用程序](https://developers.google.com/web/progressive-web-apps/) 的绝佳选择。
<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/load-less-script.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>加载更少的脚本</h3>
          </div>
          <p class="_summary"> 
          Preact 的 [小体积](/about/project-goals) 是有价值的，当你有一个紧张的加载性能预算。通常移动设备加载大量的 JS 会导致更长的加载、解析和执行时间。 这可能会使用户在等待很长时间才能与您的应用互动。 通过缩减你绑定 (bundles) 包中的库代码，您可以通过向用户发送较少的代码来加快速度。
          </p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/faster-tti.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>更快速进行交互</h3>
          </div>
          <p class="_summary">
          如果你的目标是在 [5 秒内进行交互](https://infrequently.org/2016/09/what-exactly-makes-something-a-progressive-web-app/)，每个 KB 都很重要，在您的项目中[切换 React 到 Preact](/guide/switching-to-preact) 可以节省多个 KB，并使您能够在一个 RTT 中获得交互。这使它非常适合渐进式 Web 应用程序，尽量减少更多代码的每个传送路程。</p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/building-block.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>构建块和 React 生态系统很好的一起工作</h3>
          </div>
          <p class="_summary">
          无论您需要使用 React 的 [服务器端渲染](https://facebook.github.io/react/docs/react-dom-server.html) 以快速获取屏幕上的像素，还是使用 [React 路由](https://github.com/ReactTraining/react-router) 进行导航，Preact 都可以在生态系统中与许多的库正常工作。
          </p>
        </div>
    </li>
</ol>

## 这个站点是 PWA

事实上，你现在的查看的这个网站是一个渐进式 Web 应用程序！它可以在 5 秒内，在 3G 的网络环境下用 Nexus 5X 进行交互。
<img src="../assets/pwa-guide/timeline.jpg" alt="A DevTools Timeline trace of the preactjs.com site on a Nexus 5X"/>

静态站点内容存储在（Service Worker）高速缓存存储 API 中，使重复访问可以即时加载。

## 性能提示 
 
虽然 Preact 是一个适用于您的 PWA 的插件，但它也可以与许多其他工具和技术一起使用。这些包括：

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/code-splitting.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://webpack.github.io/docs/code-splitting.html">代码拆分</a></strong> 
            分解您的代码，以便只发送用户页面需要的代码。根据需要延迟加载其余部分可提高页面加载时间。这点通过 webpack 支持。
          </p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/service-worker-caching.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/getting-started/primers/service-workers">Service Worker 缓存 </a></strong> 允许您离线缓存应用程序中的静态和动态资源，实现即时加载和重复访问时更快的交互性。使用 [sw-precache](https://github.com/GoogleChrome/sw-precache#wrappers-and-starter-kits) 或 [offline-plugin](https://github.com/NekR/offline-plugin) 完成此操作。
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/prpl.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/performance/prpl-pattern/">PRPL</a></strong> 鼓励向浏览器预先推送或预加载资源，从而加快后续页面的加载速度。它基于代码拆分和 SW 缓存。</p>
        </div>
    </li>

    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(../assets/pwa-guide/lighthouse.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://github.com/GoogleChrome/lighthouse/">Lighthouse</a></strong> 允许你审计（监控）渐进式 Web 应用程序的性能和最佳实践，因此你能知道你的应用程序的表现情况。</p>
        </div>
    </li>
</ol>
