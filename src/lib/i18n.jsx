import { createContext } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { useBrowserQuery } from './router.js';

import { localStorageGet, localStorageSet } from './localstorage';
import { useResource } from './use-resource.js';
import config from '../config.json';
import englishTranslations from '../locales/en.json';

/**
 * URLs of the translation bundles, fetched on demand when a reader picks a
 * language. English is imported statically above, since it is both the default
 * and the fallback for every missing key.
 *
 * Plain `*.json` rather than `!(en)*.json`: the extglob form silently resolves
 * to an empty object under Vite 8's production build (it works in dev), which
 * leaves every translation unreachable. English is filtered out below instead.
 */
const translationURLs = Object.fromEntries(
	Object.entries(
		import.meta.glob('../locales/*.json', {
			query: '?url&no-inline',
			eager: true,
			import: 'default'
		})
	).filter(([path]) => !path.endsWith('/en.json'))
);

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
	const query = useBrowserQuery();

	// We only prerender in English
	const [lang, setLang] = useState('en');

	const translations = useResource(() => {
		if (lang == 'en') return englishTranslations;
		let url = '';
		for (const translationURL in translationURLs) {
			if (translationURL.includes(`/${lang}.json`)) {
				url = /** @type {string} */ (translationURLs[translationURL]);
				break;
			}
		}
		if (!url) throw new Error(`No translation found for language: ${lang}`);

		return fetch(url, {
			credentials: 'include',
			mode: 'no-cors'
		}).then(r => r.json());
	}, [lang]);

	// Depends on `query.lang`, not just mount: the router publishes the
	// browser's query string after the hydration tree settles, so a
	// `?lang=` on a statically generated page arrives one tick late.
	useEffect(() => {
		const userLang =
			query.lang ||
			localStorageGet('lang') ||
			getNavigatorLanguage(config.locales) ||
			'en';

		setLang(userLang);
		document.documentElement.lang = userLang;
	}, [query.lang]);

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

export function useLanguageContext() {
	return useContext(LanguageContext);
}

/**
 * Maps a key to its translated string based upon the current language.
 */
export function useTranslate() {
	const { translations, fallback } = useContext(LanguageContext);

	/**
	 * @template {keyof typeof translations} T
	 * @template {keyof typeof translations[T]} K
	 * @param {T} namespace
	 * @param {K} key
	 * @return {typeof translations[T][K]}
	 */
	return (namespace, key) =>
		translations[namespace][key] || fallback[namespace][key];
}
