import { createContext } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';

import { localStorageGet, localStorageSet } from './localstorage.js';
import { useResource } from './use-resource.js';
import { firstContentLoaded, prefetchContent } from './use-content.js';
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
 * @property {Locale} lang The rendered language
 * @property {Locale} selectedLang The language being switched to, if any (see
 * `switchTo`), else `lang`
 * @property {(lang: Locale) => void} setLang
 * @property {Locale | ''} queryLang The language from `?lang=`, until one is
 * picked (it's only kept until the next full page load, unlike a picked one)
 * @property {typeof englishTranslations} translations
 * @property {typeof englishTranslations} fallback
 */

/**
 * @type {import('preact').Context<LanguageContext>}
 */
const LanguageContext = createContext(/** @type {LanguageContext} */ ({}));

/**
 * The first of the browser's languages the site has, also by its language
 * alone (e.g. `ko-KR` or `ja-JP`), unless English comes first
 *
 * @returns {Locale | undefined}
 */
function getNavigatorLanguage() {
	if (typeof navigator === 'undefined') return;

	for (const tag of [navigator.language, ...(navigator.languages || [])]) {
		if (!tag) continue;
		const lang = String(tag).toLowerCase();
		const locale = knownLocale(lang) || knownLocale(lang.split('-')[0]);
		if (locale === 'en') return;
		if (locale) return locale;
	}
}

/**
 * A locale from `?lang=`, storage or the browser, if known (`ko` being the
 * BCP 47 tag of `kr`, see `langTag`)
 *
 * @param {unknown} value
 * @returns {Locale | ''}
 */
function knownLocale(value) {
	const lang = value === 'ko' ? 'kr' : value;
	return typeof lang === 'string' &&
		Object.prototype.hasOwnProperty.call(config.locales, lang)
		? /** @type {Locale} */ (lang)
		: '';
}

export function LanguageProvider({ children }) {
	const { query, route, path } = useLocation();
	// Resolves once the reader has left the page that's being hydrated
	const leftFirstPage = useRef(/** @type {(() => void) | null} */ (null));
	const firstPath = useRef(path);
	useEffect(() => {
		if (path !== firstPath.current) leftFirstPage.current?.();
	}, [path]);

	// We only prerender in English
	const [lang, setLang] = useState('en');
	const [selectedLang, setSelectedLang] = useState('en');
	const [queryLang, setQueryLang] = useState(/** @type {Locale | ''} */ (''));

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

	// Hydrating the prerendered English page with translated props would keep
	// its English attributes (e.g. `lang`), so any language switch waits until
	// it's hydrated: its route and the content it renders have loaded (or the
	// reader has left it). The latest requested language wins.
	const hydrated = useRef(/** @type {Promise<unknown>} */ (Promise.resolve()));
	const wanted = useRef('en');
	/** @param {Locale} next */
	const switchTo = (next) => {
		wanted.current = next;
		setSelectedLang(next);
		hydrated.current.then(() => {
			if (wanted.current !== next) return;
			setLang(next);
			document.documentElement.lang = langTag(next);
		});
	};

	useEffect(() => {
		const left = new Promise((resolve) => (leftFirstPage.current = resolve));
		hydrated.current = routeHydrated
			.then(() => Promise.race([firstContentLoaded(), left]))
			// After the render that the content's arrival triggers
			.then(() => new Promise((resolve) => setTimeout(resolve)));

		const validQueryLang = knownLocale(query.lang);
		const userLang =
			validQueryLang ||
			knownLocale(localStorageGet('lang')) ||
			getNavigatorLanguage() ||
			'en';

		setQueryLang(validQueryLang);
		if (userLang === 'en') return;
		prefetchContent(path, userLang);
		switchTo(userLang);
	}, []);

	const setAndUpdateHtmlAttr = (lang) => {
		localStorageSet('lang', lang);
		setQueryLang('');
		// The picked (saved) language wins from now on, also when reloading
		const params = new URLSearchParams(location.search);
		if (params.has('lang')) {
			params.delete('lang');
			const search = params.toString();
			route(location.pathname + (search && `?${search}`) + location.hash, true);
		}
		switchTo(lang);
	};

	return (
		<LanguageContext.Provider
			value={{
				lang,
				selectedLang,
				setLang: setAndUpdateHtmlAttr,
				queryLang,
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
 * an untranslated page. From the content, not the locale, as the previous
 * content stays while a translation loads.
 *
 * @param {import('../types.d.ts').ContentMetaData} meta
 */
export function useContentLang(meta) {
	return meta.translationExists && meta.translationEnabled
		? langTag(meta.locale)
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
