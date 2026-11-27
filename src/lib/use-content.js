import { useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';

import { createTitle } from './page-title.js';
import { getContent, getContentPath } from './content.js';
import { useLanguageContext } from './i18n.jsx';
import {
	useResource,
	createCacheKey,
	setupCacheEntry,
	CACHE
} from './use-resource.js';
import manifest from 'virtual:content-manifest';

/**
 * @param {string} path
 * @returns {import('./../types.d.ts').ContentData}
 */
export function useContent(path) {
	const { lang } = useLanguageContext();
	const fetch = contentFetcher(lang, path);
	if (!firstContent && typeof window !== 'undefined') {
		// The entry `useResource` creates below, which also re-renders this
		// component once loaded (needed while hydrating, e.g. on /repl)
		const cacheKey = createCacheKey(fetch, [lang, path]);
		firstContent = Promise.resolve()
			.then(() => CACHE.get(cacheKey)?.promise)
			.then(
				() => {},
				() => {}
			);
	}
	/** @type {import('./../types.d.ts').ContentData} */
	const { html, meta } = useResource(fetch, [lang, path]);
	useTitle(meta.title);
	useDescription(meta.description || '');

	return { html, meta };
}

/**
 * The one fetcher for content, so `useContent` and `prefetchContent` share
 * cache entries (keyed by the function's source and its arguments)
 *
 * @param {string} lang
 * @param {string} path
 */
const contentFetcher = (lang, path) => () => getContent(manifest, lang, path);

/** @type {Promise<void> | null} */
let firstContent = null;

/**
 * Resolves once the content that the first (i.e. hydrating) render asked for
 * has loaded, or right away if it asked for none
 */
export const firstContentLoaded = () => firstContent || Promise.resolve();

/**
 * @param {string} path
 * @param {string} [lang] Defaults to the current locale
 * @returns {Promise<void>} Resolves once loaded (or failed)
 */
export function prefetchContent(path, lang) {
	// The locale, from its BCP 47 tag (see `langTag`)
	const tag = document.documentElement.lang;
	lang ||= tag === 'ko' ? 'kr' : tag;
	// The home page is a component, without markdown content to fetch
	if (path === '/' || !manifest[getContentPath(path)]) return Promise.resolve();
	const fetch = contentFetcher(lang, path);

	const cacheKey = createCacheKey(fetch, [lang, path]);
	const entry = CACHE.get(cacheKey) || setupCacheEntry(fetch, cacheKey);
	return entry.promise.then(
		() => {},
		() => {}
	);
}

/**
 * Set `document.title`
 * @param {string} title
 */
export function useTitle(title) {
	const { url } = useLocation();

	if (typeof window === 'undefined') {
		globalThis.title = createTitle(title);
	}

	useEffect(() => {
		if (title) {
			document.title = createTitle(title);
		}
	}, [title, url]);
}

/**
 * Set the meta description tag content
 * @param {string} text
 */
export function useDescription(text) {
	if (typeof window === 'undefined') {
		globalThis.description = text;
	}
	useEffect(() => {
		if (!text) return;
		let el = document.querySelector('meta[name=description]');
		if (!el) {
			el = document.createElement('meta');
			el.setAttribute('name', 'description');
			document.head.appendChild(el);
		}
		el.setAttribute('content', text);
	}, [text]);
}
