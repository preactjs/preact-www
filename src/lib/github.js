import { checkStatus } from './request';

const baseUrl =
	process.env.NODE_ENV === 'production'
		? '/.netlify/functions/'
		: 'http://localhost:9000/.netlify/functions/';

export const repoInfo = repo =>
	fetch(`${baseUrl}repo?repo=${repo}`, { credentials: 'omit' })
		.then(checkStatus)
		.then(r => r.json())
		.catch(() => ({
			stargazers_count: 9999,
			watchers_count: 9999
		}));

export const fetchRelease = repo =>
	fetch(`${baseUrl}release?repo=${repo}`, { credentials: 'omit' })
		.then(checkStatus)
		.then(r => r.json())
		.then(d => ({
			version: d.version || 'unknown',
			url: d.url || 'https://github.com/preactjs/preact'
		}))
		.catch(() => ({
			url: '#',
			version: 'unknown'
		}));
