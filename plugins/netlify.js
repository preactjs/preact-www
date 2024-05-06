import path from 'node:path';
import { pathToFileURL } from 'node:url'
import { Readable } from 'stream';

/**
 * @returns {import('vite').Plugin}
 */
export function netlifyPlugin() {
	const lambdaDir = path.join(__dirname, '..', 'src', 'lambda');

	/**
	 * @type {import('vite').Connect.NextHandleFunction}
	 */
	async function netlifyFunctionMiddleware(req, res, next) {
		if (!req.url) return next();

		const url = new URL(req.url, `http://${req.headers.host}`);
		if (!url.pathname.startsWith('/.netlify/functions/')) return next();

		const file = pathToFileURL(
			path.join(
				lambdaDir,
				url.pathname
					.slice('/.netlify/functions/'.length)
					.split(path.posix.sep)
					.join(path.sep)
			)
		);

		const { default: netlifyLambda } = await import(`${file}.js?t=${Date.now()}`);
		const result = await netlifyLambda({ url });

		for (const [k, v] of result.headers.entries()) {
			res.setHeader(k, v);
		}

		res.statusCode = result.status;
		Readable.from(result.body).pipe(res);
	}

	return {
		name: 'netlify-plugin',
		configureServer(server) {
			server.middlewares.use(netlifyFunctionMiddleware);
		},
		configurePreviewServer(server) {
			server.middlewares.use(netlifyFunctionMiddleware);
		}
	};
}
