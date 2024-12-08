import yaml from 'yaml';
import marked from 'marked';
import { parse } from 'node-html-parser';
import { replace } from './gh-emoji/index.js';
import { Prism } from './prism.js';
import { textToBase64 } from '../../src/components/controllers/repl/query-encode.js';

/**
 * @param {string} content
 * @param {string} path
 * @returns {string}
 */
export function precompileMarkdown(content, path) {
	const parsed = parseContent(content, path);
	const emojified = applyEmojiToContent(parsed);
	const htmlified = markdownToHTML(emojified);
	const result = highlightCodeBlocks(htmlified);

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

/**
 * @param {{ content: string }} data
 * @returns {{ html: string, content: string }}
 */
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

/**
 * @param {{ html: string, content: string }} data
 * @returns {{ html: string, content: string }}
 */
function highlightCodeBlocks(data) {
	const doc = parse(data.html, { blockTextElements: { code: true } });

	const codeBlocks = doc.querySelectorAll('pre:has(> code[class])');
	for (const block of codeBlocks) {
		const child = block.childNodes[0];

		/**
		 * Slight hack to facilitate blank lines in code blocks in HTML in markdown, i.e.,
		 *
		 * <pre repl="false"><code class="language-jsx">
		 *   import TodoList from './todo-list';<br>
		 *   render(&lt;TodoList /&gt;, document.body);
		 * </code></pre>
		 *
		 * Blank lines are an end condition to the code block so instead we must use `<br>`
		 * and switch it back to `\n` for the code content after marked is through with it.
		 * We only do this on the home/index page at the moment.
		 */
		const rawCodeBlockText = unescapeHTML(child.innerText.trim().replace('<br>', '\n'));
		const [code, source, runInRepl] = processRepl(rawCodeBlockText);

		const lang = child.getAttribute('class').replace('language-', '');

		Prism.languages[lang] == null
			? console.warn(`No Prism highlighter for language: ${lang}`)
			: child.innerHTML = Prism.highlight(code, Prism.languages[lang], lang);

		// TODO: These next lines should be moved to marked but we'd need to bump it to do so.
		block.insertAdjacentHTML('beforebegin', '<div class="highlight-container">');
		const container = block.previousSibling;
		container.appendChild(block);
		block.setAttribute('class', 'highlight');

		if (runInRepl) {
			block.insertAdjacentHTML(
				'afterend',
				`<a class="repl-link" href="/repl?code=${encodeURIComponent(textToBase64(source))}">
					Run in REPL
				</a>`
			);
		}
	}

	data.html = doc.toString();
	return data;
}


/**
 * Marked escapes HTML entities, which is normally great,
 * but we want to feed the raw code into Prism for highlighting.
 *
 * @param {string} str
 * @returns {string}
 */
function unescapeHTML(str) {
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

/**
 * @param {string} code
 * @returns {[string, string, boolean]}
 */
function processRepl(code) {
	let source = code,
		runInRepl = false;
	if (code.startsWith('// --repl')) {
		runInRepl = true;
		const idx = code.indexOf('\n');
		if (idx > -1) {
			code = code.slice(idx + 1);
			source = source.slice(idx + 1);
		}

		const beforeMarker = '// --repl-before';
		const beforeIdx = code.indexOf(beforeMarker);
		if (beforeIdx > -1) {
			const pos = beforeIdx + beforeMarker.length + 1;
			code = code.slice(pos);
			// Only replace comment line with newline in source
			source = source.slice(0, beforeIdx) + '\n' + source.slice(pos);
		}

		const afterMarker = '// --repl-after';
		const afterIdx = code.indexOf(afterMarker);
		if (afterIdx > -1) {
			code = code.slice(0, afterIdx);

			// Only replace comment line with newline in source
			// ATTENTION: We cannot reuse the index from `code`
			// as the content and thereby offsets are different
			const sourceAfterIdx = source.indexOf(afterMarker);
			source =
				source.slice(0, sourceAfterIdx) +
				'\n' +
				source.slice(sourceAfterIdx + afterMarker.length + 1) +
				'\n';
		}
	}

	return [code, source, runInRepl];
}
