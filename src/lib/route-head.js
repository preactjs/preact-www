/**
 * Shared `head()` builder for every content-backed route.
 *
 * This replaces the hand-rolled element set the old `prerender()` entry
 * assembled: the same titles, descriptions, Open Graph tags and low-priority
 * preloads, but derived from loader data so they are correct per page rather
 * than per build.
 */

import { createTitle } from './page-title.js';
import { markdownUrl } from './content-path.js';

const ORIGIN = 'https://preactjs.com';

/**
 * @param {import('@pracht/core').HeadArgs<any>} args
 * @param {object} [options]
 * @param {string} [options.title] Override the title from the document meta
 * @returns {import('@pracht/core').HeadMetadata}
 */
export function pageHead({ data, url }, options = {}) {
	const meta = data?.content?.meta ?? {};
	const pathname = url.pathname;
	const title = createTitle(options.title ?? meta.title ?? '', pathname);
	const description = meta.description || '';

	/** @type {import('@pracht/core').HeadAttributes[]} */
	const metaTags = [
		{ name: 'description', content: description },
		{ property: 'og:url', content: `${ORIGIN}${pathname}` },
		{ property: 'og:title', content: title },
		{ property: 'og:description', content: description }
	];

	// Keep the v8 docs out of search results — landing there confuses readers
	// who are looking for current Preact.
	if (pathname.includes('/v8/')) {
		metaTags.push({ name: 'robots', content: 'noindex' });
	}

	/** @type {import('@pracht/core').HeadAttributes[]} */
	const link = [
		{ rel: 'canonical', href: `${ORIGIN}${pathname}` },
		// Low-priority, non-blocking fetches we just want started early. None are
		// critical: the page is already server-rendered.
		{
			rel: 'preload',
			href: '/api/release?repo=preact',
			as: 'fetch',
			fetchpriority: 'low'
		},
		// The agent-readable twin of this page.
		{
			rel: 'alternate',
			type: 'text/markdown',
			href: `${ORIGIN}${markdownUrl(pathname)}`
		}
	];

	if (pathname === '/') {
		link.push({
			rel: 'preload',
			href: '/api/repos?org=preactjs',
			as: 'fetch',
			fetchpriority: 'low'
		});
	}

	/** @type {import('@pracht/core').HeadScriptDescriptor[]} */
	const script = [];
	if (process.env.BRANCH) {
		script.push({
			children: `ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga('set','dimension1','${process.env.BRANCH}');onerror=function(e,f,l,c){ga('send','event','exception',e,f+':'+l+':'+c)}`
		});
	}
	script.push({
		src: 'https://www.google-analytics.com/analytics.js',
		async: '',
		defer: ''
	});

	return { title, meta: metaTags, link, script };
}
