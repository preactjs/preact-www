declare module 'virtual:content-manifest' {
	const manifest: import('./types.d.ts').ContentManifest;
	export default manifest;
}

declare module 'virtual:translation-scores' {
	const manifest: import('./types.d.ts').TranslationScoreManifest;
	export default manifest;
}
