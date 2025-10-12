import { createContext } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';

import { localStorageGet, localStorageSet } from './localstorage';
import { useResource } from './use-resource.js';
import { allPages } from '../config.js';
import config from '../config.json';
import englishTranslations from '../locales/en.json';

const translationURLs = import.meta.glob('../locales/!(en)*.json', {
	query: '?url&no-inline',
	eager: true,
	import: 'default'
});

/**
 * @typedef LanguageContext
 * @property {string} lang
 * @property {(string) => void} setLang
 * @property {typeof englishTranslations} translations
 * @property {typeof englishTranslations} fallback
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

	const translations = useResource(() => {
		if (lang == 'en') return Promise.resolve(englishTranslations);
		let url = '';
		for (const language in translationURLs) {
			if (language.includes(`/${lang}.json`)) {
				url = /** @type {string} */ (translationURLs[language]);
				break;
			}
		}
		if (!url) throw new Error(`No translation found for language: ${lang}`);

		return fetch(url, {
			credentials: 'include',
			mode: 'no-cors'
		}).then(r => r.json());
	}, [lang]);

	console.log('Loaded language:', lang, translations);

	useEffect(() => {
		const userLang =
			query.lang ||
			localStorageGet('lang') ||
			getNavigatorLanguage(config.languages) ||
			'en';

		setLang(userLang);
		document.documentElement.lang = userLang;
	}, []);

	const setAndUpdateHtmlAttr = lang => {
		localStorageSet('lang', lang);
		setLang(lang);
		document.documentElement.lang = lang;
	};

	return (
		<LanguageContext.Provider
			value={{
				lang,
				setLang: setAndUpdateHtmlAttr,
				translations,
				fallback: englishTranslations
			}}
		>
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

export function useLanguageContext() {
	return useContext(LanguageContext);
}

/**
 * Maps a key to its translated string based upon the current language.
 *
 * @param {keyof typeof englishTranslations.i18n} key
 */
export function useTranslation(key) {
	const { translations, fallback } = useContext(LanguageContext);

	return translations.i18n[key] || fallback.i18n[key];
}

/**
 * Maps a path to its translated name based upon the current language.
 *
 * @param {keyof allPages} path
 */
export function usePathTranslation(path) {
	const { translations, fallback } = useContext(LanguageContext);

	const key = allPages[path].label;

	return translations.headerNav[key] || fallback.headerNav[key];
}

/**
 * Maps a path to its translated name based upon the current language.
 *
 * @param {keyof allPages} path
 * @param {typeof englishTranslations} translations
 * @param {typeof englishTranslations} fallback
 */
export function translatePath(path, translations, fallback) {
	const key = allPages[path].label;

	return translations.docPages[key] || fallback.docPages[key];
}

export function reeee(sectionName, translations, fallback) {
	return translations.docPages[sectionName] || fallback.docPages[sectionName];
}

///**
// * Get the translated name of a path based upon the current language.
// * @param {string} path
// */
//export function useNavTranslation(path) {
//	const [lang] = useLanguage();
//
//	const routeName = config.nav.find(r => r.path == path);
//	if (!routeName) throw new Error(`No route found for path: ${path}`);
//	return getHeaderRouteName(routeName.name, lang);
//}
//
///**
// * @param {string} routeName
// * @param {string} lang
// * @return {string}
// */
//export function getHeaderRouteName(routeName, lang) {
//	const data = englishTranslations.nav.header[routeName];
//	if (!data) console.log(routeName, lang);
//	if (!data)
//		throw new Error(`Missing header translation obj for: ${routeName}`);
//	return data;
//}
//
///**
// * @param {string} routeName
// * @param {string} lang
// * @return {string}
// */
//export function getSidebarRouteName(routeName, lang) {
//	const data = englishTranslations.nav.sidebar[routeName];
//	if (!data) console.log(routeName, lang);
//	if (!data)
//		throw new Error(`Missing version translation obj for: ${routeName}`);
//	return data;
//}
