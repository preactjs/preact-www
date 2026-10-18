/// <reference types="vite/client" />

import type config from './config.json';

declare global {
	namespace preact.JSX {
		interface IntrinsicElements {
			'loading-bar': { showing: boolean };
			'content-region': { name: string; 'can-edit': boolean, children: any };
		}
	}
}

export interface GitHubOrgRepoData {
	html_url: string;
	full_name: string;
	stargazers_count: number;
	description: string
	[key: string]: unknown;
}

export interface FilteredRepoData {
	html_url: string;
	full_name: string;
	stargazers_count: number;
	description: string
}

export interface PrerenderData {
	preactVersion: string;
	preactReleaseURL: string;
	preactOrgRepos: FilteredRepoData[];
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
	translationExists: boolean;
	translationEnabled: boolean;

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

export type Locale = keyof typeof config.locales;

/**
 * All content paths + a whether a translation exists & is enabled for the locale
 */
export interface ContentManifest {
	[key: string]: {
		[key in Locale]: ContentManifestEntry;
	}
}

export interface ContentManifestEntry {
	exists: boolean;
	enabled: boolean;
}

export type TranslationScoreManifest = {
	[key in Locale]: TranslationScoreEntry[];
}

export interface TranslationScoreEntry {
	file: string;
	code: number | null;
	links: number | null;
	structure: number;
	score: number;
}
