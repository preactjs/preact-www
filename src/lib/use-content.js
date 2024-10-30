import { useEffect } from 'preact/hooks';

import { createTitle } from './page-title';
import { fetchContent } from './use-resource.js';

/**
 * @param {string} path
 * @returns {{ html: string, meta: any }}
 */
export function useContent(path) {
	const { html, meta } = fetchContent(path);
	useTitle(meta.title);
	useDescription(meta.description);

	return { html, meta };
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
