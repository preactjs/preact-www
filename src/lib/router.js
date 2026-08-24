/**
 * Thin compatibility layer over pracht's router primitives.
 *
 * The site was written against `preact-iso`'s `useRoute()` / `useLocation()`,
 * which hand back `{ path, params, query, url, route }`. pracht splits the same
 * information across `useLocation()`, `useParams()` and `useNavigate()`, so we
 * reassemble the old shape here rather than rewriting every consumer.
 */

import {
	useLocation as usePrachtLocation,
	useNavigate,
	useParams
} from '@pracht/core';

/**
 * @param {string} search
 * @returns {Record<string, string>}
 */
function toQuery(search) {
	/** @type {Record<string, string>} */
	const query = {};
	for (const [key, value] of new URLSearchParams(search)) {
		query[key] = value;
	}
	return query;
}

/**
 * @typedef RouteInfo
 * @property {string} path Pathname of the current URL
 * @property {Record<string, string>} params Matched dynamic segments
 * @property {Record<string, string>} query Parsed search params
 * @property {string} url Pathname + search
 */

/**
 * The query string as the browser actually has it.
 *
 * Every page here is statically generated, so the hydration state pracht
 * serializes carries the URL the page was *built* at — which never has a query
 * string. `useRoute().query` is therefore empty on first render of
 * `/repl?example=…` or `/guide/v10/hooks?lang=zh`, even though the browser is
 * plainly on that URL.
 *
 * This reads `window.location` instead, while still subscribing to the router
 * so it recomputes on client navigation. Because server and client disagree by
 * construction, only use it where the result does not affect the first render:
 * inside an effect, or in a component that renders after hydration.
 *
 * @returns {Record<string, string>}
 */
export function useBrowserQuery() {
	const { search } = usePrachtLocation();

	return toQuery(
		typeof window === 'undefined' ? search : window.location.search
	);
}

/**
 * @returns {RouteInfo}
 */
export function useRoute() {
	const { pathname, search } = usePrachtLocation();

	return {
		path: pathname,
		params: /** @type {Record<string, string>} */ (useParams()),
		query: toQuery(search),
		url: pathname + search
	};
}

/**
 * `preact-iso`'s `useLocation()`, backed by pracht.
 *
 * `route(url, replace)` maps onto pracht's `navigate(to, { replace })`.
 *
 * @returns {RouteInfo & { route: (url: string, replace?: boolean) => void }}
 */
export function useLocation() {
	const navigate = useNavigate();

	return {
		...useRoute(),
		route: (url, replace) => void navigate(url, { replace })
	};
}
