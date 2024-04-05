import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import replace from '@rollup/plugin-replace';
import yaml from 'yaml';
import path from 'path';
import { promises as fs } from 'fs';
import { Feed } from 'feed';
import config from './src/config.json';

/**
 * @param {string} content
 * @param {string} path
 * @returns {string}
 */
function compileMarkdown(content, path) {
	// Find YAML FrontMatter preceeding a markdown document
	const FRONT_MATTER_REG = /^\s*---\n\s*([\s\S]*?)\s*\n---\n/i;

	// Find a leading title in a markdown document
	const TITLE_REG = /^\s*#\s+(.+)\n+/;

	const matches = content.match(FRONT_MATTER_REG);
	if (matches) {
		let meta;
		try {
			meta =
				yaml.parse('---\n' + matches[1].replace(/^/gm, '  ') + '\n') ||
				{};
		} catch (e) {
			throw new Error(`Error parsing YAML FrontMatter in ${path}`);
		}
		content = content.replace(FRONT_MATTER_REG, '');
		if (!meta.title) {
			let [, title] = content.match(TITLE_REG) || [];
			if (title) {
				meta.title = title;
			}
		}

		content = '---\n' + JSON.stringify(meta) + '\n---\n' + content;
	}

	return content;
}

export default defineConfig({
	publicDir: 'src/assets',
	build: {
		target: ['chrome88', 'edge88', 'es2020', 'firefox78', 'safari14'],
		outDir: 'build'
	},
	plugins: [
		replace({
			'process.env.BRANCH': JSON.stringify(process.env.BRANCH),
			preventAssignment: true
		}),
		preact({
			prerender: {
				enabled: true,
				renderTarget: '#app',
				// The routes that will not be discovered automatically
				additionalPrerenderRoutes: [
					'/404',
					'/guide/v8/getting-started',
					'/branding'
				]
			},
			devToolsEnabled: false
		}),
		viteStaticCopy({
			targets: [
				{
					src: './content/**/*.md',
					dest: './',
					transform: compileMarkdown
				}
			],
			structured: true,
			watch: {
				reloadPageOnChange: true
			}
		}),
		netlifyPlugin(),
		servePrerenderedHTML(),
		rssFeedPlugin()
	]
});

/**
 * @returns {import('vite').Plugin}
 */
function servePrerenderedHTML() {
	let outDir;

	return {
		name: 'serve-prerendered-html',
		config(config) {
			outDir = path.join(__dirname, config.build.outDir);
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

/**
 * @returns {import('vite').Plugin}
 */
function netlifyPlugin() {
	const lambdaDir = path.join(__dirname, 'src', 'lambda');

	async function netlifyFunctionMiddleware(req, res, next) {
		if (!req.url) return next();

		const url = new URL(req.url, `http://${req.headers.host}`);
		if (!url.pathname.startsWith('/.netlify/functions/')) return next();

		const file = path.join(
			lambdaDir,
			url.pathname
				.slice('/.netlify/functions/'.length)
				.split(path.posix.sep)
				.join(path.sep)
		);

		const m = await import(`${file}.js`);
		const result = await m.handler({
			queryStringParameters: Object.fromEntries(url.searchParams)
		});

		for (const [k, v] of Object.entries(result.headers)) {
			res.setHeader(k, v);
		}

		res.statusCode = result.statusCode;
		res.end(result.body);
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

/**
 * @returns {import('vite').Plugin}
 */
function rssFeedPlugin() {
	return {
		name: 'rss-feed',
		apply: 'build',
		generateBundle() {
			const feed = new Feed({
				title: 'Preact Blog',
				description: 'Preact news and articles',
				id: 'https://preactjs.com',
				link: 'https://preactjs.com',
				language: 'en',
				image: 'https://preactjs.com/assets/branding/symbol.png',
				favicon: 'https://preactjs.com/favicon.ico',
				copyright: 'All rights reserved 2022, the Preact team',
				feedLinks: {
					json: 'https://preactjs.com/json',
					atom: 'https://preactjs.com/atom'
				}
			});

			config.blog.forEach(post => {
				feed.addItem({
					title: post.name.en,
					id: `https://preactjs.com${post.path}`,
					link: `https://preactjs.com${post.path}`,
					description: post.excerpt.en,
					date: new Date(post.date)
				});
			});

			function removeDefaultGenerator(str) {
				return str
					.split('\n')
					.filter(
						line =>
							line !==
							'<generator>https://github.com/jpmonette/feed</generator>'
					)
					.join('\n');
			}

			this.emitFile({
				type: 'asset',
				fileName: 'feed.xml',
				source: removeDefaultGenerator(feed.rss2())
			});

			this.emitFile({
				type: 'asset',
				fileName: 'feed.atom',
				source: removeDefaultGenerator(feed.atom1())
			});
		}
	};
}
