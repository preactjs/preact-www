import { defineConfig } from 'vite';
import { pracht } from '@pracht/vite-plugin';
import { netlifyAdapter } from '@pracht/adapter-netlify';
import {
	CONTENT_BUILD_MANIFEST_FILE,
	prachtContent
} from '@pracht/content/vite';

import { docs } from './content.js';
import generateLlmsTxtPlugin from './plugins/generate-llms-txt.js';
import { rssFeedPlugin } from './plugins/rss-feed.js';

export default defineConfig(({ isSsrBuild }) => ({
	publicDir: 'src/assets',
	optimizeDeps: {
		include: ['@babel/polyfill', '@rollup/browser', 'sucrase']
	},
	build: {
		// Only the client build is served to browsers; copying the public
		// directory into the server bundle as well just doubles the output.
		copyPublicDir: !isSsrBuild,
		target: ['chrome88', 'edge88', 'es2020', 'firefox78', 'safari14'],
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
		prachtContent({ collections: [docs] }),
		pracht({
			appFile: '/src/routes.js',
			adapter: netlifyAdapter({
				// 12 MB of prebuilt translation JSON. Pure CDN — never worth a
				// function invocation, and excluded from the function bundle.
				excludedPath: [
					'/content/*',
					// Extensionless, so the function would serve it as
					// application/octet-stream; Chrome ignores it unless the type is
					// application/trafficadvice+json, which netlify.toml sets on the
					// static layer.
					'/.well-known/traffic-advice'
				]
			}),
			// Preserve the site's existing, v10-focused llms.txt generator.
			llmsTxt: false
		}),
		rssFeedPlugin(),
		generateLlmsTxtPlugin(),
		omitInternalContentManifest()
	]
}));

/** CLI 1.11 predates the build-time content manifest consumer. */
function omitInternalContentManifest() {
	return {
		name: 'preact-www:omit-content-manifest',
		generateBundle: {
			order: 'post',
			handler(_options, bundle) {
				delete bundle[CONTENT_BUILD_MANIFEST_FILE];
			}
		}
	};
}
