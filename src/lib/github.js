import { checkStatus } from './request';

function memoize(fn) {
	const CACHE = {};
	return key => CACHE[key] || (CACHE[key] = fn(key));
}

// TODO: use GraphQL to avoid fetching so much data
export const repoInfo = memoize(repo =>
	fetch(`https://api.github.com/repos/${repo}`)
		.then(checkStatus)
		.then(r => r.json())
		.catch(() => ({
			stargazers_count: 9999,
			watchers_count: 9999
		}))
);

const semverReg = /^.*?(\d+)\.(\d+)\.(\d+)(.*)?$/g;

/**
 * Parse semver version
 * @param {string} version
 */
function parseVersion(version) {
	semverReg.lastIndex = 0;
	const m = semverReg.exec(version);
	if (m) {
		return [+m[1], +m[2], +m[3], m[4]].filter(x => x !== undefined);
	}

	return [0, 0, 0];
}

export const fetchRelease = memoize(repo =>
	fetch(`https://api.github.com/repos/${repo}/releases`)
		.then(checkStatus)
		.then(r => r.json())
		.then(d => {
			const releases = (d || []).sort((releaseA, releaseB) => {
				const a = parseVersion(releaseA.tag_name);
				const b = parseVersion(releaseB.tag_name);

				// Major
				if (a[0] > b[0]) return -1;
				if (a[0] < b[0]) return 1;

				// Minor
				if (a[1] > b[1]) return -1;
				if (a[1] < b[1]) return 1;

				// Patch
				if (a[2] && a.length === 3 > b[2]) return -1;
				if (a[2] && a.length === 3 < b[2]) return 1;

				// Pre-Releases
				if (a.length > 3 && b.length === 3) return 1;
				if (a.length === 3 && b.length > 3) return -1;
				return a[3] - b[3];
			});

			return {
				version: releases.length ? releases[0].tag_name : 'unknown',
				url: releases.length ? releases[0].html_url : '#'
			};
		})
		.catch(() => ({
			url: '#',
			version: 'unknown'
		}))
);
