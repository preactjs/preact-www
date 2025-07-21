import config from '../config.json';

/**
 * @typedef RouteInfo
 * @property {string} path
 * @property {string | Record<string, string>} name
 *
 */

/**
 * @returns {Record<string, RouteInfo>}
 */
function flattenRoutes(routes) {
	let out = {};

	const stack = [...routes];
	let item;
	while ((item = stack.pop())) {
		if (item.routes) {
			for (let i = item.routes.length - 1; i >= 0; i--) {
				stack.push(item.routes[i]);
			}
		} else {
			out[item.path] = item;
		}
	}

	return out;
}

export const navRoutes = flattenRoutes(config.nav);

export const docRoutes = {};
for (const k in config.docs) {
	docRoutes[k] = flattenRoutes(config.docs[k]);
}

export const v10StructuredDocRoutes = [];
for (const k of config.docs.v10) {
	v10StructuredDocRoutes.push({
		name: k.name.en,
		routes: k.routes.map(route => route.path)
	});
}

export const blogRoutes = flattenRoutes(config.blog);

export const tutorialRoutes = flattenRoutes(config.tutorial);
