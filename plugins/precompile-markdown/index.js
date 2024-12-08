import yaml from 'yaml';
import { marked } from 'marked';
import { parse } from 'node-html-parser';
import { replace } from './gh-emoji/index.js';
import { Prism } from './prism.js';
import { textToBase64 } from '../../src/components/controllers/repl/query-encode.js';

/**
 * @param {string} content
 * @param {string} path
 * @returns {Promise<string>}
 */
export async function precompileMarkdown(content, path) {
	const parsed = parseContent(content, path);
	const emojified = applyEmojiToContent(parsed);
	const htmlified = await markdownToHTML(emojified);
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
				meta.title = title;
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

marked.use({
	renderer: {
		heading({ text, depth }) {
			// No need to add links for page titles
			if (depth === 1) return `<h${depth}>${text}</h${depth}>`;

			const id = generateHeadingId(text);
			return `
				<h${depth} id="${id}">
					<a class="fragment-link" href="#${id}">
						<svg width="16" height="16" viewBox="0 0 24 24" aria-label="Link to: ${text} (#${id})">
							<use href="/icons.svg#link" />
						</svg>
					</a>
					<span>${text}</span>
				</h${depth}>`;
		},
		link({ href, text }) {
			if (href.includes('://')) {
				return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
			}

			return `<a href="${href}">${text}</a>`;
		},
		image({ href, text }) {
			return `<img decoding="async" src="${href}" alt="${text}" />`;
		},
		code({ text, lang }) {
			const rawCodeBlockText = text.trim().replace('<br>', '\n');
			const [code, source, runInRepl] = processRepl(rawCodeBlockText);

			Prism.languages[lang] == null
				// TODO: Bash is the only missing one at the moment
				? console.warn(`No Prism highlighter for language: ${lang}`)
				: text = Prism.highlight(code, Prism.languages[lang], lang);

			const runInReplLink = runInRepl
				? `<a class="repl-link" href="/repl?code=${encodeURIComponent(textToBase64(source))}">Run in REPL</a>`
				: '';

			return `
				<div class="highlight-container">
					<pre class="highlight"><code class="language-${lang}">${text}</code></pre>
					${runInReplLink}
				</div>
			`;
		}
	}
});

/**
 * @param {{ content: string, html: string }} data
 * @returns {Promise<{ html: string, content: string }>}
 */
async function markdownToHTML(data) {
	data.html = await marked(data.content);
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
		const text = token[2];
		const id = generateHeadingId(text);
		toc.push({ text, id, level });
	}
	return toc;
}

/**
 * @param {string} text
 * @returns {string}
 */
function generateHeadingId(text) {
	// Note: character range in regex is roughly "word characters including accented" (eg: bublé)
	return text
		.toLowerCase()
		.replace(/[\s-!<>`",]+/g, '-')
		.replace(/^-|-$|[/&.()[\]']/g, '');
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
 * This is only for highlighting HTML code blocks in markdown as
 * `marked` will ignore them
 *
 * @param {{ html: string, content: string }} data
 * @returns {{ html: string, content: string }}
 */
function highlightCodeBlocks(data) {
	const doc = parse(data.html, { blockTextElements: { code: true } });

	// Only get the pre blocks that haven't already been highlighted
	const codeBlocks = doc.querySelectorAll('pre:not([class="highlight"]):has(> code[class])');
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
