import { useCallback } from 'preact/hooks';
import { useStore } from '../components/store-adapter';

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

/**
 * Handles all logic related to language settings
 */
export function useLanguage() {
	const store = useStore(['lang', 'url']);
	const { lang, url } = store.state;

	const setLang = useCallback(
		next => {
			if (typeof document !== 'undefined' && document.documentElement) {
				document.documentElement.lang = next;
			}
			store.update({ lang: next });
		},
		[url]
	);

	return [lang, setLang];
}
