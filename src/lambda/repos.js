/**
 * Mimics the sorting we show in the "Fetch GitHub Repos" example on the home page,
 * but also reduces down the payload to the few fields we need as GH returns
 * _a lot_ of data we don't use, 58kb -> 1.2kb.
 *
 * @param {import('../types.d.ts').GitHubOrgRepoData[]} repos
 * @return {import('../types.d.ts').FilteredRepoData[]}
 */
const sortAndFilter = repos =>
	repos
		.sort((a, b) => (a.stargazers_count < b.stargazers_count ? 1 : -1))
		.slice(0, 5)
		.map(repo => ({
			html_url: repo.html_url,
			full_name: repo.full_name,
			stargazers_count: repo.stargazers_count,
			description: repo.description
		}));


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

	const filteredRepoData = sortAndFilter(await result.json());

	return new Response(JSON.stringify(filteredRepoData), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=86400, stale-if-error=86400'
		}
	});
}
