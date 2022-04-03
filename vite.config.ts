import { defineConfig, Plugin } from 'vite';
import preact from '@preact/preset-vite';
import inspect from 'vite-plugin-inspect';
import yaml from 'yaml';
import path from 'path';
import fs from 'fs/promises';

export default defineConfig({
	build: {
		manifest: true
	},
	plugins: [inspect(), preact(), netlify(), markdown()]
});

const FRONT_MATTER_REG = /^\s*---\n\s*([\s\S]*?)\s*\n---\n\n?([\S\s]*)/i;

function markdown(): Plugin {
	return {
		name: 'md',
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				const url = req.url;
				if (url && url.endsWith('.md')) {
					const file = path.resolve(
						__dirname,
						url
							.slice(1)
							.split(path.posix.sep)
							.join(path.sep)
					);

					if (
						path.relative(path.join(__dirname, 'content'), file).startsWith('.')
					) {
						throw new Error(`Url "${url}" outside allowed folders`);
					}

					const md = await fs.readFile(file, 'utf-8');

					// We'll replace the yaml frontmatter with json frontmatter
					// to avoid the need to ship a yaml parser to the client
					const jsonMd = md.replace(FRONT_MATTER_REG, (s, y, rest) => {
						const meta =
							yaml.parse('---\n' + y.replace(/^/gm, '  ') + '\n') || {};
						return '---\n' + JSON.stringify(meta) + '\n---\n\n' + rest;
					});

					res.end(jsonMd);
					return;
				}
				next();
			});
		}
	};
}

export interface NetlifyFnResult {
	statusCode?: number;
	// eslint-disable-next-line no-undef
	headers?: Record<string, string>;
	body?: string;
}

function netlify(): Plugin {
	return {
		name: 'netlify',
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				if (!req.url) {
					return next();
				}

				const url = new URL(req.url, 'http://localhost:3000');

				if (!url.pathname.startsWith('/.netlify/functions/')) {
					return next();
				}

				const dir = path.join(__dirname, 'src', 'lambda');
				const file = path.join(
					dir,
					url.pathname
						.slice('/.netlify/functions/'.length)
						.split(path.posix.sep)
						.join(path.sep)
				);

				// Avoid directory traversal
				if (path.relative(dir, file).startsWith('.')) {
					return next();
				}

				const mod = await server.ssrLoadModule(file);

				const fnResult: NetlifyFnResult | undefined = await mod.handler({
					queryStringParameters: Array.from(url.searchParams.entries()).reduce(
						(acc, [key, value]) => {
							acc[key] = value;
							return acc;
						},
						{}
					)
				});

				if (!fnResult) {
					return next();
				}

				res.statusCode = fnResult.statusCode || 200;
				if (fnResult.headers) {
					for (const [key, value] of Object.entries(fnResult.headers)) {
						res.setHeader(key, value);
					}
				}

				res.end(fnResult.body || '');
			});
		}
	};
}
