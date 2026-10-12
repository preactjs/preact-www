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
 * @param {string} locale
 * @param {string} path
 * @returns {Promise<import('./../types.d.ts').ContentData>}
 */
export async function getContent(manifest, locale, path) {
	let url = `/content/${locale}/${getContentPath(path).replace(/^\//, '')}`,
		ext = (url.match(/\.([a-z]+)$/i) || [])[1];

	if (!ext) {
		url = url.endsWith('/') ? url.replace(/\/$/, '.json') : url + '.json';
	}

	let isFallback = false;
	if (!manifest[path].includes(locale)) {
		isFallback = true;
		url = url.replace(locale, 'en');
	}

	const res = await fetch(url);
	const data = await res.json();
	data.meta.isFallback = isFallback;
	return data;
}
