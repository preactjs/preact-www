import config from '../config.json';
import { useCallback } from 'preact/hooks';
import { useStore } from '../components/store-adapter';
import { useLocation } from 'preact-iso';

/**
 * Handles all logic related to language settings
 */
export function useLanguage() {
	const { url } = useLocation();
	const store = useStore(['lang']);
	const { lang } = store.state;

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
