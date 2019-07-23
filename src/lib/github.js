import { memoize } from 'decko';

// function memoize(fn) {
// 	const CACHE = {};
// 	return key => CACHE[key] || (CACHE[key] = fn(key));
// }

// TODO: use GraphQL to avoid fetching so much data
export const repoInfo = memoize(repo =>
	fetch(`https://api.github.com/repos/${repo}`).then(r => r.json())
);

export const fetchRelease = memoize(repo =>
	fetch(`https://api.github.com/repos/${repo}/releases/latest`)
		.then(r => r.json())
		.then(d => ({
			version: d.tag_name,
			url: d.html_url
		}))
);
