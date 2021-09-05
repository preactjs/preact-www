import { defineConfig } from 'wmr';
import yaml from 'yaml';
import { promises as fs } from 'fs';
import path from 'path';
import glob from 'glob';

/**
 * @param {string} content
 * @returns {string}
 */
function preCompileMarkdown(content) {
	// Find YAML FrontMatter preceeding a markdown document
	const FRONT_MATTER_REG = /^\s*---\n\s*([\s\S]*?)\s*\n---\n/i;

	// Find a leading title in a markdown document
	const TITLE_REG = /^\s*#\s+(.+)\n+/;
	const matches = content.match(FRONT_MATTER_REG);
	if (matches) {
		const meta =
			yaml.parse('---\n' + matches[1].replace(/^/gm, '  ') + '\n') || {};
		content = content.replace(FRONT_MATTER_REG, '');
		if (!meta.title) {
			let [, title] = content.match(TITLE_REG) || [];
			if (title) {
				content = content.replace(TITLE_REG, '');
				meta.title = title;
			}
		}

		content = '---\n' + JSON.stringify(meta) + '\n---\n' + content;
	}

	return content;
}

function markdownMiddleware(opts) {
	return async (req, res, next) => {
		if (!req.url.endsWith('.md')) return next();

		// FIXME:
		const filePath = path.join(opts.cwd, req.url);
		if (!filePath.startsWith(path.join(opts.cwd, 'content'))) {
			const err = new Error('Not found');
			err.code = 404;
			return next(err);
		}

		let content;
		try {
			content = await fs.readFile(filePath, 'utf-8');
			content = preCompileMarkdown(content);
			res.statusCode = 200;
			res.end(content);
		} catch (_) {
			const err = new Error('Not found');
			err.code = 404;
			return next(err);
		}
	};
}

/**
 * @returns {import('wmr').Plugin}
 */
function markdownPlugin() {
	/** @type {import('wmr').Options} */
	let config;

	return {
		name: 'markdown-plugin',
		config(opts) {
			return {
				middleware: [opts.mode === 'start' && markdownMiddleware(opts)].filter(
					Boolean
				)
			};
		},
		configResolved(opts) {
			config = opts;
		},
		async writeBundle() {
			const files = await new Promise((resolve, reject) => {
				glob('content/**/*.md', { cwd: config.cwd }, (err, matches) => {
					err ? reject(err) : resolve(matches);
				});
			});

			await Promise.all(
				files.map(async file => {
					const from = path.join(config.cwd, file);
					let content = await fs.readFile(from, 'utf-8');
					content = preCompileMarkdown(content);

					const target = path.join(config.cwd, 'build', file);
					await fs.mkdir(path.dirname(target), { recursive: true });
					await fs.writeFile(target, content);
				})
			);
		}
	};
}

async function readRedirects(file) {
	const content = await fs.readFile(file, 'utf-8');

	return content.split('\n').reduce(
		(acc, line) => {
			if (line) {
				const [from, to] = line.split(' ');
				if (from !== to) {
					if (from.endsWith('*')) {
						acc.partial[from.slice(0, -1)] = to.slice(0, -1);
					} else {
						acc.exact[from] = to;
					}
				}
			}

			return acc;
		},
		{ exact: {}, partial: {} }
	);
}

/**
 * @param {{redirectFile?: string, lambdaDir?: string, headerFile?: string}}
 * @returns {import('wmr').Plugin}
 */
function netlifyPlugin({ redirectFile, headerFile, lambdaDir } = {}) {
	let redirects = { exact: {}, partial: {} };

	function redirect(req, res, to) {
		// eslint-disable-next-line no-console
		console.log(`Redirecting ${req.url} -> ${to}`, redirects);
		res.writeHead(302, { Location: to });
		res.end();
	}

	let handlers;

	/** @type {import("wmr").Options} */
	let config;

	return {
		name: 'netlify',
		config(opts) {
			if (redirectFile && !path.isAbsolute(redirectFile)) {
				redirectFile = path.join(opts.cwd, redirectFile);
			}
			if (headerFile && !path.isAbsolute(headerFile)) {
				headerFile = path.join(opts.cwd, headerFile);
			}

			return {
				middleware: [
					async (req, res, next) => {
						const url = path.posix.normalize(req.url);

						if (!url.startsWith('/.netlify/functions/')) {
							return next();
						}

						if (!handlers) {
							const dir = path.join(lambdaDir);
							let files = await fs.readdir(dir);
							files = files.filter(file => /\.[cm]?js$/.test(file));

							handlers = {};
							await Promise.all(
								files.map(async file => {
									const name = path.basename(file, path.extname(file));
									const mod = await import(path.posix.join(lambdaDir, file));
									handlers[name] = mod.handler;
								})
							);
						}

						const parsed = new URL(url, 'http://localhost');
						const name = parsed.pathname.replace('/.netlify/functions/', '');

						if (typeof handlers[name] === 'function') {
							const fn = handlers[name];

							const queryParams = Array.from(
								parsed.searchParams.entries()
							).reduce((acc, param) => {
								acc[param[0]] = param[1];
								return acc;
							}, {});

							try {
								const json = await fn({ queryStringParameters: queryParams });

								res.writeHead(json.statusCode, {
									'Content-type': 'application/json',
									...json.headers
								});
								res.write(json.body);
								res.end();
							} catch (err) {
								// eslint-disable-next-line no-console
								console.log(err);

								res.writeHead(500);
								res.end('Internal Server Error');
							}
							return;
						}

						const err = new Error('Not found');
						err.code = 404;
						return next(err);
					},
					(req, res, next) => {
						let to = redirects.exact[req.url];
						if (to !== undefined) {
							redirect(req, res, to);
							return;
						}

						to = Object.keys(redirects.partial).find(from =>
							req.url.startsWith(from)
						);

						if (to !== undefined) {
							to = path.posix.join(to, req.url.slice(to.length));
							redirect(req, res, to);
							return;
						}

						next();
					}
				]
			};
		},
		configResolved(opts) {
			config = opts;
		},
		async buildStart() {
			if (redirectFile) {
				redirects = await readRedirects(redirectFile);
				this.addWatchFile(redirectFile);
			}
		},
		async writeBundle() {
			if (redirectFile) {
				await fs.copyFile(redirectFile, path.join(config.out, '_redirects'));
			}

			if (headerFile) {
				await fs.copyFile(headerFile, path.join(config.out, '_headers'));
			}
		},
		async watchChange(id, ev) {
			if (id === redirectFile) {
				try {
					redirects = await readRedirects(redirectFile);
				} catch (err) {
					this.error(err);
				}
			}
		}
	};
}

function txtPlugin() {
	return {
		name: 'txt',
		async load(id) {
			if (!/\.txt$/.test(id)) return;

			const text = await fs.readFile(id, 'utf-8');
			return `export default ${JSON.stringify(text)}`;
		}
	};
}

export default defineConfig(opts => ({
	plugins: [
		txtPlugin(),
		markdownPlugin(),
		netlifyPlugin({
			redirectFile: path.join(opts.cwd, 'src', '_redirects'),
			headerFile: path.join(opts.cwd, 'src', '_headers'),
			lambdaDir: path.join(opts.cwd, 'src', 'lambda')
		})
	],
	alias: {
		react: 'preact/compat',
		'react-dom': 'preact/compat'
	}
}));
