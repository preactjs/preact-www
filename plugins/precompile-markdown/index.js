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
function parseContent(content, path) {
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

	// extract tutorial setup, initial and final code blocks
	if (/tutorial\/\d/.test(path)) {
		const { markdown, tutorial } = extractTutorialCodeBlocks(content);
		content = markdown;
		meta.tutorial = tutorial;
	}

	return {
		content,
		meta
	};
}

function markdownToHTML(data) {
	data.html = marked(data.content);
	return data;
}

function applyEmojiToContent(data) {
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

/**
 * Split out tutorial code blocks that will be fed into the REPL
 *
 * @param {string} markdown
 */
function extractTutorialCodeBlocks(markdown) {
	const SETUP_CODE_REG = /```js:setup(.+?)```/s;
	const INTITAL_CODE_REG = /```jsx:repl-initial(.+?)```/s;
	const FINAL_CODE_REG = /```jsx:repl-final(.+?)```/s;

	const tutorial = {};
	[
		['setup', SETUP_CODE_REG],
		['initial', INTITAL_CODE_REG],
		['final', FINAL_CODE_REG]
	].forEach(([key, regex]) => {
		const match = markdown.match(regex);
		if (match) {
			tutorial[key] = match[1].trim();
			markdown = markdown.replace(regex, '');
		}
	});

	return { markdown, tutorial };
}
