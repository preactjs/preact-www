import config from '../config.json';
import { useContext, useState } from 'preact/hooks';
import { createContext } from 'preact';
import { useLang } from 'hoofd';
import { useLocation } from 'preact-iso';

const LanguageContext = createContext({});

/**
 * Get the default language based on the preferred preference of the browser
 * @param {Record<string, string>} available All available languages
 * @param {string} [override]
 * @returns {string | undefined}
 */
export function getDefaultLanguage(available, override) {
	if (typeof navigator === 'undefined') return;

	// Override via `?lang=foo` parameter
	if (override && config.languages[override]) {
		return override;
	}

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
	const location = useLocation();

	const [lang, setLang] = useState(
		getDefaultLanguage(config.languages, location.query.lang) || 'en'
	);

	useLang(lang);

	return (
		<LanguageContext.Provider value={{ lang, setLang }}>
			{children}
		</LanguageContext.Provider>
	);
}

/**
 * Handles all logic related to language settings
 * @returns {[string, (v: string | ((v: string) => string) => void)]}
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
