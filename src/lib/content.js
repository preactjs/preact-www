/**
 * Fetch and parse a markdown document with optional JSON FrontMatter.
 * @returns {Promise<import('./../types.d.ts').ContentData>}
 */
export async function getContent([lang, name]) {
	let path = `/content/${lang}`,
		url = `${path}/${name.replace(/^\//, '')}`,
		ext = (url.match(/\.([a-z]+)$/i) || [])[1];
	if (!ext)
		url = url.endsWith('/') ? url.replace(/\/$/, '.json') : url + '.json';

	let fallback = false;
	return await fetch(url, { credentials: 'include', mode: 'no-cors' })
		.then(r => {
			// fall back to english
			if (!r.ok && lang != 'en') {
				fallback = true;
				return fetch(url.replace(/content\/[^/]+\//, 'content/en/'));
			}
			return r;
		})
		.then(r => {
			if (r.ok) return r;
			return fetch(`${path}/${r.status}.json`);
		})
		.then(r => r.json())
		.then(data => {
			data.meta.isFallback = fallback;
			return data;
		});
}
