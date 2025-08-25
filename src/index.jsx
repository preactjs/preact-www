import * as preact from 'preact';
import * as hooks from 'preact/hooks';
import { hydrate, prerender as ssr } from 'preact-iso';

import App from './components/app';
import { getContentPath } from './lib/use-content.js';
import './analytics';
import './style/index.css';

// allows users to play with preact in the browser developer console
globalThis.preact = { ...preact, ...hooks };


if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));

	// Might need to keep this around indefinitely, unfortunately
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.getRegistrations().then(registrations => {
			for (const registration of registrations) {
				registration.unregister();
			}
		});
	}
}

let initialized = false,
	prerenderData = {
		preactVersion: '',
		preactReleaseURL: '',
		preactOrgRepos: []
	};
export async function prerender() {
	const init = async () => {
		// DOMParser polyfill for `preact-markup`
		const { DOMParser } = await import('@xmldom/xmldom');
		globalThis.DOMParser = DOMParser;

		const [preactData, preactOrgRepos] = await Promise.all([
			import('./lambda/release.js')
				.then(m => m.default())
				.then(res => res.json()),
			import('./lambda/repos.js')
				.then(m => m.default())
				.then(res => res.json())
		]);

		prerenderData.preactVersion = preactData.version;
		prerenderData.preactReleaseURL = preactData.url;
		prerenderData.preactOrgRepos = preactOrgRepos;

		initialized = true;
	};
	if (!initialized) await init();

	const res = await ssr(<App prerenderData={prerenderData} />);

	const elements = new Set([
		{ type: 'meta', props: { name: 'description', content: globalThis.description } },
		{ type: 'meta', props: { property: 'og:url', content: `https://preactjs.com${location.pathname}` } },
		{ type: 'meta', props: { property: 'og:title', content: globalThis.title } },
		{ type: 'meta', props: { property: 'og:description', content: globalThis.description } },

		// Make sure old v8 docs aren't indexed by search engines, leads to confused users if they land there
		location.pathname.includes('/v8/') && { type: 'meta', props: { name: 'robots', content: 'noindex' } },

		// Preloading
		// These are all low priority, non-blocking fetches that we just want to have started early. None are critical due to prerendering.
		{ type: 'link', props: { rel: 'preload', href: '/.netlify/functions/release?repo=preact', as: 'fetch', fetchpriority: 'low' } },
		location.pathname == '/' && { type: 'link', props: { rel: 'preload', href: '/.netlify/functions/repos?org=preactjs', as: 'fetch', fetchpriority: 'low' } },
		{ type: 'link', props: { rel: 'preload', href: '/contributors.json', as: 'fetch', fetchpriority: 'low' } },
		// Hardcoding English is intentional, first render always fetches it with user preference only being applied later
		{ type: 'link', props: { rel: 'preload', href: `/content/en${getContentPath(location.pathname)}.json`, as: 'fetch', fetchpriority: 'low' } },

		process.env.BRANCH && { type: 'script', children: `ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga('set','dimension1','${process.env.BRANCH}');onerror=function(e,f,l,c){ga('send','event','exception',e,f+':'+l+':'+c)}` }
	].filter(Boolean));

	res.html += '<script async defer src="https://www.google-analytics.com/analytics.js"></script>';

	return {
		...res,
		data: prerenderData,
		head: {
			lang: 'en',
			title: globalThis.title,
			elements
		}
	};
}
