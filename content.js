import { readdir, readFile } from 'node:fs/promises';

import { defineCollection } from '@pracht/content';

import { compileMarkdown } from './plugins/precompile-markdown/index.js';

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
	artifacts: [clientContentArtifacts, iconAliasArtifacts]
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
