/**
 * Get the default language based on the preferred preference of the browser
 * @param {Record<string, string>} available All available languages
 */
export function getDefaultLanguage(available = {}) {
	if (typeof navigator === 'undefined') return;

	let langs = [navigator.language].concat(navigator.languages);
	for (let i = 0; i < langs.length; i++) {
		if (langs[i]) {
			let lang = String(langs[i]).toLowerCase();
			if (available[lang]) return lang;
			// Respect order of `navigator.languages` by returning if the fallback language `English` is found
			if (lang === 'en') return;
		}
	}
}

const LANG_REG = /[?&]lang=([a-z-]+)/i;
/**
 * Replace or add the language to the url
 * @param {string} url
 * @param {string} lang
 */
export function addLangToUrl(url, lang) {
	const sep = url.indexOf('?') > -1 ? '&' : '?';
	if ((url.match(LANG_REG) || [])[1] || '') {
		return url.replace(LANG_REG, lang != 'en' ? `${sep}lang=${lang}` : '');
	}

	const hashIdx = url.indexOf('#');
	const start = hashIdx > -1 ? url.slice(0, hashIdx) : url.slice();
	const end = hashIdx > -1 ? url.slice(hashIdx) : '';
	return `${start}${sep}lang=${lang}${end}`;
}
