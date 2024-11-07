/// <reference types="vite/client" />

declare global {
	namespace preact.JSX {
		interface IntrinsicElements {
			'loading-bar': { showing: boolean };
			'content-region': { name: string; 'data-page-nav': boolean; 'can-edit': boolean, children: any };
		}
	}
}

export interface PrerenderData {
	preactVersion: string;
	preactReleaseURL: string;
	preactStargazers: number;
}
