import { useEffect, useState } from 'preact/hooks';
import { subscribers, getCurrentUrl, route } from 'preact-router';

/**
 * @typedef {object} RouteResult
 * @property {boolean} matches
 * @property {string} url
 * @property {string} path
 */

/**
 * Hooks-based API for preact router. If the current location matches the
 * specified path, this hook will return
 * @param {string} path The path this route should match
 * @returns {RouteResult}
 */
export function useRoute(path) {
	const [url, setMatch] = useState(getCurrentUrl());
	useEffect(() => {
		subscribers.push(setMatch);
		return () => subscribers.splice(subscribers.indexOf(setMatch) >>> 0, 1);
	}, []);

	const match = url.replace(/\?.+$/, '');
	return {
		matches: path === match,
		url,
		path: match
	};
}

/**
 * @typedef {Object} RedirectProps
 * @property {string} path
 * @property {string} to
 * @property {boolean} replace
 */

/**
 * Component to redirect urls
 * @param {RedirectProps} props
 */
export function Redirect(props) {
	const { matches } = useRoute(props.path);
	if (matches) route(props.to, props.replace);
}
