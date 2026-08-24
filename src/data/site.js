/**
 * Server-only site-wide data, shared by every route loader.
 *
 * The old prerender entry fetched the latest release and the org repo list once
 * and serialized them into `#prerender-data`. pracht has no equivalent
 * shell-level loader, so instead each route loader merges this data in and the
 * shell reads it back with `useRouteData()`. Both network calls are memoized
 * for the life of the process, so a full SSG run of the docs tree still costs
 * exactly two GitHub requests.
 */

import releaseLambda from '../lambda/release.js';
import repoLambda from '../lambda/repos.js';
import config from '../config.json';
// 4kB of names, and only ever referenced from loaders — so it is bundled into
// the server build and stripped from the client one.
import contributors from '../assets/contributors.json';

/** @type {Promise<import('../types.d.ts').PrerenderData> | undefined} */
let pending;

/**
 * @returns {Promise<import('../types.d.ts').PrerenderData>}
 */
export function getSiteData() {
	if (!pending) pending = fetchSiteData();
	return pending;
}

/**
 * @returns {Promise<import('../types.d.ts').PrerenderData>}
 */
async function fetchSiteData() {
	const [release, repos] = await Promise.all([
		call(() => releaseLambda({ url: `https://x/?repo=${config.repo}` }), {
			version: '',
			url: ''
		}),
		call(() => repoLambda({ url: 'https://x/?org=preactjs' }), [])
	]);

	return {
		preactVersion: release.version,
		preactReleaseURL: release.url,
		preactOrgRepos: repos
	};
}

/**
 * GitHub is rate limited and occasionally down; neither should fail a build.
 * Both consumers refetch on the client, so an empty value degrades to the
 * pre-hydration state rather than to a broken page.
 *
 * @template T
 * @param {() => Promise<Response>} run
 * @param {T} fallback
 * @returns {Promise<T>}
 */
async function call(run, fallback) {
	try {
		return await (await run()).json();
	} catch (err) {
		console.warn(`[site-data] falling back: ${err.message}`);
		return fallback;
	}
}

/**
 * Wrap a route loader so its data carries the site-wide payload the shell needs.
 *
 * @template {Record<string, unknown>} T
 * @param {(args: import('@pracht/core').LoaderArgs) => Promise<T> | T} loader
 * @returns {(args: import('@pracht/core').LoaderArgs) => Promise<T & { site: import('../types.d.ts').PrerenderData }>}
 */
export function withSiteData(loader) {
	return async args => {
		const [data, site] = await Promise.all([loader(args), getSiteData()]);

		// Picked per page rather than per process, so the footer keeps naming a
		// different contributor as you read — but picked on the server, so the
		// name is in the HTML and survives hydration unchanged.
		return {
			...data,
			site: { ...site, contributor: randomContributor() }
		};
	};
}

/**
 * @returns {string | undefined}
 */
function randomContributor() {
	return contributors[(Math.random() * (contributors.length - 1)) | 0];
}
