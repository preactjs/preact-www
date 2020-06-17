import { resolve } from 'path';
import fs from 'fs';
import delve from 'dlv';
import CopyPlugin from 'copy-webpack-plugin';
import Critters from 'critters-webpack-plugin';
import yaml from 'yaml';
import netlifyPlugin from 'preact-cli-plugin-netlify';
import customProperties from 'postcss-custom-properties';
import SizePlugin from 'size-plugin';
// prettier-ignore

export default function (config, env, helpers) {
	// aliases from before the beginning of time
	Object.assign(config.resolve.alias, {
		src: resolve(__dirname, 'src'),
		components: resolve(__dirname, 'src/components'),
		style: resolve(__dirname, 'src/style'),
		lib: resolve(__dirname, 'src/lib'),
		'promise-polyfill$': resolve(__dirname, 'src/promise-polyfill.js')
	});

	// Use our custom polyfill entry
	if (!config.entry['ssr-bundle']) {
		config.entry.polyfills = resolve(__dirname, 'src/polyfills.js');
	}

	helpers.getPluginsByName(config, 'DefinePlugin')[0].plugin.definitions.PRERENDER = String(env.ssr===true);
	helpers.getPluginsByName(config, 'DefinePlugin')[0].plugin.definitions['process.env.BRANCH'] = JSON.stringify(process.env.BRANCH);

	// web worker HMR requires it
	config.output.globalObject = 'self';

	config.module.noParse = [
		/babel-standalone/
	].concat(config.module.noParse || []);

	const babel = helpers.getLoadersByName(config, 'babel-loader')[0].rule;
	babel.exclude = [/babel-standalone/].concat(babel.exclude || []);

	// something broke in less
	config.module.rules.forEach(loader => {
		const opts = delve(loader, 'use.0.options.options');
		if (opts && opts.paths) delete opts.paths;
	});

	// Add CSS Custom Property fallback
	const cssConfig = config.module.rules.filter(d => d.test.test('foo.less'));
	cssConfig.forEach(c => {
		c.use.filter(d => d.loader == 'postcss-loader').forEach(x => {
			x.options.plugins.push(customProperties({ preserve: true }));
		});
	});

	const critters = helpers.getPluginsByName(config, 'Critters')[0];
	if (critters) {
		config.plugins[critters.index] = new Critters({
			preload: 'media',
			mergeStylesheets: false,
			pruneSource: false
		});
	}

	// Fix keyframes being minified to colliding names when using lazy-loaded CSS chunks
	const optimizeCss = config.optimization && (config.optimization.minimizer || []).filter(plugin => /^OptimizeCssAssets(Webpack)?Plugin$/.test(plugin.constructor.name))[0];
	if (optimizeCss) {
		optimizeCss.options.cssProcessorOptions.reduceIdents = false;
	}

	Object.assign(config.optimization.splitChunks || (config.optimization.splitChunks = {}), {
		minSize: 1000
	});

	const sizePlugin = helpers.getPluginsByName(config, 'SizePlugin')[0];
	if (sizePlugin) {
		config.plugins[sizePlugin.index] = new SizePlugin({
			publish: true,
			filename: `size-plugin-${env.ssr?'ssr':'browser'}.json`
		});
	}
	if (!env.ssr) {
		// Find YAML FrontMatter preceeding a markdown document
		const FRONT_MATTER_REG = /^\s*---\n\s*([\s\S]*?)\s*\n---\n/i;

		// Find a leading title in a markdown document
		const TITLE_REG = /^\s*#\s+(.+)\n+/;

		// Converts YAML FrontMatter to JSON FrontMatter for easy client-side parsing.
		config.plugins.push(new CopyPlugin([{
			context: __dirname,
			from: 'content',
			to: 'content',
			transform(content, path) {
				if (typeof content !== 'string') {
					content = content.toString('utf8');
				}

				const matches = content.match(FRONT_MATTER_REG);
				if (!matches) return content;

				const meta = yaml.parse('---\n'+matches[1].replace(/^/gm,'  ')+'\n') || {};
				content = content.replace(FRONT_MATTER_REG, '');
				if (!meta.title) {
					let [,title] = content.match(TITLE_REG) || [];
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
		}]));

		netlifyPlugin(config, {
			redirects: fs.readFileSync('src/_redirects', 'utf-8').trim().split('\n')
		});
	}
}
