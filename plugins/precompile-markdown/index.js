import { marked } from 'marked';
import dedent from 'dedent';
import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';
import { parse } from 'node-html-parser';
import { replace } from './gh-emoji/index.js';
import { textToBase64 } from '../../src/components/controllers/repl/query-encode.js';
import { parseFrontmatter } from '../../src/lib/frontmatter.js';
import { createHeadingIdGenerator } from '../../src/lib/generate-heading-id.js';

// Prism will always load `markup`, `css`, `clike` and `javascript` by default.
// Any additional languages we need should be loaded here
loadLanguages(['typescript', 'tsx', 'json', 'bash', 'diff']);

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
 *
 * @param {string} content
 * @param {string} path
 */
function parseContent(content, path) {
	const { body, meta } = parseFrontmatter(content, path);

	let processedContent = body;

	// Filled in from the parsed markdown, see `markdownToHTML`
	const withToc = path.includes('/guide/');

	// extract tutorial setup, initial and final code blocks
	if (/tutorial\/\d/.test(path)) {
		const { markdown, tutorial } = extractTutorialCodeBlocks(processedContent);
		processedContent = markdown;
		meta.tutorial = tutorial;
	}

	return {
		content: processedContent,
		meta,
		withToc
	};
}

// Heading ids for the document `marked` is currently rendering. Reset before
// each (synchronous) render so repeated headings are numbered per document.
let headingId = createHeadingIdGenerator();

const CUSTOM_BLOCKS = [
	'<toc></toc>',
	'<branding></branding>',
	'<blog-overview></blog-overview>',
	'<translation-score-table></translation-score-table>'
];

marked.use({
	renderer: {
		heading({ text, depth }) {
			// Stray empty headings (e.g. a lone `##`) would only render a bare
			// link; skipped without an id, exactly like in `generateToc()`
			if (!text.trim()) return '';

			// Called for page titles too, so duplicate numbering matches the ToC
			const id = headingId(text);

			// No need to add links for page titles
			if (depth === 1) return `<h${depth}>${text}</h${depth}>`;

			return `
				<h${depth} id="${id}">
					<a class="fragment-link" href="#${id}">
						<svg width="16" height="16" viewBox="0 0 24 24" aria-label="Link to: ${text} (#${id})">
							<use href="#link" />
						</svg>
					</a>
					<span>${text}</span>
				</h${depth}>`;
		},
		paragraph({ text }) {
			if (CUSTOM_BLOCKS.includes(text)) {
				// The CommonMark spec states that _HTML Blocks_ must start with specific & known
				// tags, which our custom components are not. As such, `marked` treats them as
				// _Raw HTML_ which results in them being wrapped in a `<p>` tag.
				// https://spec.commonmark.org/0.29/#html-blocks
				return text;
			}

			return false;
		},
		link({ href, tokens }) {
			// Render the inline tokens so `code` in link text becomes <code>
			// instead of showing raw backticks
			const text = this.parser.parseInline(tokens);
			if (href.includes('://')) {
				return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
			}

			return `<a href="${href}">${text}</a>`;
		},
		image({ href, text }) {
			return `<img loading="lazy" decoding="async" src="${href}" alt="${text}" />`;
		},
		code({ text, lang }) {
			const [code, source, runInRepl] = processRepl(text.trim());

			if (Prism.languages[lang] == null) {
				throw new Error(
					`No Prism highlighter for language: ${lang}\n\ncode:\n${code}\n`
				);
			}

			const transformedCode = code.replaceAll(
				/\n>?\s*?<!-- prettier-ignore-(start|end) -->$/gm,
				''
			);

			if (/prettier-ignore-(start|end)/.test(transformedCode)) {
				throw new Error(
					`Mishandled Prettier ignore comment in code block:\n${code}\n`
				);
			}

			text = Prism.highlight(transformedCode, Prism.languages[lang], lang);

			const runInReplLink = runInRepl
				? `<a class="repl-link" href="/repl?code=${encodeURIComponent(
						textToBase64(source)
					)}">Run in REPL</a>`
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
 * @param {{ content: string, html: string, meta: Record<string, any>, withToc?: boolean }} data
 * @returns {Promise<{ html: string, content: string }>}
 */
async function markdownToHTML(data) {
	const tokens = marked.lexer(data.content);
	// The ToC comes from the very heading tokens that get rendered, so its
	// entries & ids always match the page's headings
	if (data.withToc) data.meta.toc = generateToc(tokens);
	delete data.withToc;

	headingId = createHeadingIdGenerator();
	data.html = marked.parser(tokens);
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

/**
 * Generate the ToC from parsed markdown, in the same (document) order and
 * with the same ids as the heading renderer
 *
 * @param {import('marked').TokensList} tokens
 */
function generateToc(tokens) {
	/** @type {{ text: string, id: string, level: number }[]} */
	const toc = [];
	const headingId = createHeadingIdGenerator();
	marked.walkTokens(tokens, (token) => {
		// Empty headings (e.g. a stray `##`) aren't rendered, see `heading()`
		if (token.type !== 'heading' || !token.text.trim()) return;
		// Page titles get an id too, so numbering matches the renderer, but no
		// ToC entry: they're rendered without one
		const id = headingId(token.text);
		if (token.depth > 1) {
			toc.push({ text: token.text, id, level: token.depth });
		}
	});
	return toc;
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
	const codeBlocks = doc.querySelectorAll(
		'pre:not([class="highlight"]):has(> code[class])'
	);
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
		const rawCodeBlockText = unescapeHTML(
			dedent(child.innerText).trim().replaceAll('<br>', '\n')
		);
		const [code, source, runInRepl] = processRepl(rawCodeBlockText);

		const lang = child.getAttribute('class').replace('language-', '');

		if (Prism.languages[lang] == null) {
			throw new Error(
				`No Prism highlighter for language: ${lang}\n\ncode:\n${code}\n`
			);
		}

		child.innerHTML = Prism.highlight(code, Prism.languages[lang], lang);

		block.insertAdjacentHTML(
			'beforebegin',
			'<div class="highlight-container">'
		);
		const container = block.previousSibling;
		container.appendChild(block);
		block.setAttribute('class', 'highlight');

		if (runInRepl) {
			block.insertAdjacentHTML(
				'afterend',
				`<a class="repl-link" href="/repl?code=${encodeURIComponent(
					textToBase64(source)
				)}">
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
