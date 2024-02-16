import { wrap } from 'comlink';

// Find YAML FrontMatter preceeding a markdown document
const FRONT_MATTER_REG = /^\s*---\n\s*([\s\S]*?)\s*\n---\n/i;

const MARKDOWN_TITLE = /(?:^|\n\n)\s*(#{1,6})\s+(.+)\n+/g;

let markedWorker;

/**
 * Fetch and parse a markdown document with optional JSON FrontMatter.
 * @returns {Promise<{ content: string, meta: {toc:{text:string, id:string, level:number}[], title: string}, html: string }>}
 */
export async function getContent([lang, name]) {
	let path = `/content/${lang}`,
		url = `${path}/${name.replace(/^\//, '')}`,
		ext = (url.match(/\.([a-z]+)$/i) || [])[1];
	if (!ext) url = url.endsWith('/') ? url.replace(/\/$/, '.md') : url + '.md';

	let fallback = false;
	return await fetch(url)
		.then(r => {
			// fall back to english
			if (!r.ok && lang != 'en') {
				fallback = true;
				return fetch(url.replace(/content\/[^/]+\//, 'content/en/'));
			}
			return r;
		})
		.then(r => {
			if (r.ok) return r;
			ext = 'md';
			return fetch(`${path}/${r.status}.md`);
		})
		.then(r => r.text())
		.then(parseContent)
		.then(applyEmojiToContent)
		.then(parseMarkdownContent)
		.then(data => {
			data.meta.isFallback = fallback;
			return data;
		});
}

/**
 * Parse Markdown with "JSON FrontMatter" (think YAML FrontMatter, with less YAML)
 * into a data structure that can be reasoned about:
 * {
 *   content: "<html here>",
 *   meta: { toc: [], title: "" }
 * }
 */
export function parseContent(text) {
	let [, frontMatter] = text.match(FRONT_MATTER_REG) || [],
		meta = (frontMatter && JSON.parse(frontMatter)) || {},
		content = text.replace(FRONT_MATTER_REG, '');

	// hoist (+extract) first h1 to page title
	const TITLE_REG = /^\s*#\s+(.+)\n+/;
	if (!meta.title) {
		let [, title] = content.match(TITLE_REG) || [];
		if (title) {
			meta.title = title;
		}
	}

	// generate ToC from markdown
	meta.toc = generateToc(content);

	if (meta.title) meta.title = sanitizeTitle(meta.title);

	return {
		content,
		meta
	};
}

async function parseMarkdownContent(data) {
	// lazy init to ensure `globalThis.markedWorker` is available w/ prerendering
	if (!markedWorker) {
		markedWorker =
			typeof window === 'undefined'
				? globalThis.markedWorker
				: wrap(
						new Worker(new URL('./marked.worker.js', import.meta.url), {
							type: 'module'
						})
				  );
	}

	const res = markedWorker.convert(data.content);
	if (res.then)
		return res.then(html => {
			data.html = html;
			return data;
		});
	data.html = res;
	return data;
}

let processEmojis, pendingEmojiProcessor;

function applyEmojiToContent(data) {
	return applyEmoji(data.content).then(content => {
		data.content = content;
		return data;
	});
}
/**
 * @param {string} content
 * @returns {Promise<string>}
 */
function applyEmoji(content) {
	if (!content.match(/([^\\]):[a-z0-9_]+:/gi)) {
		return Promise.resolve(content);
	}

	if (processEmojis) {
		return Promise.resolve(processEmojis(content));
	}

	if (!pendingEmojiProcessor) {
		pendingEmojiProcessor = import(
			/* webpackChunkName: "emoji" */ './gh-emoji'
		).then(({ replace }) => (processEmojis = replace || String));
	}
	return pendingEmojiProcessor.then(processEmojis => processEmojis(content));
}

/* generate ToC from markdown */
function generateToc(markdown) {
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
