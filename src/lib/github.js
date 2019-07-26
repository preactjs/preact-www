import { memoize } from 'decko';
import { checkStatus } from './request';

// function memoize(fn) {
// 	const CACHE = {};
// 	return key => CACHE[key] || (CACHE[key] = fn(key));
// }

// TODO: use GraphQL to avoid fetching so much data
export const repoInfo = memoize(repo =>
	fetch(`https://api.github.com/repos/${repo}`)
		.then(checkStatus)
		.then(r => r.json())
		.then(d => d.stargazers || d.watchers)
		.catch(() => 'unknown')
);

export const fetchRelease = memoize(repo =>
	fetch(`https://api.github.com/repos/${repo}/releases/latest`)
		.then(checkStatus)
		.then(r => r.json())
		.then(d => ({
			version: d.tag_name || 'unknown',
			url: d.html_url || '#'
		}))
		.catch(() => ({
			url: '#',
			version: 'unknown'
		}))
);
