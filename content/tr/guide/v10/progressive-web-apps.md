---
name: Progressive Web Apps
permalink: '/guide/progressive-web-apps'
description: 'Progressive Web Apps (PWA) allow you to ship your app offline. They work pretty well with Preact'
---

# Progressive Web Apps

Preact is an excellent choice for [Progressive Web Apps](https://web.dev/learn/pwa/) that wish to load and become interactive quickly.  [Preact CLI](https://github.com/preactjs/preact-cli/) codifies this into an instant build tool that gives you a PWA with a 100 [Lighthouse][LH] score right out of the box.

[LH]: https://developers.google.com/web/tools/lighthouse/

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/assets/pwa-guide/load-less-script.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Loads less script</h3>
          </div>
          <p class="_summary">Preact's <a href="/about/project-goals">small size</a> is valuable when you have a tight loading performance budget. On average mobile hardware, loading large bundles of JS leads to longer load, parse and eval times. This can leave users waiting a long time before they can interact with your app.  By trimming down the library code in your bundles, you load quicker by shipping less code to your users. </p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/assets/pwa-guide/faster-tti.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Faster time to interactivity</h3>
          </div>
          <p class="_summary">If you're aiming to be <a href="https://infrequently.org/2016/09/what-exactly-makes-something-a-progressive-web-app/">interactive in under 5s</a>, every KB matters. <a href="/guide/switching-to-preact">Switching React for Preact</a> in your projects can shave multiple KBs off and enable you to get interactive in one RTT. This makes it a great fit for Progressive Web Apps trying to trim down as much code as possible for each route.</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/assets/pwa-guide/building-block.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>A building block that works great with the React ecosystem</h3>
          </div>
          <p class="_summary">Whether you need to use React's <a href="https://facebook.github.io/react/docs/react-dom-server.html">server-side rendering</a> to get pixels on the screen quickly or use <a href="https://github.com/ReactTraining/react-router">React Router</a> for navigation, Preact works well with many libraries in the ecosystem. </p>
        </div>
    </li>
</ol>

## This site is a PWA

In fact, the site you're on right now is a Progressive Web App!. Here it is getting interactive in under 5 seconds in a trace from a Nexus 5X over 3G:

<img src="/assets/pwa-guide/timeline.jpg" style="display: block;" alt="A DevTools Timeline trace of the preactjs.com site on a Nexus 5X"/>

Static site content is stored in the (Service Worker) Cache Storage API enabling instant loading on repeat visits.

## Performance tips

While Preact is a drop-in that should work well for your PWA, it can also be used with a number of other tools and techniques. These include:

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/assets/pwa-guide/code-splitting.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://webpack.js.org/guides/code-splitting/">Code-splitting</a></strong> breaks up your code so you only ship what the user needs for a page. Lazy-loading the rest as needed improves page load times. Supported via webpack or Rollup.</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/assets/pwa-guide/service-worker-caching.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/getting-started/primers/service-workers">Service Worker caching</a></strong> allows you to offline cache static and dynamic resources in your app, enabling instant loading and faster interactivity on repeat visits. Accomplish this with <a href="https://developers.google.com/web/tools/workbox">Workbox</a></p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/assets/pwa-guide/prpl.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/performance/prpl-pattern/">PRPL</a></strong> encourages preemptively pushing or pre-loading assets to the browser, speeding up the load of subsequent pages. It builds on code-splitting and SW caching. </p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/assets/pwa-guide/lighthouse.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://github.com/GoogleChrome/lighthouse/">Lighthouse</a></strong> allows you to audit the performance and best practices of your Progressive Web App so you know how well your app performs.</p>
        </div>
    </li>
</ol>

## Preact CLI

[Preact CLI](https://github.com/preactjs/preact-cli/) is the official build tool for Preact projects. It's a single dependency command line tool that bundles your Preact code into a highly optimized Progressive Web App.  It aims to make all of the above recommendations automatic, so you can focus on writing great Components.

Here are a few things Preact CLI bakes in:

- Automatic, seamless code-splitting for your URL routes
- Automatically generates and installs a ServiceWorker
- Generates HTTP2/Push headers (or preload meta tags) based on the URL
- Pre-rendering for a fast Time To First Paint
- Conditionally loads polyfills if needed

Since [Preact CLI](https://github.com/preactjs/preact-cli/) is internally powered by [Webpack](https://webpack.js.org), you can define a `preact.config.js` and customize the build process to suit your needs.  Even if you customize things, you still get to take advantage of awesome defaults, and can update as new versions of `preact-cli` are released.
