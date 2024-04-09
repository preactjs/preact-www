import path from 'node:path';
import { promises as fs } from 'node:fs';

/**
 * Vite's preview server won't route to anything but `/index.html` without
 * a file extension, e.g., `/tutorial` won't route to `/tutorial/index.html`
 *
 * @returns {import('vite').Plugin}
 */
export function htmlRoutingMiddlewarePlugin() {
	let outDir;

	return {
		name: 'serve-prerendered-html',
		config(config) {
			outDir = path.join(__dirname, '..', config.build.outDir);
		},
		configurePreviewServer(server) {
			server.middlewares.use(async (req, _res, next) => {
				if (!req.url) return next();

				const url = new URL(req.url, `http://${req.headers.host}`);
				// If URL has a file extension, bail
				if (url.pathname != url.pathname.split('.').pop()) return next();

				const file = path.join(
					outDir,
					url.pathname
						.split(path.posix.sep)
						.join(path.sep),
					'index.html'
				);

				try {
					await fs.access(file);
					req.url += '/index.html';
				} catch {
					req.url = '/404/index.html';
				}

				return next();
			});
		}
	};
}
