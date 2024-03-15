declare module '*.module.css' {
	const mapping: Record<string, string>;
	export default mapping;
}

declare module "*?raw" {
    const content: string;
    export default content;
}

declare module "*?url" {
    const content: string;
    export default content;
}

declare var prerenderPreactVersion: string;
declare var prerenderPreactReleaseUrl: string;
