/**
 * Encode text to base64 with unicode support
 *
 * @param {string} text
 */
export function textToBase64(text) {
	const bytes = new TextEncoder().encode(text);
	return btoa(String.fromCharCode(...bytes));
}

/**
 * Decode text from base64 with unicode support
 *
 * @param {string} base64
 */
export function base64ToText(base64) {
	const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
	return new TextDecoder().decode(bytes);
}
