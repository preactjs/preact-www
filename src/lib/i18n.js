import config from '../config.json';
import { useCallback } from 'preact/hooks';
import { useStore } from '../components/store-adapter';

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

/**
 * Get the translation of a key. Defaults to english if no translation is found
 * @param {string} key
 */
export function useTranslation(key) {
	const [lang] = useLanguage();
	const data = config.i18n[key];
	return data[lang] || data.en;
}
