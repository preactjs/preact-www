import { createContext } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { localStorageGet, localStorageSet } from './localstorage';
import config from '../config.json';

/**
 * @typedef LanguageContext
 * @property {string} lang
 * @property {(string) => void} setLang
 */

/**
 * @type {import('preact').Context<LanguageContext>}
 */
const LanguageContext = createContext(/** @type {LanguageContext} */ ({}));

/**
 * Get the default language based on the preferred preference of the browser
 * @param {Record<string, string>} available All available languages
 * @returns {string | undefined}
 */
function getNavigatorLanguage(available) {
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

export function LanguageProvider({ children }) {
	const { query } = useLocation();

	// We only prerender in English
	const [lang, setLang] = useState('en');

	useEffect(() => {
		const localStorageLang = localStorageGet('lang');
		const navigatorLang = getNavigatorLanguage(config.languages);
		const userLang = query.lang || localStorageLang || navigatorLang || 'en';

		setLang(userLang);
		document.documentElement.lang = userLang;
	}, []);

	const setAndUpdateHtmlAttr = (lang) => {
		localStorageSet('lang', lang);
		setLang(lang);
		document.documentElement.lang = lang;
	};

	return (
		<LanguageContext.Provider value={{ lang, setLang: setAndUpdateHtmlAttr }}>
			{children}
		</LanguageContext.Provider>
	);
}

/**
 * Handles all logic related to language settings
 * @returns {[string, (v: string) => void]}
 */
export function useLanguage() {
	const { lang, setLang } = useContext(LanguageContext);
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
