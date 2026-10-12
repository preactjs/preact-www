import path from 'node:path';
import { promises as fs } from 'node:fs';

import config from '../src/config.json' with { type: 'json' };
import { allRoutes } from '../src/route-config.js';
import { getContentPath } from '../src/lib/content.js';
/** @import { ContentManifest } from '../src/types.d.ts'; */

const contentRoot = new URL('../content', import.meta.url).pathname;

/**
 * @param {Iterable<string>} iter
 * @param {ContentManifest} manifest
 */
async function addToManifest(iter, manifest) {
	for (const lang of iter) {
		const langRoot = path.join(contentRoot, lang);

		for (const route of allRoutes) {
			const contentPath = getContentPath(route);
			const filePath = path.join(langRoot, `${contentPath}.md`);

			try {
				await fs.access(filePath);
				manifest[route].push(lang);
			} catch {}
		}
	}
}

/**
 * Produces JSON manifest of all content & which translations exist for said content.
 *
 * @returns {import('vite').Plugin}
 */
export function contentManifestPlugin() {
	const moduleId = 'virtual:content-manifest',
		resolvedModuleId = '\0' + moduleId;

	return {
		name: 'content-manifest',
		resolveId(id) {
			if (id === moduleId) return resolvedModuleId;
		},
		async load(id) {
			if (id === resolvedModuleId) {
				/** @type {ContentManifest} */
				const manifest = allRoutes.reduce((acc, route) => {
					acc[route] = ['en'];
					return acc;
				}, {});

				const { en, ...nonEnglishLocales } = config.locales;
				const localesArray = Object.keys(nonEnglishLocales);

				await Promise.all(
					Array(localesArray.length)
						.fill(localesArray.values())
						.map((iter) => addToManifest(iter, manifest))
				);

				return `export default ${JSON.stringify(manifest, null, 2)};`;
			}
		}
	};
}
