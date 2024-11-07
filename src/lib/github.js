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

const getFallbackData = (key) => {
	const el = document.getElementById('preact-prerender-data');
	if (!el) return null;
	const data = JSON.parse(el.textContent);
	return data[key];
};

export const injectedPrerenderData = {
	preactVersion: () => getFallbackData('prerenderPreactVersion'),
	preactReleaseUrl: () => getFallbackData('prerenderPreactReleaseUrl'),
	preactStargazers: () => getFallbackData('prerenderPreactStargazers')
};

const baseUrl = '/.netlify/functions/';

export const repoInfo = repo =>
	fetch(`${baseUrl}repo?repo=${repo}`, { credentials: 'omit' })
		.then(checkStatus)
		.then(r => r.json())
		.catch(() => ({
			stargazers_count: injectedPrerenderData.preactStargazers()
		}));

export const fetchRelease = repo =>
	fetch(`${baseUrl}release?repo=${repo}`, { credentials: 'omit' })
		.then(checkStatus)
		.then(r => r.json())
		.catch(() => ({
			version: injectedPrerenderData.preactVersion(),
			url: injectedPrerenderData.preactReleaseUrl()
		}));
