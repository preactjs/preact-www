export const LATEST_MAJOR = 'v10';
const DOC_REG = /^\/guide\/v(\d+)\//;

/**
 * Retrieve the docs version from the url
 * @param {string} url
 * @returns {number}
 */
export function getCurrentDocVersion(url) {
	const match = url.match(DOC_REG);
	return match != null ? match[1] : LATEST_MAJOR;
}

/**
 * Check if the current url is a docs page
 * @param {string} url
 * @returns {boolean}
 */
export function isDocPage(url) {
	return DOC_REG.test(url);
}
