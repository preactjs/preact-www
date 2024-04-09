import yaml from 'yaml';
import marked from 'marked';
import { replace } from './gh-emoji/index.js';

/**
 * @param {string} content
 * @param {string} path
 * @returns {string}
 */
export function precompileMarkdown(content, path) {
	const parsed = parseContent(content, path);
	const emojified = applyEmojiToContent(parsed);

	const result = markdownToHTML(emojified);
	// client only needs `.html` and `.meta` fields
	delete result.content;

	return JSON.stringify(result);
}

/**
 * Parse Markdown with YAML FrontMatter into a data structure that can be reasoned about:
 * {
 *   content: "<html here>",
 *   meta: { toc: [], title: "" }
 * }
 */
export function parseContent(content, path) {
	// Find YAML FrontMatter preceeding a markdown document
	const FRONT_MATTER_REG = /^\s*---\n\s*([\s\S]*?)\s*\n---\n/i;

	// Find a leading title in a markdown document
	const TITLE_REG = /^\s*#\s+(.+)\n+/;

	const matches = content.match(FRONT_MATTER_REG);
	let meta = {};
	if (matches) {
		try {
			meta = yaml.parse('---\n' + matches[1].replace(/^/gm, '  ') + '\n');
		} catch (e) {
			throw new Error(`Error parsing YAML FrontMatter in ${path}`);
		}
		content = content.replace(FRONT_MATTER_REG, '');
		if (!meta.title) {
			let [, title] = content.match(TITLE_REG) || [];
			if (title) {
				meta.title = sanitizeTitle(title);
			}
		}
	}

	// generate ToC from markdown
	meta.toc = generateToc(content);

	return {
		content,
		meta
	};
}

function markdownToHTML(data) {
	data.html = marked(data.content);
	return data;
}

export function applyEmojiToContent(data) {
	data.content = applyEmoji(data.content);
	return data;
}
/**
 * @param {string} content
 * @returns {string}
 */
function applyEmoji(content) {
	if (!content.match(/([^\\]):[a-z0-9_]+:/gi)) {
		return content;
	}

	return replace(content);
}

/* generate ToC from markdown */
function generateToc(markdown) {
	const MARKDOWN_TITLE = /(?:^|\n\n)\s*(#{1,6})\s+(.+)\n+/g;

	const toc = [];
	let token;
	MARKDOWN_TITLE.lastIndex = 0;
	while ((token = MARKDOWN_TITLE.exec(markdown))) {
		const level = token[1].length;
		const text = sanitizeTitle(token[2]);
		// Note: character range in regex is roughly "word characters including accented" (eg: bublé)
		const id = text
			.toLowerCase()
			.replace(/[\s-!<>`",]+/g, '-')
			.replace(/^-|-$|[/&.()[\]']/g, '');
		toc.push({ text, id, level });
	}
	return toc;
}

/*
 * Many markdown formatters can generate the table of contents
 * automatically. To skip a specific heading the use an html
 * comment at the end of it. Example:
 *
 *   ## Some random title <!-- omit in toc -->
 */
function sanitizeTitle(text) {
	return text.replace(/\s*<!--.*-->\s*/, '');
}
