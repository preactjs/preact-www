export default async function handler(req, _context) {
	const result = await repoInfo(
		req.queryStringParameters.repo || 'preactjs/preact'
	);
	return {
		statusCode: 200,
		body: JSON.stringify(result),
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=3600, stale-if-error=86400'
		}
	};
}

function checkStatus(r) {
	if (!r.ok) {
		throw new Error(`${r.status}: Request failed for '${r.url}'`);
	}

	return r;
}

const repoInfo = repo =>
	fetch(`https://api.github.com/repos/${repo}`)
		.then(checkStatus)
		.then(r => r.json());
