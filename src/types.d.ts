declare module '*.module.css' {
	const mapping: Record<string, string>;
	export default mapping;
}

declare var PRERENDER: boolean;
declare var __non_webpack_require__: (id: string) => any;
