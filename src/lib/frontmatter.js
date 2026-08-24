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
