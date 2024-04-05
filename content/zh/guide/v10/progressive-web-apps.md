---
name: 渐进式 Web 应用
permalink: '/guide/progressive-web-apps'
description: '渐进式 Web 应用让您的应用得以离线使用，与 Preact 组合更佳'
---

# 渐进式 Web 应用

旨在快速加载与交互的[渐进式 Web 应用](https://web.dev/learn/pwa/)的绝佳实现框架之一即是 Preact。[Preact CLI](https://github.com/preactjs/preact-cli/) 无需任何配置即可将您的应用构建成 [Lighthouse][LH] 满分的渐进式 Web 应用。

[LH]: https://developers.google.com/web/tools/lighthouse/

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/load-less-script.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>加载更少脚本</h3>
          </div>
          <p class="_summary">当您的加载性能受限时，Preact 的<a href="/about/project-goals">小体积</a>优势便尤为突出。在一般的移动设备上，加载体量大的 JS 代码会让加载、解析和执行的时间变长。用户可能需要等待很久才能与您的应用交互。通过减少您打包后的库大小，您可以减少加载量，让用户更快地加载。</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/faster-tti.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>更快开始交互</h3>
          </div>
          <p class="_summary">若您期望在 <a href="https://infrequently.org/2016/09/what-exactly-makes-something-a-progressive-web-app/">5 秒内就能开始交互</a>，那么每一个字节都很重要。通过将您的项目<a href="/guide/v10/switching-to-preact">从 React 转到 Preact</a>，您可以节约几千字节，在一个往返时间内即可开始交互。尽可能大地缩减您的代码大小让 Preact 成为渐进式 Web 应用的不二之选。</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/building-block.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>融入 React 生态</h3>
          </div>
          <p class="_summary">无论您需要使用 React 的<a href="https://facebook.github.io/react/docs/react-dom-server.html">服务端渲染</a>功能让屏幕上的每个像素都快速呈现，还是使用 <a href="https://github.com/ReactTraining/react-router">React Router</a> 进行导航，Preact 都能与 React 生态中的许许多多软件库搭配良好。</p>
        </div>
    </li>
</ol>

## 这个网站就是其中之一

实际上，您所浏览的网站就是一款渐进式 Web 应用！下图模拟了在 Nexus 5X 上通过 3G 网络于 5 秒内加载本网页的跟踪：

<img src="/pwa-guide/timeline.jpg" style="display: block;" alt="preactjs.com 在 Nexus 5X 上的 DevTools 时间线跟踪"/>

静态网站内容存储于 (Service Worker) 缓存存储 API 中，让您再度访问时即刻加载。

## 优化技巧

虽然 Preact 可以轻松替代 React 作为 PWA 框架，但它也可以搭配其他工具和技巧，包括：

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/code-splitting.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://webpack.js.org/guides/code-splitting/">代码切割</a></strong>将您的代码分割成几个部分，用户仅需加载需要的部分。其他部分则通过懒加载来优化加载时间，此方法需要 webpack 或 Rollup。</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/service-worker-caching.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/getting-started/primers/service-workers">Service Worker 缓存</a></strong>在应用中离线缓存静态和动态内容，让您再次访问时得以即刻加载与交互。此方法使用 <a href="https://developers.google.com/web/tools/workbox">Workbox</a> 实现。</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/prpl.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/performance/prpl-pattern/">PRPL</a></strong> 为浏览器预先推送或预加载资源，加速页面的载入速度。此方法基于代码切割和 Service Worker 缓存。</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/lighthouse.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://github.com/GoogleChrome/lighthouse/">Lighthouse</a></strong> 让您轻松评估应用性能和您渐进式 Web 应用的最佳实践，让您知晓您应用的表现如何。</p>
        </div>
    </li>
</ol>

## Preact CLI

[Preact CLI](https://github.com/preactjs/preact-cli/) 是 Preact 项目的官方构建工具。这是一款仅有一个依赖的命令行工具，负责将您的 Preact 代码打包为高度优化的渐进式 Web 应用。其旨在自动化上述所有的推荐技巧，这样您只需要专心构建优秀的组件即可。

下面是 Preact CLI 自动为您做的几件事情：

- 自动、无缝地对您的 URL 路径进行代码切割
- 自动生成并安装 ServiceWorker
- 基于 URL 生成 HTTP2/Push 头信息 (或预载入元标签)
- 为优化首次绘制时间 (Time To First Paint) 进行预渲染
- 按需加载 Polyfill

由于 [Preact CLI](https://github.com/preactjs/preact-cli/) 内部基于 [Webpack](https://webpack.js.org)，您可以创建一个 `preact.config.js` 文件并在其中自定义构建流程来满足您的需求。就算如此，您还是可以享受到我们为您优化过的默认设置，并可以在新版本的 `preact-cli` 发布后进行更新。
