declare module '*.module.css' {
	const mapping: Record<string, string>;
	export default mapping;
}

declare var PRERENDER: boolean;
