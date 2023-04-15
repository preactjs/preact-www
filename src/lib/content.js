import MarkedWorker from 'workerize-loader?name=markdown.[chunkhash:5]!./marked.worker';

// Find YAML FrontMatter preceeding a markdown document
const FRONT_MATTER_REG = /^\s*---\n\s*([\s\S]*?)\s*\n---\n/i;

const MARKDOWN_TITLE = /(?:^|\n\n)\s*(#{1,6})\s+(.+)\n+/g;

// Store URL-keyed cached Promise return values from getContent in production.
const CACHE = {};

/**
 * Fetch and parse a markdown document with optional JSON FrontMatter.
 * @returns {{ content: string, meta: {toc:{text:string, id:string, level:number}[], title: string} }}
 */
export function getContent([lang, name]) {
	let path = `/content/${lang}`,
		url = `${path}/${name.replace(/^\//, '')}`,
		ext = (url.match(/\.([a-z]+)$/i) || [])[1];
	if (!ext) url += '.md';

	// In prod, never re-fetch the content (url is just a convenient compound cache key)
	if (process.env.NODE_ENV === 'production' && url in CACHE) {
		return CACHE[url];
	}

	let fallback = false;
	const res = fetch(url)
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
			data.fallback = fallback;
			return data;
		});
	return (CACHE[url] = res);
}

/**
 * Synchronous version for use during prerendering.
 * Note: noop on the client to avoid pulling in libs.
 */
export const getContentOnServer = PRERENDER
	? (route, lang) => {
			if (route == '/') route = '/index';

			const fs = __non_webpack_require__('fs');
			let sourceData = fs.readFileSync(`content/${lang}/${route}.md`, 'utf8');

			// convert frontmatter from yaml to json:
			const yaml = __non_webpack_require__('yaml');
			sourceData = sourceData.replace(FRONT_MATTER_REG, (s, y) => {
				const meta = yaml.parse('---\n' + y.replace(/^/gm, '  ') + '\n') || {};
				return '---\n' + JSON.stringify(meta) + '\n---\n';
			});

			const data = parseContent(sourceData, 'md');

			const marked = __non_webpack_require__('marked');
			data.html = marked(data.content);

			return data;
	  }
	: (route, lang) => {};

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
			content = content.replace(TITLE_REG, '');
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

const markedWorker = !PRERENDER && new MarkedWorker();
function parseMarkdownContent(data) {
	return markedWorker.convert(data.content).then(html => {
		data.html = html;
		return data;
	});
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
