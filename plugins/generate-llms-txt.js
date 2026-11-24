import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter, toPlainMarkdown } from '../src/lib/frontmatter.js';
import { getMarkdownPath } from '../src/lib/content.js';
import { docPages } from '../src/route-config.js';
import englishTranslations from '../src/locales/en.json' with { type: 'json' };

const origin = 'https://preactjs.com';
const guideDir = fileURLToPath(
	new URL('../content/en/guide/v11', import.meta.url)
);
const summary =
	'Preact is a fast 3kB alternative to React with the same modern API. This documentation covers Preact v11.';

/**
 * @typedef {{ title: string, description: string, url: string, body: string }} Page
 * @typedef {{ name: string, pages: Page[] }} Section
 */

/**
 * @returns {Promise<Section[]>}
 */
async function readSections() {
	const sections = [];
	for (const section in docPages.v11) {
		const pages = [];
		for (const route in docPages.v11[section]) {
			const file = `${guideDir}${route}.md`;
			const content = await fs.readFile(file, 'utf-8');
			const { title, description } = parseFrontmatter(content, file);
			pages.push({
				title,
				description,
				url: `${origin}${getMarkdownPath(`/guide/v11${route}`)}`,
				body: toPlainMarkdown(content, file)
			});
		}
		sections.push({
			name: englishTranslations.sidebarSections[section],
			pages
		});
	}
	return sections;
}

/**
 * @param {Section[]} sections
 * @returns {string}
 */
function generateIndex(sections) {
	let content = `# Preact\n\n> ${summary}\n\nAll pages below in a single file: ${origin}/llms-full.txt\n`;

	for (const { name, pages } of sections) {
		content += `\n## ${name}\n\n`;
		for (const { title, description, url } of pages) {
			content += `- [${title}](${url})${description ? `: ${description}` : ''}\n`;
		}
	}

	return content;
}

/**
 * @param {Section[]} sections
 * @returns {string}
 */
function generateFull(sections) {
	let content = `# Preact Documentation\n\n> ${summary}\n\n---\n\n`;

	for (const { name, pages } of sections) {
		content += `## ${name}\n\n`;

		for (const { description, body } of pages) {
			// Page headings move 2 levels down to sit under the document & section headings.
			// The top-level heading isn't replaced globally as that would also match bash comments.
			const nested = body
				.replace(/^#### /gm, '###### ')
				.replace(/^### /gm, '##### ')
				.replace(/^## /gm, '#### ')
				.replace(/^# /m, '### ');

			if (description) {
				content += `**Description:** ${description}\n\n`;
			}

			content += `${nested}\n------\n\n`;
		}
	}

	return content;
}

/**
 * Emits `llms.txt`, an index of the v11 docs, and `llms-full.txt`, the docs in a single file
 * @returns {import('vite').Plugin}
 */
export default function generateLlmsTxtPlugin() {
	return {
		name: 'generate-llms-txt',
		apply: 'build',
		async buildStart() {
			const sections = await readSections();

			this.emitFile({
				type: 'asset',
				fileName: 'llms.txt',
				source: generateIndex(sections)
			});
			this.emitFile({
				type: 'asset',
				fileName: 'llms-full.txt',
				source: generateFull(sections)
			});
		}
	};
}
