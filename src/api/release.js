import releaseLambda from '../lambda/release.js';

/**
 * `GET /api/release?repo=preact` — latest release tag and URL.
 *
 * Replaces the Netlify function of the same name; `/.netlify/functions/release`
 * is still routed here for anything holding the old URL.
 *
 * @param {import('@pracht/core').ApiRouteArgs} args
 */
export function GET({ request }) {
	return releaseLambda(request);
}
