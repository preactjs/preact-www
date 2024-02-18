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

export const fallbackData = {
	preactVersion: '10.19.5',
	preactReleaseUrl: 'https://github.com/preactjs/preact/releases/tag/10.19.5',
	preactStargazers: 35783
};

const baseUrl =
	process.env.NODE_ENV === 'production'
		? '/.netlify/functions/'
		: 'http://localhost:9000/.netlify/functions/';

export const repoInfo = repo =>
	fetch(`${baseUrl}repo?repo=${repo}`, { credentials: 'omit' })
		.then(checkStatus)
		.then(r => r.json())
		.catch(() => ({
			stargazers_count: fallbackData.preactStargazers
		}));

export const fetchRelease = repo =>
	fetch(`${baseUrl}release?repo=${repo}`, { credentials: 'omit' })
		.then(checkStatus)
		.then(r => r.json())
		.catch(() => ({
			version: fallbackData.preactVersion,
			url: fallbackData.preactReleaseUrl
		}));
