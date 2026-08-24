// `preact-markup` needs DOMParser while rendering compiled content during SSR.
import './dom-polyfill.js';

import docs from 'virtual:pracht/content/docs';

export const FALLBACK_LANG = 'en';

/**
 * @param {string} routePath e.g. `/guide/v10/hooks`, `/`, `/tutorial`
 * @param {string} [lang]
 * @returns {Promise<import('../types.d.ts').ContentData | undefined>}
 */
export async function loadContent(routePath, lang = FALLBACK_LANG) {
	const resolution = await docs.resolveByRoute(routePath, { locale: lang });
	if (!resolution) return undefined;

	const { html, meta } = resolution.document.compiled;
	return { html, meta: { ...meta, isFallback: resolution.fallback } };
}

/**
 * @param {string} routePath
 * @param {string} [lang]
 * @returns {Promise<import('../types.d.ts').ContentData>}
 */
export async function requireContent(routePath, lang) {
	const content = await loadContent(routePath, lang);
	if (!content) {
		const { notFound } = await import('@pracht/core');
		throw notFound(`No content for ${routePath}`);
	}
	return content;
}
