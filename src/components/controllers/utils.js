import { useEffect } from 'preact/hooks';

import { createTitle } from '../../lib/page-title';

/**
 * Set `document.title`
 * @param {string} title
 */
export function useTitle(title) {
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
	useEffect(() => {
		const el = document.querySelector('meta[name=description]');
		if (text && el) {
			el.setAttribute('content', text);
		}
	}, [text]);
}
