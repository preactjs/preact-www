import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

import { precompileMarkdown } from './plugins/precompile-markdown/index.js';
import { netlifyPlugin } from './plugins/netlify.js';
import { spaFallbackMiddlewarePlugin } from './plugins/spa-fallback-middleware.js';
import { htmlRoutingMiddlewarePlugin } from './plugins/html-routing-middleware.js';
import { rssFeedPlugin } from './plugins/rss-feed.js';
import generateLlmsTxtPlugin from './plugins/generate-llms-txt.js';

// TODO: Should we do this for all routes, rely on discovery a bit less?
import { tutorialRoutes } from './src/lib/route-utils.js';

export default defineConfig({
	publicDir: 'src/assets',
	optimizeDeps: {
		include: ['@babel/polyfill', '@rollup/browser', 'sucrase']
	},
	build: {
		target: ['chrome88', 'edge88', 'es2020', 'firefox78', 'safari14'],
		outDir: 'build',
		rollupOptions: {
			output: {
				chunkFileNames: chunkInfo => {
					if (chunkInfo.moduleIds.find(id => id.includes('@xmldom/xmldom')))
						return 'assets/xmldom-[hash].js';
					if (chunkInfo.facadeModuleId?.includes('@docsearch/react'))
						return 'assets/docsearch-[hash].js';
					return 'assets/[name]-[hash].js';
				}
			}
		}
	},
	define: {
		'process.env.BRANCH': JSON.stringify(process.env.BRANCH)
	},
	plugins: [
		preact({
			prerender: {
				enabled: true,
				renderTarget: '#app',
				// The routes that will not be discovered automatically
				additionalPrerenderRoutes: [
					'/404',
					'/guide/v8/getting-started',
					'/guide/v11/getting-started',
					'/branding',
					...Object.keys(tutorialRoutes)
				]
			}
		}),
		viteStaticCopy({
			hook: 'generateBundle',
			targets: [
				{
					src: './content/**/*.md',
					dest: './',
					rename: (_name, _fileExtension, fullPath) =>
						path.basename(fullPath).replace(/\.md$/, '.json'),
					transform: precompileMarkdown
				}
			],
			structured: true,
			watch: {
				reloadPageOnChange: true
			}
		}),
		viteStaticCopy({
			// Safari will always request both `apple-touch-icon.png` and
			// `apple-touch-icon-precomposed.png` regardless of any set path via `<link>`
			// tags. The latter serves no purpose since iOS 7.0, but as Safari still
			// requests it, we may as well provide it to get this out of our 404 stats.
			targets: [
				{
					src: './src/assets/app-icon.png',
					dest: './',
					rename: 'apple-touch-icon.png'
				},
				{
					src: './src/assets/app-icon.png',
					dest: './',
					rename: 'apple-touch-icon-precomposed.png'
				}
			]
		}),
		netlifyPlugin(),
		spaFallbackMiddlewarePlugin(),
		htmlRoutingMiddlewarePlugin(),
		rssFeedPlugin(),
		generateLlmsTxtPlugin()
	]
});
