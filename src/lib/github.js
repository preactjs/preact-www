import { getFallbackData } from './prerender-data.jsx';

/**
 * Throw if the response status is in the error range
 * @param {Response} r
 */
function checkStatus(r) {
	if (!r.ok) {
		throw new Error(`${r.status}: Request failed for '${r.url}'`);
	}
	return r;
}

const baseUrl = '/.netlify/functions/';

export const repoInfo = repo =>
	fetch(`${baseUrl}repo?repo=${repo}`, { credentials: 'omit' })
		.then(checkStatus)
		.then(r => r.json())
		.catch(() => ({
			stargazers_count: getFallbackData().preactStargazers
		}));

export const fetchRelease = repo =>
	fetch(`${baseUrl}release?repo=${repo}`, { credentials: 'omit' })
		.then(checkStatus)
		.then(r => r.json())
		.catch(() => {
			const fallbackData = getFallbackData();
			return {
				version: fallbackData.preactVersion,
				url: fallbackData.preactReleaseUrl
			};
		});
