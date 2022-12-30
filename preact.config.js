import { resolve } from 'path';
import fs from 'fs';
import yaml from 'yaml';
import netlifyPlugin from 'preact-cli-plugin-netlify';
import customProperties from 'postcss-custom-properties';
import pageConfig from './src/config.json';
import { Feed } from 'feed';
// prettier-ignore

/**
 * @param {import('preact-cli').Config} config
 * @param {import('preact-cli').Env} env
 * @param {import('preact-cli').Helpers} helpers
 */
export default function (config, env, helpers) {
	// aliases from before the beginning of time
	Object.assign(config.resolve.alias, {
		src: resolve(__dirname, 'src'),
		components: resolve(__dirname, 'src/components'),
		style: resolve(__dirname, 'src/style'),
		lib: resolve(__dirname, 'src/lib')
	});

	// Use our custom polyfill entry
	if (!env.isServer) {
		config.entry.polyfills = resolve(__dirname, 'src/polyfills.js');
	}

	const { plugin: definePlugin } = helpers.getPluginsByName(config, 'DefinePlugin')[0];
	definePlugin.definitions.PRERENDER = String(env.isServer);
	definePlugin.definitions['process.env.BRANCH'] = JSON.stringify(process.env.BRANCH);

	// web worker HMR requires it
	config.output.globalObject = 'self';

	config.module.noParse = [
		/babel-standalone/
	].concat(config.module.noParse || []);

	const { rule: babel } = helpers.getLoadersByName(config, 'babel-loader')[0];
	babel.exclude = [/babel-standalone/].concat(babel.exclude || []);

	// Add CSS Custom Property fallback
	const { loader: postcssLoader } = helpers.getLoadersByName(config, 'postcss-loader')[0];
	postcssLoader.options.postcssOptions.plugins.push(customProperties({ preserve: true }));

	// Fix keyframes being minified to colliding names when using lazy-loaded CSS chunks
	if (env.isProd && !env.isServer) {
		const optimizeCss = config.optimization.minimizer.find(plugin => plugin.constructor.name == 'OptimizeCssAssetsWebpackPlugin');
		optimizeCss.options.cssProcessorOptions.reduceIdents = false;
	}

	config.optimization.splitChunks.minSize = 1000;

	if (!env.isServer) {
		// Find YAML FrontMatter preceeding a markdown document
		const FRONT_MATTER_REG = /^\s*---\n\s*([\s\S]*?)\s*\n---\n/i;

		// Find a leading title in a markdown document
		const TITLE_REG = /^\s*#\s+(.+)\n+/;

		// Converts YAML FrontMatter to JSON FrontMatter for easy client-side parsing.
		const { plugin: copyPlugin } = helpers.getPluginsByName(config, 'CopyPlugin')[0];
		copyPlugin.patterns = copyPlugin.patterns.concat([
			{
				context: __dirname,
				from: 'content',
				to: 'content',
				transform(content, path) {
					if (typeof content !== 'string') {
						content = content.toString('utf8');
					}

					const matches = content.match(FRONT_MATTER_REG);
					if (!matches) return content;

					const meta = yaml.parse('---\n' + matches[1].replace(/^/gm, '  ') + '\n') || {};
					content = content.replace(FRONT_MATTER_REG, '');
					if (!meta.title) {
						let [, title] = content.match(TITLE_REG) || [];
						if (title) {
							content = content.replace(TITLE_REG, '');
							meta.title = title;
						}
					}

					content = '---\n' + JSON.stringify(meta) + '\n---\n' + content;
					return content;
				}
			}, {
				context: __dirname,
				from: 'src/robots.txt',
				to: 'robots.txt'
			}, {
				context: __dirname,
				from: 'src/_headers',
				to: '_headers',
				// Copy-Webpack-Plugin otherwise assumes it's a directory, which results in errors
				toType: 'file'
			}]
		);

		netlifyPlugin(config, {
			redirects: fs.readFileSync('src/_redirects', 'utf-8').trim().split('\n')
		});
	}

	class RssFeedPlugin {
		apply(compiler) {
			const handler = (compilation, callback) => {
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

				pageConfig.blog.forEach(post => {
					feed.addItem({
							title: post.name.en,
							id: `https://preactjs.com${post.path}`,
							link: `https://preactjs.com${post.path}`,
							description: post.excerpt.en,
							date: new Date(post.date)
					});
				});

				class RawSource {
					constructor(str) {
						this.str = str;
					}

					source() {
						return this.str;
					}

					size() {
						return this.str.length;
					}
				}

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

				compilation.assets['feed.xml'] = new RawSource(
					removeDefaultGenerator(feed.rss2())
				);
				compilation.assets['feed.atom'] = new RawSource(
					removeDefaultGenerator(feed.atom1())
				);

				callback();
				return compilation;
			};


			if (compiler.hooks) {
				compiler.hooks.emit.tapAsync('RssFeedPlugin', handler);
			} else {
				compiler.plugin('emit', handler);
			}
		}
	}

	config.plugins.push(new RssFeedPlugin());
}
