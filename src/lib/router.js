import { useRoute, route } from 'preact-iso';

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
	const currentRoute = useRoute();
	if (currentRoute.path === props.path) {
		route(props.to, props.replace);
	}
}
