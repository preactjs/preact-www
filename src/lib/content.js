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
 * Fetch and parse a markdown document with optional JSON FrontMatter.
 *
 * @param {import('../types.d.ts').ContentManifest} manifest
 * @param {import('../types.d.ts').Locale} locale
 * @param {string} path
 * @returns {Promise<import('./../types.d.ts').ContentData>}
 */
export async function getContent(manifest, locale, path) {
	let contentPath = getContentPath(path),
		url = `/content/${locale}/${contentPath.replace(/^\//, '')}`,
		ext = (url.match(/\.([a-z]+)$/i) || [])[1];

	if (!ext) {
		url = url.endsWith('/') ? url.replace(/\/$/, '.json') : url + '.json';
	}

	const { exists, enabled } = manifest[contentPath][locale] || {};

	if (!exists || !enabled) {
		url = url.replace(locale, 'en');
	}

	const res = await fetch(url);
	const data = /** @type {import('./../types.d.ts').ContentData} */ (
		await res.json()
	);
	data.meta.translationExists = exists;
	data.meta.translationEnabled = enabled;
	return data;
}
