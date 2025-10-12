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

export const navRoutes = flattenRoutes([{ path: '/', name: 'Preact' }]);

export const docRoutes = {
	v10: {
		'/getting-started': { path: '/getting-started', name: 'Getting Started' }
	}
};
//for (const k in config.docs) {
//	docRoutes[k] = flattenRoutes(config.docs[k]);
//}

//console.log(docRoutes);

//export const v10StructuredDocRoutes = [];
//for (const k of config.docs.v10) {
//	v10StructuredDocRoutes.push({
//		name: k.name.en,
//		routes: k.routes.map(route => route.path)
//	});
//}

export const blogRoutes = flattenRoutes(config.blog);

export const tutorialRoutes = flattenRoutes(['']);
