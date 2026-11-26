import ssr from 'preact-iso/prerender';
import { DOMParser } from '@xmldom/xmldom';

import { App } from './index.jsx';
import { getContentPath, getMarkdownPath } from './lib/content.js';

import release from './lambda/release.js';

// DOMParser polyfill for `preact-markup`
globalThis.DOMParser = DOMParser;

const promise = release().then((res) => res.json());

export async function prerender() {
	const preactData = await promise;

	const prerenderData = {
		preactVersion: preactData.version,
		preactReleaseURL: preactData.url
	};

	const res = await ssr(<App prerenderData={prerenderData} />);
	const markdownPath = getMarkdownPath(location.pathname);

	const elements = new Set(
		[
			{
				type: 'meta',
				props: { name: 'description', content: globalThis.description }
			},
			{
				type: 'meta',
				props: {
					property: 'og:url',
					content: `https://preactjs.com${location.pathname}`
				}
			},
			{
				type: 'meta',
				props: { property: 'og:title', content: globalThis.title }
			},
			{
				type: 'meta',
				props: { property: 'og:description', content: globalThis.description }
			},

			// Make sure old v8 docs aren't indexed by search engines, leads to confused users if they land there
			location.pathname.includes('/v8/') && {
				type: 'meta',
				props: { name: 'robots', content: 'noindex' }
			},

			markdownPath && {
				type: 'link',
				props: { rel: 'alternate', type: 'text/markdown', href: markdownPath }
			},

			// Preloading
			// These are all low priority, non-blocking fetches that we just want to have started early. None are critical due to prerendering.
			// The release link is on the home page only
			location.pathname == '/' && {
				type: 'link',
				props: {
					rel: 'preload',
					href: '/.netlify/functions/release?repo=preact',
					as: 'fetch',
					fetchpriority: 'low',
					crossorigin: ''
				}
			},
			// For the footer, which the full-screen tutorial & REPL don't have
			!/^\/(tutorial|repl)(\/|$)/.test(location.pathname) && {
				type: 'link',
				props: {
					rel: 'preload',
					href: '/contributors.json',
					as: 'fetch',
					fetchpriority: 'low',
					crossorigin: ''
				}
			},
			// Hardcoding English is intentional, first render always fetches it with user preference only being applied later
			// (the home page is a component, not markdown content)
			location.pathname != '/' && {
				type: 'link',
				props: {
					rel: 'preload',
					href: `/content/en${getContentPath(location.pathname)}.json`,
					as: 'fetch',
					fetchpriority: 'low',
					crossorigin: ''
				}
			},

			process.env.BRANCH && {
				type: 'script',
				children: `ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga('set','dimension1','${process.env.BRANCH}');onerror=function(e,f,l,c){ga('send','event','exception',e,f+':'+l+':'+c)}`
			}
		].filter(Boolean)
	);

	res.html +=
		'<script async defer src="https://www.google-analytics.com/analytics.js"></script>';

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
