/**
 * Breaks up config JSON into per-language files
 *
 * @returns {import('vite').Plugin}
 */
export function i18nPlugin() {
	return {
		name: 'i18n-json-splitter',
		enforce: 'pre'
		//transform(code, id) {
		//	if (id.includes('config.json')) {
		//		const config = JSON.parse(code);
		//		console.log(config.i18n)
		//	}
		//}
	};
}

function walk() {}
