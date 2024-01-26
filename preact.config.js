import { resolve } from 'path';
import { Compilation, sources } from 'webpack';
import yaml from 'yaml';
import postcssImport from 'postcss-import';
import postcssCustomProperties from 'postcss-custom-properties';
import postcssNesting from 'postcss-nesting';
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

	config.module.noParse = [
		/babel-standalone/
	].concat(config.module.noParse || []);

	const { rule: babel } = helpers.getLoadersByName(config, 'babel-loader')[0];
	babel.exclude = [/babel-standalone/].concat(babel.exclude || []);

	const { loader: postcssLoader } = helpers.getLoadersByName(config, 'postcss-loader')[0];
	postcssLoader.options.postcssOptions.plugins.unshift(postcssImport());
	postcssLoader.options.postcssOptions.plugins.push(
		...[postcssCustomProperties({ preserve: true }), postcssNesting()]
	);

	for (const rule of config.module.rules) {
		rule.resourceQuery = {
			not: [/raw/, /file/]
		};
	}

	config.module.rules.push(
		{
			resourceQuery: /raw/,
			type: 'asset/source'
		},
		{
			resourceQuery: /file/,
			type: 'asset/resource'
		},
	);

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

					let meta;
					try {
						meta = yaml.parse('---\n' + matches[1].replace(/^/gm, '  ') + '\n') || {};
					} catch (e) {
						throw new Error(`Error parsing YAML FrontMatter in ${path}`);
					}
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
				toType: 'file'
			}, {
				context: __dirname,
				from: 'src/_redirects',
				to: '_redirects',
				toType: 'file'
			}]
		);
	}

	class RssFeedPlugin {
		apply(compiler) {
			compiler.hooks.thisCompilation.tap('RssFeedPlugin', compilation => {
				compilation.hooks.processAssets.tapAsync({
					name: 'RssFeedPlugin',
					stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
				}, (_assets, callback) => {
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

					compilation.emitAsset(
						'feed.xml',
						new sources.RawSource(removeDefaultGenerator(feed.rss2()))
					);
					compilation.emitAsset(
						'feed.atom',
						new sources.RawSource(removeDefaultGenerator(feed.atom1()))
					);

					callback();
				});
			});
		}
	}

	config.plugins.push(new RssFeedPlugin());
}
