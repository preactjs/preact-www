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

// Data added to the markdown frontmatter
export interface FrontMatterMeta {
	title: string;
	description?: string;

	// Tutorial data
	code?: boolean;
	prev?: string;
	next?: string;
	solvable?: boolean;

	// Blog data
	date?: string;
	authors?: string[];
	translation_by?: string[];
}

export interface TableOfContents {
	text: string,
	id: string,
	level: number,
}

// Data available within fetched JSON content
export interface ContentMetaData extends FrontMatterMeta {
	// If the content fetch has fallen back to English or an error page
	isFallback: boolean;

	// Guide data
	toc?: TableOfContents[];

	tutorial?: {
		setup: string;
		initial: string;
		final: string;
	}
}

export interface ContentData {
	html: string;
	meta: ContentMetaData;
}
