import { useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';

import { createTitle } from './page-title';
import { getContent } from './content.js';
import { useLanguage } from './i18n';
import {
	useResource,
	createCacheKey,
	setupCacheEntry,
	CACHE
} from './use-resource.js';

/**
 * Correct the few site paths that differ from the markdown file name/structure
 *
 * @param {string} path
 * @returns {string}
 */
export function getContentPath(path) {
	if (path == '/') return '/index';
	if (path == '/tutorial') return '/tutorial/index';
	return path;
}

/**
 * @param {string} path
 * @returns {import('./../types.d.ts').ContentData}
 */
export function useContent(path) {
	const [lang] = useLanguage();
	const contentPath = getContentPath(path);
	/** @type {import('./../types.d.ts').ContentData} */
	const { html, meta } = useResource(() => getContent([lang, contentPath]), [
		lang,
		contentPath
	]);
	useTitle(meta.title);
	useDescription(meta.description || '');

	return { html, meta };
}

/**
 * @param {string} path
 */
export function prefetchContent(path) {
	const lang = document.documentElement.lang;
	const contentPath = getContentPath(path);
	const fetch = () => getContent([lang, contentPath]);

	const cacheKey = createCacheKey(fetch, [lang, contentPath]);
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
		const el = document.querySelector('meta[name=description]');
		if (text && el) {
			el.setAttribute('content', text);
		}
	}, [text]);
}
