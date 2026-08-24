import repoLambda from '../lambda/repos.js';

/**
 * `GET /api/repos?org=preactjs` — the org's most-starred repositories, trimmed
 * to the handful of fields the home page renders.
 *
 * @param {import('@pracht/core').ApiRouteArgs} args
 */
export function GET({ request }) {
	return repoLambda(request);
}
