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
