/**
 * @param {Request} [req]
 * @param {unknown} [_context]
 */
export default async function repoLambda(req, _context) {
	const repo = req?.url
		? new URL(req.url).searchParams.get('repo')
		: 'preactjs/preact';

	const result = await repoInfo(repo);

	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=3600, stale-if-error=86400'
		}
	});
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
