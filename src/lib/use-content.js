import { useEffect } from 'preact/hooks';

import { createTitle } from './page-title';
import { getContent } from './content.js';
import { useLanguage } from './i18n';
import { useResource, createCacheKey, setupCacheEntry, CACHE } from './use-resource.js';

/**
 * @param {string} path
 * @returns {{ html: string, meta: any }}
 */
export function useContent(path) {
	const [lang] = useLanguage();
	const { html, meta } = useResource(() => getContent([lang, path]), [lang, path]);
	useTitle(meta.title);
	useDescription(meta.description);

	return { html, meta };
}

/**
 * @param {string} path
 */
export function prefetchContent(path) {
	const lang = document.documentElement.lang;
	const fetch = () => getContent([lang, path]);

	const cacheKey = createCacheKey(fetch, [lang, path]);
	if (CACHE.has(cacheKey)) return;

	setupCacheEntry(fetch, cacheKey);
}

/**
 * Set `document.title`
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

/**
 * Set the meta description tag content
 * @param {string} text
 */
export function useDescription(text) {
	if (typeof window === 'undefined') {
		globalThis.description = text;
	}
	useEffect(() => {
		const el = document.querySelector('meta[name=description]');
		if (text && el) {
			el.setAttribute('content', text);
		}
	}, [text]);
}
