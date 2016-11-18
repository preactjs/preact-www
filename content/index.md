---
layout: home
title: Preact
show_title: false
toc: false
---


<jumbotron>
	<h1>
        <logo height="1.5em" title="Preact" text>Preact</logo>
    </h1>

	<p>Fast 3kB alternative to React with the same ES6 API.</p>

	<p>
		<a href="/guide/getting-started" class="white">Getting Started</a>
		&nbsp; • &nbsp;
		<github-stars user="developit" repo="preact">4,750+</github-stars>
	</p>
</jumbotron>


<section class="home-top">
    <h1>A different kind of library</h1>
</section>


<section class="home-section">
    <img width="250" height="250" alt="👊">

    <h2>Closer to the Metal</h2>
    
    <p>
        Preact provides the thinnest possible Virtual DOM abstraction on top of the DOM.
        The web is a stable platform, it's time we stopped reimplementing it in the name of safety.
    </p>

    <p>
        Preact is also a first-class citizen of the web platform. It diffs Virtual DOM against the DOM itself, registers real event handlers, and plays nicely with other libraries.
    </p>
</section>


<section class="home-section">
    <img width="250" height="250" alt="🐭">

    <h2>Small Size</h2>
    
    <p>
        Most UI frameworks are large enough to be the majority of an app's JavaScript size.
        Preact is different: it's small enough that <em>your code</em> is the largest part of your application.
    </p>
    
    <p>
        That means less JavaScript to download, parse and execute - leaving more time for your code, so you can build an experience you define without fighting to keep a framework under control.
    </p>
</section>


<section class="home-section">
    <img width="250" height="250" alt="🏇">

    <h2>Big Performance</h2>
    
    <p>
        Preact is fast, and not just because of its size. It's one of the fastest Virtual DOM libraries out there, thanks to a simple and predictable diff implementation.
    </p>
    
    <p>
        It even includes extra performance features like <a href="/guide/configuration#debounceRendering">customizable update batching</a>, optional <a href="/guide/configuration#syncComponentUpdates">async rendering</a>, DOM recycling and optimized event handling via [Linked State](/guide/linked-state).
    </p>
</section>


<section class="home-section">
    <img width="250" height="250" alt="🎒">

    <h2>Portable &amp; Embeddable</h2>
    
	<p>
        Preact's tiny footprint means you can take the Virtual DOM Component paradigm to places it couldn't otherwise go.
	</p>
	
	<p>
		Use Preact to build parts of an app without complex integration. Embed Preact into a widget and apply the same tools and techniques that you would to build a full app.
    </p>
</section>


<section class="home-section">
    <img width="250" height="250" alt="🔨">

    <h2>Instantly Productive</h2>
    
	<p>
        Lightweight is a lot more fun when you don't have to sacrifice productivity to get there. Preact gets you productive right away. It even has a few bonus features:
	</p>
    
    <ul>
        <li>`props`, `state` and `context` are passed to `render()`</li>
        <li>[Linked State](/guide/linked-state) replaces repetitive event handler code</li>
        <li>Use standard HTML attributes like `class` and `for`</li>
    </ul>
</section>
