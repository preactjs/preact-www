import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

/**
 * @typedef {import('../types.d.ts').PrerenderData} PrerenderData
 */

/**
 * @returns {PrerenderData | {}}
 */
export function getFallbackData() {
	if (typeof window === 'undefined') return {};
	const el = document.getElementById('prerender-data');
	if (!el) return {};
	const data = JSON.parse(el.textContent);
	return data;
}

/**
 * @type {import('preact').Context<PrerenderData>}
 */
const PrerenderDataContext = createContext(/** @type {PrerenderData} */ ({}));

/**
 * @param {{ value?: PrerenderData, children: any }} props
 */
export function PrerenderDataProvider({ value, children }) {
	const fallbackData = getFallbackData();

	const preactVersion = value?.preactVersion || fallbackData.preactVersion;
	const preactReleaseURL =
		value?.preactReleaseURL || fallbackData.preactReleaseUrl;
	const preactOrgRepos = value?.preactOrgRepos || fallbackData.preactOrgRepos;
	const contributor = value?.contributor || fallbackData.contributor;

	return (
		<PrerenderDataContext.Provider
			value={{ preactVersion, preactReleaseURL, preactOrgRepos, contributor }}
		>
			{children}
		</PrerenderDataContext.Provider>
	);
}

/**
 * @returns {PrerenderData}
 */
export function usePrerenderData() {
	return useContext(PrerenderDataContext);
}
