/**
 * @param {string} text
 * @returns {string}
 */
export function generateHeadingId(text) {
	// Note: character range in regex is roughly "word characters including accented" (eg: bublé)
	return text
		.toLowerCase()
		.replace(/[\s-!<>`",]+/g, '-')
		.replace(/^-|-$|[/&.()[\]']/g, '');
}

// `## Heading {#some-id}`: an explicit id, e.g. so a translated heading keeps
// the English anchor that other pages link to
const EXPLICIT_ID = /\s*\{#([\w-]+)\}\s*$/;

/**
 * @param {string} text
 * @returns {string | undefined} The heading's explicit `{#id}`, if any
 */
export function explicitHeadingId(text) {
	return text.match(EXPLICIT_ID)?.[1];
}

/**
 * @param {string} text
 * @returns {string} The heading text without an explicit `{#id}`
 */
export function stripHeadingId(text) {
	return text.replace(EXPLICIT_ID, '');
}

/**
 * Like `generateHeadingId`, but for all headings of one document: repeated
 * headings get a numeric suffix (`#fragment`, `#fragment-1`, ...) so every
 * id, and the ToC links pointing at them, stays unique. A heading with an
 * explicit `{#id}` also keeps the id its text would get as an `alias`, so
 * existing links to it still work; later headings don't reuse it.
 *
 * @returns {(text: string) => { id: string, alias: string }}
 */
export function createHeadingIdGenerator() {
	/** @type {Set<string>} */
	const used = new Set();
	/** @param {string} base */
	const unique = (base) => {
		let id = base;
		// Skip suffixes that are taken too, e.g. by a heading literally named
		// "Fragment-1" following two "Fragment"s
		for (let n = 1; used.has(id); n++) id = `${base}-${n}`;
		used.add(id);
		return id;
	};
	return (text) => {
		const explicit = explicitHeadingId(text);
		const derived = generateHeadingId(stripHeadingId(text));
		// Text without any id-able characters (e.g. `## ...`) still gets an id
		const id = unique(explicit || derived || 'section');
		let alias = '';
		if (explicit && derived && !used.has(derived)) {
			alias = derived;
			used.add(alias);
		}
		return { id, alias };
	};
}
