import { readdir, readFile } from 'node:fs/promises';

import { defineCollection, llmsTxtArtifacts } from '@pracht/content';

import { compileMarkdown } from './plugins/precompile-markdown/index.js';

const ORIGIN = 'https://preactjs.com';
const CONTENT_ROOT = new URL('./content/', import.meta.url);
const SUPPORTED_LOCALES = Object.keys(
	JSON.parse(
		await readFile(new URL('./src/config.json', import.meta.url), 'utf8')
	).locales
);

export const docs = defineCollection({
	name: 'docs',
	root: CONTENT_ROOT,
	extensions: ['.md'],
	sources: await contentSources(),
	locales: {
		default: 'en',
		supported: SUPPORTED_LOCALES,
		fallback: 'en',
		sourceDirectories: true,
		routePrefix: 'never'
	},
	compile: ({ raw, path }) => compileMarkdown(raw, path),
	artifacts: [
		clientContentArtifacts,
		llmsTxtArtifacts({
			title: 'Preact',
			description:
				'Fast 3kB alternative to React with the same modern API. This is the documentation site for Preact — guides for v8, v10 and v11, an interactive tutorial, the REPL, and the project blog.',
			origin: ORIGIN,
			descriptionField: 'description',
			details: [
				'Every page URL below serves its Markdown source when requested with `Accept: text/markdown`. Append `?lang=<code>` for a translation.',
				'',
				'Structured operations are available without scraping:',
				'',
				`- \`POST ${ORIGIN}/api/capabilities/docs/search\` — search the documentation`,
				`- \`POST ${ORIGIN}/api/capabilities/docs/page\` — read one page as Markdown`,
				`- \`POST ${ORIGIN}/api/capabilities/preact/latestRelease\` — current release version`,
				'',
				`Claude Code skills for working with Preact: ${ORIGIN}/.well-known/agent-skills/index.json`,
				'',
				'## Optional',
				'',
				`- [Full documentation bundle](${ORIGIN}/llms-full.txt): every page below, inlined into one file.`
			],
			sections: [
				section('Guide v8', path => path.startsWith('/guide/v8/')),
				section('Guide v10', path => path.startsWith('/guide/v10/')),
				section('Guide v11', path => path.startsWith('/guide/v11/')),
				section('Tutorial', path => path.startsWith('/tutorial')),
				section('Blog', path => path === '/blog' || path.startsWith('/blog/')),
				section('About', path => path.startsWith('/about/')),
				section('Site', path => ['/', '/branding', '/repl'].includes(path))
			]
		}),
		iconAliasArtifacts
	]
});

async function contentSources() {
	const files = await walk(CONTENT_ROOT);

	return files.map(source => {
		const [locale, ...rest] = source.split('/');
		const id = rest.join('/').replace(/\.md$/, '');
		const path =
			id === 'index' ? '/' : id === 'tutorial/index' ? '/tutorial' : `/${id}`;

		return { id, path, source, locale };
	});
}

async function walk(directory, prefix = '') {
	const files = [];

	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const relative = `${prefix}${entry.name}`;
		if (entry.isDirectory()) {
			files.push(
				...(await walk(new URL(`${entry.name}/`, directory), `${relative}/`))
			);
		} else if (entry.isFile() && entry.name.endsWith('.md')) {
			files.push(relative);
		}
	}

	return files.sort();
}

function clientContentArtifacts({ documents }) {
	return documents.map(document => ({
		path: `/content/${document.relativeSource.replace(/\.md$/, '.json')}`,
		source: JSON.stringify(document.compiled),
		contentType: 'application/json; charset=utf-8'
	}));
}

async function iconAliasArtifacts() {
	const source = await readFile(
		new URL('./src/assets/app-icon.png', import.meta.url)
	);
	return ['apple-touch-icon.png', 'apple-touch-icon-precomposed.png'].map(
		path => ({
			path: `/${path}`,
			source,
			contentType: 'image/png'
		})
	);
}

function section(heading, matches) {
	return {
		heading,
		match: document => document.locale === 'en' && matches(document.path)
	};
}
