---
title: Prerendering with `@preact/preset-vite`
date: 2024-08-06
authors:
  - Ryan Christian
---

# Prerendering with Preset Vite

It's been a half-year since our prerendering plugin has somewhat quietly become available in `@preact/preset-vite`, so let's talk about it, our history, and the ecosystem at large

Those who have been in our community for a while know how much we like prerendering; it was a first-class feature in Preact-CLI, then WMR, and now our Vite preset. When it's done right, it's a pain-free addition to the typical SPA that improves the user experience greatly and this plugin aims to facilitate just that.

## What is Prerendering?

"Prerendering", for the context of this post, is the act of generating HTML from your app at build time using server-side rendering (SSR); sometimes this may also be referred to as static site generation (SSG).

While we don't dive deep into the virtues of SSR here, or even argue that you should use it, it's generally advantageous to send a fully populated HTML document to the user on initial navigation (and perhaps upon subsequent navigations too, depending on routing strategy) rather than an empty shell that the client-side JS will eventually render into. Users will get access to the document quicker and can begin to use the page (albeit, often with reduced functionality) while the JS is still downloading in the background.

## Our History in the Space

Since Preact-CLI first hit public release back in May of 2017, built-in prerendering has been a key part of our identity in build tooling, something we happily carried over into WMR and something that was pretty sorely missing when we switched to suggesting Vite.

We've gone through a few different iterations to fit with the change in tooling and community feedback, so let's first take a look at how it's evolved.

## Existing Vite Ecosystem

Before we created our own prerendering implementation for our Vite preset, we had a look at the existing Vite ecosystem to see what was being offered but didn't quite find what we were after with the options. Prerendering is at its best when it is as near to "drop-in" as possible, taking your existing app, with minimal modification, and generating HTML from it, but existing solutions were a further step away from "drop-in" than we would've liked and fell into two main categories:

1. Multiple Builds
	- Separate client/server builds, often separate entry points too
	- Less isomorphic, different branches in your app for different environments
2. Frameworks / Vite Wrappers
	- No longer using Vite directly but an abstraction
	- Some amount of buy-in/lock-in
	- Support matrix for different Vite config options, plugins, etc. can be complicated and less than clear

While these solutions absolutely have their merits and places in the ecosystem, neither felt as great as they could be for our ecosystem, given our historic offerings in this area. The "best case scenario" DX was often sacrificed for more complex or specific needs -- which is a completely valid trade off.

For drop-in prerendering, however, we thought we could provide something a bit different to the existing options, or at least something a bit more familiar to our users.

## Implementation in `@preact/preset-vite`

Year later, we were still quite in love with the simplicity and extensibility of WMR's prerendering and felt it was sorely missing from our Vite preset, so we looked to port it over with a few minor adjustment to fix the qualms we had. A little bit of work later and voila, prerendering via a plugin!

To get started with, here's an example of prerendering a "Hello World" app.

> Hint: Our Vite initializer, (`$ npm create preact`) can set this up for you along with a few other complimentary options, like routing, TypeScript, etc. If you're interested in trying out our prerendering, it's the fastest way to get up-to-speed.

Firstly, enable prerendering by setting `prerender: { enabled: true }` in `@preact/preset-vite`'s plugin options:

```diff
// vite.config.js
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		preact({
+			prerender: { enabled: true }
		}),
	],
});
```

...then add a `prerender` attribute to the script containing our `prerender()` function -- this lets the plugin know where to find it. While you can set this to any script you'd like, for our examples here, it'll always be in our app root.

```diff
// index.html
-<script type="module" src="/src/index.jsx"></script>
+<script prerender type="module" src="/src/index.jsx"></script>
```

...finally, make a couple adjustments to our app root:

1. Switch `render` to `hydrate`
	* `hydrate` from `preact-iso` is a very small utility which decides whether to render the app or hydrate depending on if it can find existing markup on the document. In dev it'll use `render`, but in production, with prerendered HTML, it'll use `hydrate`.
	* We do need to add a window check (`typeof window !== undefined`) to ensure we're not trying to access `document`, a browser global, in Node during SSR.

2. Add our `prerender()` export
	* This is the facilitator of prerendering, and it's entirely user controlled. You decide how your app should be rendered, which props to pass in to your root component, make any adjustments to the HTML, run any post-processing you'd like, etc. All that the plugin needs is for an object to be returned containing an `html` property with your HTML string.
	* For our examples here we'll use `prerender` from `preact-iso` which is a thin wrapper around `renderToStringAsync` from `preact-render-to-string` with one main advantage: it automatically collects and returns the relative links it finds in the pages you prerender. The prerender plugin can then use these links to "walk" your app, discovering pages itself. We'll show this off further later.

```diff
// src/index.jsx
-import { render } from 'preact';
+import { hydrate, prerender as ssr } from 'preact-iso';

function App() {
    return <h1>Hello World!</h1>
}

-render(<App />, document.getElementById('app'));
+if (typeof window !== 'undefined') {
+	hydrate(<App />, document.getElementById('app'));
+}

+export async function prerender(data) {
+    return await ssr(<App {...data} />)
+}
```

With this set up, you will have an app that prerenders. However, no app is really this simple, so let's look at a couple more complex examples.

### Full API Example

```jsx
// src/index.jsx

// ...

export async function prerender(data) {
    const { html, links: discoveredLinks } = ssr(<App />);

    return {
        html,
        // Optionally add additional links that should be
        // prerendered (if they haven't already been -- these will be deduped)
        links: new Set([...discoveredLinks, '/foo', '/bar']),
        // Optionally configure and add elements to the `<head>` of
        // the prerendered HTML document
        head: {
            // Sets the "lang" attribute: `<html lang="en">`
            lang: 'en',
            // Sets the title for the current page: `<title>My cool page</title>`
            title: 'My cool page',
            // Sets any additional elements you want injected into the `<head>`:
            //   <link rel="stylesheet" href="foo.css">
            //   <meta property="og:title" content="Social media title">
            elements: new Set([
                { type: 'link', props: { rel: 'stylesheet', href: 'foo.css' } },
                { type: 'meta', props: { property: 'og:title', content: 'Social media title' } }
            ])
        }
    }
}
```

### Fetch Content Isomorphically with Suspense-based Fetching

```jsx
// src/use-fetch.js
import { useState } from "preact/hooks";

const cache = new Map();

async function load(url) {
	const res = await fetch(url);
	if (res.ok) return await res.text();
	throw new Error(`Failed to fetch ${url}!`);
}

// Simple suspense-based fetch mechanism with caching
export function useFetch(url) {
	const [_, update] = useState({});

	let data = cache.get(url);
	if (!data) {
		data = load(url);
		cache.set(url, data);
		data.then(
			(res) => update((data.res = res)),
			(err) => update((data.err = err)),
		);
	}

	if (data.res) return data.res;
	if (data.err) throw data.err;
	throw data;
}
```

```jsx
// src/index.jsx
import { hydrate, prerender as ssr } from 'preact-iso';
import { useFetch } from './use-fetch.js';

function App() {
    return (
	    <div>
		    <Suspense fallback={<p>Loading...</p>}>
			    <Article />
		    </Suspense>
		</div>
    );
}

function Article() {
	const data = useFetch("/my-local-article.txt");
	return <p>{data}</p>;
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
    return await ssr(<App {...data} />)
}
```

### Using `globalThis` to pass data around

```js
// src/title-util.js
import { useEffect } from 'preact/hooks';

/**
 * Set `document.title` or `globalThis.title`
 * @param {string} title
 */
export function useTitle(title) {
	if (typeof window === 'undefined') {
		globalThis.title = createTitle(title);
	}
	useEffect(() => {
		if (title) {
			document.title = createTitle(title);
		}
	}, [title]);
}
```

```jsx
// src/index.jsx
import { LocationProvider, Router, hydrate, prerender as ssr } from 'preact-iso';

import { useTitle } from './title-util.js'

function App() {
    return (
	    <LocationProvider>
		    <main>
			    <Home path="/" />
			    <NotFound default />
		    </main>
		</LocationProvider>
    );
}

function Home() {
	useTitle('Preact - Home');
	return <h1>Hello World!</h1>;
}

function NotFound() {
	useTitle('Preact - 404');
	return <h1>Page Not Found</h1>;
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
    const { html, links } = await ssr(<App {...data} />);

	return {
		html,
		links,
		head: {
			title: globalThis.title,
			elements: new Set([
				{ type: 'meta', props: { property: 'og:title', content: globalThis.title } },
			])
		}
	};
}
```

You can also use this to fetch some data on first render, and reuse it for subsequent prerenders:

```jsx
// src/index.js

function App() {
	const [myData, setMyData] = useState(globalThis.myFetchData || 'some-fallback');
	...
}

let initialized = false;
export async function prerender(data) {
    const init = async () => {
		const res = await fetch(myURL);
		if (res.ok) globalThis.myFetchData = await res.json();

		initialized = true;
    }
    if (!initialized) await init();
}
```

---

For the curious asking "How does this all work?", it can be broken into three simple steps:

1. Setup

	We set the script with your exported `prerender()` function as an additional input and tell Rollup to preserve entry signatures, allowing us to access and call that function post-build.
2. Build

	We let Vite build your app as usual; compiling JSX, running plugins, optimizing assets, etc. Before the build finishes, however, we begin to consume the web bundles, using them to generate your HTML.
3. Execute

	During the `generateBundle` plugin stage, we move to build the HTML. Starting with `/`, we begin start rendering your app page-by-page, calling your `prerender()` function and inserting the returned HTML into your `index.html` document while using any links you return to render additional routes / pages.

	`/` will be output as `dist/index.html` while other routes will be output as such: `/foo` -> `dist/foo/index.html`, `/bar` -> `dist/bar/index.html`.

	Prerendering completes when we run out of URLs to feed back into your app.

Following this, Vite will continue on with the build process, running any other plugins you may have.

### Some Neat Features

- File system-based `fetch()` implementation
	- Before you run to get your pitchfork, hear us out! During prerendering (and only during prerendering) we patch `fetch()` to allow reading files directly from the file system. This allows you to consume static files (text, JSON, Markdown, etc.) during prerendering without having to start up a server to consume it. You can use the same file paths during prerendering as you will in the browser.
	- In fact, that's how we build the very page you're reading! `fetch('/content/blog/preact-prerender.json')`, which is what triggers when you navigate to this page, (roughly) translates to `new Response(await fs.readFile('/content/blog/preact-prerender.json'))` during prerendering. We read the file, wrap it in a `Response` to mimic a network request, and supply it back to your app -- your app can use the same `fetch()` request during prerendering and on the client.
	- Pairing this with suspense and an async SSR implementation provides a really great DX.
- Crawling Links
	- Partly supported by the user-provided `prerender()` function export, partly by the plugin, you can return a set of links upon prerendering the page (`preact-iso` makes this wonderfully simple) which will be added to the plugin's list of URLs to prerender. This will allow the plugin to crawl your site at build time, finding more and more pages to prerender naturally.
	- You can also provide links manually via the plugin options or by appending some to those that `preact-iso` returns, as we show above in the Full API Example. This is especially useful for error pages, like a `/404`, that might not be linked to but you still want to have it prerendered.

...and perhaps the biggest advantage:

- Toggle it by flipping a Boolean in your config file
	- Because we're not a wrapper, and because you don't need to alter your source code in order to support it beyond some window checks, there's no lock-in whatsoever. If you decide to move away, or you want to do some testing on your output, all you need to do is flip a Boolean and you're back to a plain SPA with Vite.
	- As we've mentioned a few times, prerendering is at its best when it is as near to "drop-in" as possible and that includes being able to drop back out on a whim. It's important to us that you can go from an SPA to prerendering and back again with minimal effort.

## Final Notes

The Vite team would probably like us to mention that this plugin does introduce a tiny patch to the generated client code, and that they (the Vite team) don't necessarily endorse running the browser bundles in Node.

The patch in question is as follows:

```diff
// src/node/plugins/importAnalysisBuild.ts
-if (__VITE_IS_MODERN__ && deps && deps.length > 0) {,
+if (__VITE_IS_MODERN__ && deps && deps.length > 0 && typeof window !== 'undefined') {,
	 const links = document.getElementsByTagName('link')
	 ...
```

As attempting to execute `document.getElementsByTagName` will error in Node where there is no `document` we simply add an additional condition to the preloader so that it makes no attempt to run in Node and that's it. Just the partial change of this one line.

However, we are very, very happy with this level of risk and have been suing it heavily for some time now without any issue, but, we are somewhat using the tool beyond what it was intended for and it's something we want to disclose.

For any non-Preact users, good news: our plugin is entirely framework agnostic! To make it slightly easier to use in any other framework, this is alternatively offered as [`vite-prerender-plugin`](https://npm.im/vite-prerender-plugin). Same functionality, and kept in-sync with `@preact/preset-vite`, but drops the other Preact-specific utilities that ship in the Preact preset plugin.
