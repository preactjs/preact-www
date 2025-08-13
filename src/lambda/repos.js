/**
 * @param {Request} [req]
 * @param {unknown} [_context]
 */
export default async function repoLambda(req, _context) {
	const org = req?.url ? new URL(req.url).searchParams.get('org') : 'preactjs';

	const result = await fetch(
		`https://api.github.com/orgs/${org}/repos?sort=updated&per_page=10`
	);

	if (!result.ok) {
		throw new Error(`${result.status}: Request failed for '${result.url}'`);
	}

	return new Response(result.body, {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=86400, stale-if-error=86400'
		}
	});
}
