export const handler = async event => {
	const { version, url } = await fetchRelease(
		`preactjs/${event?.queryStringParameters.repo || 'preact'}`
	);

	return {
		statusCode: 200,
		body: JSON.stringify({
			version,
			url
		}),
		headers: {
			'Cache-Control': 'public, max-age=3600, stale-if-error=86400',
			'Access-Control-Allow-Origin': 'http://localhost:8080'
		}
	};
};

function checkStatus(r) {
	if (!r.ok) {
		throw new Error(`${r.status}: Request failed for '${r.url}'`);
	}

	return r;
}

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

const fetchRelease = repo =>
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
				version: releases[0].tag_name,
				url: releases[0].html_url
			};
		});
