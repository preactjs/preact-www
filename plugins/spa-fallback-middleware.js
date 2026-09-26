import path from 'node:path';
import { promises as fs } from 'node:fs';

/**
 * Vite's SPA fallback provides no indication to the requester that it's falling back
 * which is a problem for our content loader.
 *
 * @returns {import('vite').Plugin}
 */
export function spaFallbackMiddlewarePlugin() {
	/**
	 * @type {import('vite').Connect.NextHandleFunction}
	 */
	const spaFallbackMiddleware = async (req, res, next) => {
		if (!req.url) return next();

		const url = new URL(req.url, `http://${req.headers.host}`);
		if (!url.pathname.startsWith('/content')) return next();

		try {
			await fs.access(path.join(__dirname, '..', url.pathname.replace(/\.json$/, '.md')));
			next();
		} catch {
			res.statusCode = 404;
			res.end();
		}
	};

	return {
		name: 'disable-spa-fallback-routing-for-content',
		configureServer(server) {
			server.middlewares.use(spaFallbackMiddleware);
		},
		configurePreviewServer(server) {
			server.middlewares.use(spaFallbackMiddleware);
		}
	};
}
