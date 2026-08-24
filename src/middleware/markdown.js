/**
 * `Accept: text/markdown` content negotiation for every content-backed page.
 *
 * pracht's built-in negotiation reads a static `markdown` export off the route
 * module, which works for hand-written pages but not for ours: one module
 * (`/guide/:version/:name`) stands in for a few hundred documents. Doing it in
 * middleware keeps a single URL per page while still letting the response vary
 * per request.
 *
 * Browsers are unaffected — `Accept: * / *` and `text/html` both fall through
 * to the normal render pipeline.
 */

import { loadMarkdownSource } from '../lib/content-server.js';
import config from '../config.json';

const MARKDOWN_MEDIA_TYPE = 'text/markdown';

/**
 * @param {string | null} header
 * @returns {boolean}
 */
export function prefersMarkdown(header) {
	if (!header) return false;

	/** @type {{ type: string, quality: number }[]} */
	const entries = [];
	for (const raw of header.split(',')) {
		const parts = raw.trim().split(';');
		const type = parts
			.shift()
			?.trim()
			.toLowerCase();
		if (!type) continue;

		let quality = 1;
		for (const param of parts) {
			const [key, value] = param.split('=').map(p => p.trim());
			if (key === 'q' && value != null) {
				const parsed = Number.parseFloat(value);
				if (!Number.isNaN(parsed)) quality = parsed;
			}
		}
		entries.push({ type, quality });
	}

	const md = entries.find(e => e.type === MARKDOWN_MEDIA_TYPE);
	if (!md || md.quality === 0) return false;

	// A wildcard `*/*` must not win markdown — only an explicit preference does.
	const html = entries.find(e => e.type === 'text/html');
	return !html || md.quality >= html.quality;
}

/**
 * Also mounted on the not-found page, which is where `/guide/v10/hooks.md`
 * lands: the suffix form is not a route, so nothing matches it. Serving it from
 * the app rather than as a static file is what gets it the right content type —
 * and it means `llms.txt` can link `.md` URLs that actually work.
 *
 * @type {import('@pracht/core').MiddlewareFn}
 */
export const middleware = async ({ request, url }, next) => {
	// Client-side navigations ask for loader JSON through the same URL; they
	// must never be answered with markdown.
	const isRouteState =
		request.headers.get('x-pracht-route-state-request') != null;

	const suffixed = url.pathname.endsWith('.md');
	const routePath = suffixed
		? url.pathname.slice(0, -'.md'.length) || '/'
		: url.pathname;

	if (!isRouteState) {
		const wanted = suffixed || prefersMarkdown(request.headers.get('accept'));

		if (wanted) {
			const source = await loadMarkdownSource(
				routePath === '/index' ? '/' : routePath,
				requestedLang(url)
			);

			if (source != null) {
				return new Response(source, {
					headers: {
						'content-type': 'text/markdown; charset=utf-8',
						'cache-control': 'public, max-age=0, must-revalidate',
						// Only meaningful for the negotiated form, but harmless on the
						// suffix form and simpler than branching.
						vary: 'Accept'
					}
				});
			}
		}
	}

	const response = await next();

	// Both representations live at one URL, so caches need to key on Accept
	// even when we hand back HTML.
	const vary = response.headers.get('vary');
	if (!vary) {
		response.headers.set('vary', 'Accept');
	} else if (!/\baccept\b/i.test(vary)) {
		response.headers.set('vary', `${vary}, Accept`);
	}

	return response;
};

/**
 * Agents can request a translation with `?lang=`, mirroring the language
 * switcher readers use.
 *
 * @param {URL} url
 * @returns {string}
 */
function requestedLang(url) {
	const lang = url.searchParams.get('lang');
	return lang && Object.hasOwn(config.locales, lang) ? lang : 'en';
}
