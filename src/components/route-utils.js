import config from '../config.json';

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
