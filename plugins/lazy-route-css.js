import path from 'node:path';
import { normalizePath } from 'vite';

/**
 * Pages rendered by a lazy (code-split) component, like the home route or a
 * Markdown widget, only get that component's CSS once its JS chunk loads, so
 * the prerendered HTML would flash unstyled (or stay unstyled without JS).
 * This links the CSS of those chunks from the prerendered pages. Vite's
 * preload helper skips stylesheets that are already in the document, so
 * nothing is loaded twice once the chunk is imported.
 *
 * Must run after the prerender plugin (`enforce: 'post'`, listed after it).
 *
 * @param {Array<[page: string | RegExp, module: string]>} routes
 *   Prerendered HTML file (or a pattern matching several) → the lazy module
 *   it renders, relative to the project root
 * @returns {import('vite').Plugin}
 */
export function lazyRouteCssPlugin(routes) {
	/** @type {string} */
	let root;
	/** @type {string} */
	let base;

	return {
		name: 'lazy-route-css',
		apply: 'build',
		enforce: 'post',
		configResolved(config) {
			root = config.root;
			base = config.base;
		},
		generateBundle(_opts, bundle) {
			const chunks = Object.values(bundle).filter(
				/** @returns {output is import('rollup').OutputChunk} */
				(output) => output.type === 'chunk'
			);
			const pages = Object.values(bundle).filter(
				/** @returns {output is import('rollup').OutputAsset} */
				(output) => output.type === 'asset' && output.fileName.endsWith('.html')
			);

			for (const [page, modulePath] of routes) {
				// Vite's module ids use forward slashes, also on Windows
				const id = normalizePath(path.resolve(root, modulePath));
				const chunk = chunks.find((c) => c.facadeModuleId === id);
				if (!chunk) this.error(`lazy-route-css: no chunk for ${modulePath}`);

				// The chunk's own CSS plus that of its static imports
				/** @type {Set<string>} */
				const css = new Set();
				const seen = new Set();
				const visit = (/** @type {import('rollup').OutputChunk} */ c) => {
					if (seen.has(c.fileName)) return;
					seen.add(c.fileName);
					for (const file of c.viteMetadata?.importedCss || []) css.add(file);
					for (const dep of c.imports) {
						const depChunk = bundle[dep];
						if (depChunk?.type === 'chunk') visit(depChunk);
					}
				};
				visit(chunk);

				const matches = pages.filter((html) =>
					typeof page === 'string'
						? html.fileName === page
						: page.test(html.fileName)
				);
				if (!matches.length) {
					this.error(`lazy-route-css: no prerendered page matches ${page}`);
				}

				for (const html of matches) {
					const source = String(html.source);
					const links = [...css]
						// Skip what the page already links (the entry's CSS)
						.filter((file) => !source.includes(`href="${base}${file}"`))
						.map(
							(file) =>
								`<link rel="stylesheet" crossorigin href="${base}${file}">`
						);
					if (!links.length) continue;
					html.source = source.replace(
						'</head>',
						`${links.join('\n')}\n</head>`
					);
				}
			}
		}
	};
}
