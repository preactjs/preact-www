import yaml from 'yaml';

/**
 * Parse Markdown with YAML FrontMatter
 * @param {string} content - Raw markdown content with frontmatter
 * @param {string} path - File path for error reporting
 * @returns {{title: string, description: string, body: string, meta: object}}
 */
export function parseFrontmatter(content, path = '') {
	const FRONT_MATTER_REG = /^\s*---\n\s*([\s\S]*?)\s*\n---\n/i;

	const matches = content.match(FRONT_MATTER_REG);
	if (!matches) {
		throw new Error(`Missing YAML FrontMatter in ${path}`);
	}

	let meta = {};
	try {
		meta = yaml.parse('---\n' + matches[1].replace(/^/gm, '  ') + '\n');

		if (!meta.title) {
			throw new Error(`Missing title in YAML FrontMatter for ${path}`);
		}
	} catch (e) {
		e.message = `Error parsing YAML FrontMatter in ${path}:\n\n ${e.message}`;
		throw e;
	}

	const body = content.replace(FRONT_MATTER_REG, '').trim();

	return {
		title: meta.title || '',
		description: meta.description || '',
		body,
		meta
	};
}

/**
 * Process and clean code blocks for LLM consumption
 * Removes --repl comments and markers that are used for REPL functionality
 * @param {string} content - Markdown content
 * @returns {string} - Cleaned content
 */
export function cleanReplComments(content) {
	return content
		.replace(/^\/\/ --repl\n/gm, '')
		.replace(/(?<!^```\w*\n)^\/\/ --repl-(?:before|after)\n(?!```)/gm, '\n')
		.replace(/^\/\/ --repl-(?:before|after)\n/gm, '')
		.replace(/\n\n\n+/g, '\n\n')
		.trim();
}

/**
 * Convert a content file into plain Markdown, without FrontMatter or site-only markup
 * @param {string} content - Raw markdown content with frontmatter
 * @param {string} path - File path for error reporting
 * @returns {string}
 */
export function toPlainMarkdown(content, path) {
	const { title, body, meta } = parseFrontmatter(content, path);
	let markdown = cleanReplComments(
		body.replace(/<toc><\/toc>/g, '').replace(/---\s*\n\s*\n\s*---/g, '---')
	);

	if (!markdown.startsWith('# ')) markdown = `# ${title}\n\n${markdown}`;

	const byline = [meta.authors?.join(', '), meta.date]
		.filter(Boolean)
		.join(' · ');
	if (byline) markdown = markdown.replace(/^# .*\n/, `$&\n_${byline}_\n`);

	return markdown + '\n';
}
