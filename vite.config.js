import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import replace from '@rollup/plugin-replace';

import yaml from 'yaml';

// Find YAML FrontMatter preceeding a markdown document
const FRONT_MATTER_REG = /^\s*---\n\s*([\s\S]*?)\s*\n---\n/i;

// Find a leading title in a markdown document
const TITLE_REG = /^\s*#\s+(.+)\n+/;

export default defineConfig({
	publicDir: 'src/assets',
	plugins: [
		replace({
			PRERENDER: JSON.stringify(false),
			preventAssignment: true
		}),
		preact({
			//prerender: {
			//	enabled: true,
			//	renderTarget: '#app',
			//	additionalPrerenderRoutes: ['/404']
			//}
			devToolsEnabled: false
		}),
		viteStaticCopy({
			targets: [
				{
					src: './content/**/*.md',
					dest: './',
					transform: (content, path) => {
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
								meta.title = title;
							}
						}

						content = '---\n' + JSON.stringify(meta) + '\n---\n' + content;
						return content;
					}
				}
			],
			structured: true,
			watch: {
				reloadPageOnChange: true
			}
		}),
		viteStaticCopy({
			targets: [
				{ src: 'src/robots.txt', dest: './' },
				{ src: 'src/_headers', dest: './' }
			]
		})
	]
});