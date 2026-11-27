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
 * @returns {string} The heading text without an explicit `{#id}`
 */
export function stripHeadingId(text) {
	return text.replace(EXPLICIT_ID, '');
}

/**
 * @param {string} text
 * @returns {string} For a heading with an explicit `{#id}`, the id its text
 * would get, kept as an alias so existing links to it still work
 */
export function headingAliasId(text) {
	return EXPLICIT_ID.test(text) ? generateHeadingId(stripHeadingId(text)) : '';
}

/**
 * Like `generateHeadingId`, but for all headings of one document: repeated
 * headings get a numeric suffix (`#fragment`, `#fragment-1`, ...) so every
 * id, and the ToC links pointing at them, stays unique.
 *
 * @returns {(text: string) => string}
 */
export function createHeadingIdGenerator() {
	/** @type {Set<string>} */
	const used = new Set();
	return (text) => {
		// Text without any id-able characters (e.g. `## ...`) still gets an id
		const base =
			text.match(EXPLICIT_ID)?.[1] || generateHeadingId(text) || 'section';
		let id = base;
		// Skip suffixes that are taken too, e.g. by a heading literally named
		// "Fragment-1" following two "Fragment"s
		for (let n = 1; used.has(id); n++) id = `${base}-${n}`;
		used.add(id);
		return id;
	};
}
