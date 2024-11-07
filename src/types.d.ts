/// <reference types="vite/client" />

declare global {
	namespace preact.JSX {
		interface IntrinsicElements {
			'loading-bar': { showing: boolean };
			'content-region': { name: string; 'data-page-nav': boolean; 'can-edit': boolean, children: any };
		}
	}
	var prerenderPreactVersion: string;
	var prerenderPreactReleaseUrl: string;
	var prerenderPreactStargazers: number;
}


export {}
