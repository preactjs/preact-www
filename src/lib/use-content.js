import { useEffect } from 'preact/hooks';
import { useLocation } from '@pracht/core';

import { createTitle } from './page-title';
import { getContent } from './content.js';
import { getContentPath } from './content-path.js';
import { useLanguageContext } from './i18n';
import {
	useResource,
	createCacheKey,
	setupCacheEntry,
	CACHE
} from './use-resource.js';

export { getContentPath };

/**
 * Content for the current page.
 *
 * The server already compiled the English document and handed it to us as
 * loader data, so the common case costs no fetch at all. When the reader
 * switches to another language we fall back to the prebuilt
 * `/content/<lang>/**.json` assets, exactly as before.
 *
 * @param {string} path
 * @param {import('./../types.d.ts').ContentData} [initial] Loader-provided content
 * @returns {import('./../types.d.ts').ContentData}
 */
export function useContent(path, initial) {
	const { lang } = useLanguageContext();
	const contentPath = getContentPath(path);
	const usePrerendered = initial != null && lang === 'en';

	// `useResource` resolves synchronously when the thunk returns a non-promise,
	// so the prerendered case never suspends.
	/** @type {import('./../types.d.ts').ContentData} */
	const { html, meta } = useResource(
		() =>
			usePrerendered
				? /** @type {any} */ (initial)
				: getContent([lang, contentPath]),
		[lang, contentPath, usePrerendered]
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
	const contentPath = getContentPath(path);
	const fetch = () => getContent([lang, contentPath]);

	const cacheKey = createCacheKey(fetch, [lang, contentPath]);
	if (CACHE.has(cacheKey)) return;

	setupCacheEntry(fetch, cacheKey);
}

/**
 * Keep `document.title` in sync when the language changes client-side.
 *
 * The initial title comes from the route's `head()` export, which runs on the
 * server with the same loader data.
 *
 * @param {string} title
 */
export function useTitle(title) {
	const { url } = useLocation();

	useEffect(() => {
		if (title) {
			document.title = createTitle(title);
		}
	}, [title, url]);
}

/**
 * @param {string} text
 */
export function useDescription(text) {
	useEffect(() => {
		const el = document.querySelector('meta[name=description]');
		if (text && el) {
			el.setAttribute('content', text);
		}
	}, [text]);
}
