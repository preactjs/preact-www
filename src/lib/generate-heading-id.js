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
		const base = generateHeadingId(text) || 'section';
		let id = base;
		// Skip suffixes that are taken too, e.g. by a heading literally named
		// "Fragment-1" following two "Fragment"s
		for (let n = 1; used.has(id); n++) id = `${base}-${n}`;
		used.add(id);
		return id;
	};
}
