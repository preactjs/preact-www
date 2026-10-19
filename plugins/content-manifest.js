import path from 'node:path';

import config from '../src/config.json' with { type: 'json' };
import { allRoutes } from '../src/route-config.js';
import { getContentPath } from '../src/lib/content.js';
/** @import { ContentManifest, ContentManifestEntry } from '../src/types.d.ts'; */
import { scoreTranslations } from '../scripts/check-translation-drift.js';

const contentRoot = path.resolve(import.meta.dirname, '../content');

/**
 * Produces JSON manifest of all content & which translations exist for said content.
 *
 * @returns {import('vite').Plugin}
 */
export function contentManifestPlugin() {
	const contentManifestModuleId = 'virtual:content-manifest',
		resolvedContentManifestModuleId = '\0' + contentManifestModuleId;
	const scoresModuleId = 'virtual:translation-scores',
		resolvedScoresModuleId = '\0' + scoresModuleId;

	return {
		name: 'content-manifest',
		resolveId(id) {
			if (id === contentManifestModuleId)
				return resolvedContentManifestModuleId;
			if (id === scoresModuleId) return resolvedScoresModuleId;
		},
		async load(id) {
			if (id === resolvedContentManifestModuleId) {
				const { en: _en, ...nonEnglishLocales } = config.locales;
				const localesArray = /** @type {(keyof nonEnglishLocales)[]} */ (
					Object.keys(nonEnglishLocales)
				);

				const defaultLocaleManifestEntries =
					/** @type {Record<keyof nonEnglishLocales, ContentManifestEntry>} */ ({});
				for (const locale of localesArray) {
					defaultLocaleManifestEntries[locale] = {
						exists: false,
						enabled: false
					};
				}

				const manifest = allRoutes.reduce((acc, route) => {
					acc[getContentPath(route)] = {
						en: {
							exists: true,
							enabled: true
						},
						...defaultLocaleManifestEntries
					};
					return acc;
				}, /** @type {ContentManifest} */ ({}));

				const result = await scoreTranslations(localesArray);

				for (const locale of localesArray) {
					const rows = result[locale];

					for (const route in manifest) {
						const scoreRow = rows.find(
							(row) => route == `/${row.file.replace('.md', '')}`
						);

						if (scoreRow) {
							manifest[route][locale] = {
								exists: true,
								enabled: scoreRow.score >= 0.4
							};
						}
					}
				}

				return `export default ${JSON.stringify(manifest, null, 2)};`;
			}

			if (id === resolvedScoresModuleId) {
				const { en, ...nonEnglishLocales } = config.locales;
				const localesArray = /** @type {(keyof nonEnglishLocales)[]} */ (
					Object.keys(nonEnglishLocales)
				);

				const result = await scoreTranslations(localesArray);
				return `export default ${JSON.stringify(result, null, 2)};`;
			}
		},
		configureServer(server) {
			server.watcher.on('all', (_event, file) => {
				if (!file.startsWith(contentRoot)) return;

				const scoresMod = server.moduleGraph.getModuleById(
					resolvedScoresModuleId
				);
				if (scoresMod) server.reloadModule(scoresMod);

				const manifestMod = server.moduleGraph.getModuleById(
					resolvedContentManifestModuleId
				);
				if (manifestMod) server.reloadModule(manifestMod);
			});
		}
	};
}
