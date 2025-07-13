import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseFrontmatter, cleanReplComments } from '../src/lib/frontmatter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Read all markdown files from the guide directory
 * @param {string} guideDir
 * @returns {Promise<Array<{filename: string, content: string}>>}
 */
async function readMarkdownFiles(guideDir) {
	const files = await fs.readdir(guideDir);
	const markdownFiles = files.filter(file => file.endsWith('.md'));

	return Promise.all(
		markdownFiles.map(async filename => {
			const filePath = path.join(guideDir, filename);
			const content = await fs.readFile(filePath, 'utf-8');
			return { filename, content };
		})
	);
}

/**
 * Generate the llms.txt content
 * @param {Array<{filename: string, content: string}>} files
 * @returns {string}
 */
function generateLlmsTxt(files) {
	const header = `# Preact Documentation

This file contains comprehensive documentation for Preact v10, a fast 3kB alternative to React with the same modern API.
Preact is a fast, lightweight alternative to React that provides the same modern API in a much smaller package. This documentation covers all aspects of Preact v10, including components, hooks, server-side rendering, TypeScript support, and more.

---

`;

	let content = header;

	files.sort((a, b) => a.filename.localeCompare(b.filename));

	files.forEach(({ filename, content: fileContent }) => {
		const { description, body } = parseFrontmatter(fileContent, filename);
		let cleanedBody = cleanReplComments(body);

		// Remove <toc></toc> tags
		cleanedBody = cleanedBody.replace(/<toc><\/toc>/g, '');

		// Clean up multiple consecutive newlines and empty lines around separators
		cleanedBody = cleanedBody.replace(/\n{3,}/g, '\n\n');
		cleanedBody = cleanedBody.replace(/---\s*\n\s*\n\s*---/g, '');

		// Fix heading hierarchy: convert # to ## for consistency
		cleanedBody = cleanedBody.replace(/^# /gm, '## ');

		if (description) {
			content += `**Description:** ${description}\n\n`;
		}

		content += `${cleanedBody}\n\n`;
		content += `------\n\n`;
	});

	return content;
}

/**
 * Vite plugin to generate llms.txt from Preact documentation
 * @param {Object} options
 * @param {string} [options.guideDir] - Path to the guide directory
 * @param {string} [options.outputFile] - Path to the output file
 * @returns {import('vite').Plugin}
 */
export default function generateLlmsTxtPlugin(options = {}) {
	const guideDir =
		options.guideDir ||
		path.join(__dirname, '..', 'content', 'en', 'guide', 'v10');

	return {
		name: 'generate-llms-txt',
		async buildStart() {
			try {
				if (!fsSync.existsSync(guideDir)) {
					this.warn(`Guide directory not found: ${guideDir}`);
					return;
				}

				const files = await readMarkdownFiles(guideDir);
				const llmsTxtContent = generateLlmsTxt(files);

				this.emitFile({
					type: 'asset',
					fileName: 'llms.txt',
					source: llmsTxtContent
				});
			} catch (error) {
				this.error(`Error generating llms.txt: ${error.message}`);
			}
		}
	};
}
