import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { getContentPath, getMarkdownPath } from '../src/lib/content.js';
import { toPlainMarkdown } from '../src/lib/frontmatter.js';
import { allRoutes } from '../src/route-config.js';

const contentDir = fileURLToPath(new URL('../content/en', import.meta.url));

/**
 * Emits a plain Markdown copy of each content page next to its HTML, e.g. `/guide/v11/hooks.md`
 * @returns {import('vite').Plugin}
 */
export function markdownPagesPlugin() {
	return {
		name: 'markdown-pages',
		apply: 'build',
		async generateBundle() {
			for (const route of allRoutes) {
				const markdownPath = getMarkdownPath(route);
				if (!markdownPath) continue;

				const file = `${contentDir}${getContentPath(route)}.md`;
				this.emitFile({
					type: 'asset',
					fileName: markdownPath.slice(1),
					source: toPlainMarkdown(await fs.readFile(file, 'utf-8'), file)
				});
			}
		}
	};
}
