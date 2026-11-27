import { createContext } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';

import { localStorageGet, localStorageSet } from './localstorage.js';
import { useResource } from './use-resource.js';
import { prefetchContent } from './use-content.js';
import { routeHydrated } from './route-hydrated.js';
import config from '../config.json' with { type: 'json' };
import englishTranslations from '../locales/en.json' with { type: 'json' };
/** @import { Locale } from '../types.d.ts' */

const translationURLs = import.meta.glob('../locales/!(en)*.json', {
	query: '?url&no-inline',
	eager: true,
	import: 'default'
});

/**
 * @typedef LanguageContext
 * @property {Locale} lang
 * @property {(lang: Locale) => void} setLang
 * @property {boolean} fromQuery Whether `lang` comes from a `?lang=` (only kept
 * until the next full page load, unlike a picked language)
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
	const { query, route } = useLocation();

	// We only prerender in English
	const [lang, setLang] = useState('en');
	const [fromQuery, setFromQuery] = useState(false);
	const picked = useRef(false);

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

		return fetch(url, {}).then((r) => r.json());
	}, [lang]);

	useEffect(() => {
		const userLang =
			query.lang ||
			localStorageGet('lang') ||
			getNavigatorLanguage(config.locales) ||
			'en';

		setFromQuery(!!query.lang);
		if (userLang === 'en') return;
		// Hydrating the prerendered English page with translated props would
		// keep its English attributes (e.g. `lang`): switch once it's hydrated,
		// i.e. its route and English content have rendered, meanwhile loading
		// the translated content
		prefetchContent(location.pathname, userLang);
		Promise.all([routeHydrated, prefetchContent(location.pathname, 'en')])
			// After the render that the content's arrival triggers
			.then(() => new Promise((resolve) => setTimeout(resolve)))
			.then(() => {
				if (picked.current) return;
				setLang(userLang);
				document.documentElement.lang = langTag(userLang);
			});
	}, []);

	const setAndUpdateHtmlAttr = (lang) => {
		picked.current = true;
		localStorageSet('lang', lang);
		setLang(lang);
		setFromQuery(false);
		// The picked (saved) language wins from now on, also when reloading
		const params = new URLSearchParams(location.search);
		if (params.has('lang')) {
			params.delete('lang');
			const search = params.toString();
			route(location.pathname + (search && `?${search}`) + location.hash, true);
		}
		document.documentElement.lang = langTag(lang);
	};

	return (
		<LanguageContext.Provider
			value={{
				lang,
				setLang: setAndUpdateHtmlAttr,
				fromQuery,
				translations,
				fallback: englishTranslations
			}}
		>
			{children}
		</LanguageContext.Provider>
	);
}

/**
 * The BCP 47 tag for a locale, for `lang` attributes: the site calls Korean
 * `kr`, which is the tag for Kanuri
 *
 * @param {string} lang
 */
export const langTag = (lang) => (lang === 'kr' ? 'ko' : lang);

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

/**
 * The `lang` for an element whose text (or accessible name) is
 * `translate(namespace, key)`: `'en'` when that's the English fallback on
 * another locale's page, so it isn't read with that locale's rules.
 */
export function useFallbackLang() {
	const { lang, translations } = useContext(LanguageContext);

	/**
	 * @param {string} namespace
	 * @param {string} key
	 * @returns {string}
	 */
	return (namespace, key) =>
		translations?.[namespace]?.[key] ? langTag(lang) : 'en';
}

/**
 * The `lang` of a markdown page's content: English when it's the fallback for
 * an untranslated page.
 *
 * @param {import('../types.d.ts').ContentMetaData} meta
 */
export function useContentLang(meta) {
	const { lang } = useContext(LanguageContext);
	return meta.translationExists && meta.translationEnabled
		? langTag(lang)
		: 'en';
}

/**
 * A hidden label for `aria-labelledby`, for elements whose own `lang` mustn't
 * change (they contain translated content) but whose name may be an English
 * fallback.
 *
 * @param {{ id: string, namespace: string, k: string }} props
 */
export function HiddenLabel({ id, namespace, k }) {
	const translate = useTranslate();
	const fallbackLang = useFallbackLang();
	return (
		<span id={id} hidden lang={fallbackLang(namespace, k)}>
			{translate(/** @type {any} */ (namespace), /** @type {any} */ (k))}
		</span>
	);
}
