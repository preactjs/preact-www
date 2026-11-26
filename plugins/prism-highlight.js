import fs from 'node:fs/promises';
import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';

const QUERY = /\?prism=([\w-]+)$/;

/**
 * Highlights a source file with Prism at build time, so Prism stays out of
 * the client bundle: `import html from './example.txt?prism=jsx'` gives the
 * highlighted HTML as a string.
 *
 * @returns {import('vite').Plugin}
 */
export function prismHighlightPlugin() {
	return {
		name: 'prism-highlight',
		enforce: 'pre',
		async load(id) {
			const match = id.match(QUERY);
			if (!match) return;
			const file = id.slice(0, match.index);
			const lang = match[1];
			if (!Prism.languages[lang]) loadLanguages([lang]);
			if (!Prism.languages[lang]) {
				this.error(`No Prism grammar for language: ${lang}`);
			}
			this.addWatchFile(file);
			const code = (await fs.readFile(file, 'utf-8')).replace(/\n$/, '');
			const html = Prism.highlight(code, Prism.languages[lang], lang);
			return `export default ${JSON.stringify(html)};`;
		}
	};
}
