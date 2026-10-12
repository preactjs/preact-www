import { useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';

import { createTitle } from './page-title';
import { getContent } from './content.js';
import { useLanguageContext } from './i18n';
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
	/** @type {import('./../types.d.ts').ContentData} */
	const { html, meta } = useResource(
		() => getContent(manifest, lang, path),
		[lang, path]
	);
	useTitle(meta.title);
	useDescription(meta.description || '');

	return { html, meta };
}

/**
 * @param {string} path
 */
export function prefetchContent(path) {
	const lang = document.documentElement.lang;
	const fetch = () => getContent(manifest, lang, path);

	const cacheKey = createCacheKey(fetch, [lang, path]);
	if (CACHE.has(cacheKey)) return;

	setupCacheEntry(fetch, cacheKey);
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
