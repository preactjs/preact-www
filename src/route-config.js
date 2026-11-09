/**
 * @typedef {import('./locales/en.json')} Translations
 * @typedef {Record<string, keyof Translations['sidebarNav']>} DocLabels
 * @typedef {'v8' | 'v10' | 'v11'} DocVersion
 */

/**
 * @satisfies {Record<string, keyof Translations['headerNav']>}
 */
export const headerNav = {
	'/': 'home',
	'/tutorial': 'tutorial',
	'/guide/v11/getting-started': 'guide',
	'/about/we-are-using': 'weAreUsing',
	'/about/project-goals': 'projectGoals',
	'/blog': 'blog',
	'/repl': 'repl'
};

/**
 * @satisfies {DocLabels}
 */
const libraries = {
	'/preact-iso': 'preactIso',
	'/preact-custom-element': 'preactCustomElement',
	'/preact-root-fragment': 'preactRootFragment'
};

/**
 * @satisfies {{
 * 	 v8: DocLabels,
 * 	 v10: Record<keyof Translations['sidebarSections'], DocLabels>
 * 	 v11: Record<keyof Translations['sidebarSections'], DocLabels>
 * }}
 */
export const docPages = {
	v11: {
		introduction: {
			'/getting-started': 'gettingStarted',
			'/upgrade-guide': 'upgradeGuide-v11',
			'/differences-to-react': 'differencesToReact'
		},
		essentials: {
			'/components': 'components',
			'/hooks': 'hooks',
			'/signals': 'signals',
			'/forms': 'forms',
			'/refs': 'refs',
			'/context': 'context'
		},
		debugAndTest: {
			'/debugging': 'debugging',
			'/preact-testing-library': 'preactTestingLibrary',
			'/unit-testing-with-enzyme': 'unitTestingWithEnzyme'
		},
		advanced: {
			'/api-reference': 'apiReference',
			'/web-components': 'webComponents',
			'/server-side-rendering': 'serverSideRendering',
			'/options': 'options',
			'/typescript': 'typeScript',
			'/no-build-workflows': 'noBuildWorkflows'
		},
		libraries
	},
	v10: {
		introduction: {
			'/getting-started': 'gettingStarted',
			'/whats-new': 'whatsNew',
			'/upgrade-guide': 'upgradeGuide-v10',
			'/differences-to-react': 'differencesToReact'
		},
		essentials: {
			'/components': 'components',
			'/hooks': 'hooks',
			'/signals': 'signals',
			'/forms': 'forms',
			'/refs': 'refs',
			'/context': 'context'
		},
		debugAndTest: {
			'/debugging': 'debugging',
			'/preact-testing-library': 'preactTestingLibrary',
			'/unit-testing-with-enzyme': 'unitTestingWithEnzyme'
		},
		advanced: {
			'/api-reference': 'apiReference',
			'/web-components': 'webComponents',
			'/server-side-rendering': 'serverSideRendering',
			'/options': 'options',
			'/typescript': 'typeScript',
			'/no-build-workflows': 'noBuildWorkflows'
		},
		libraries
	},
	v8: {
		'/getting-started': 'gettingStarted',
		'/differences-to-react': 'differencesToReact',
		'/switching-to-preact': 'switchingToPreact',
		'/types-of-components': 'typesOfComponents',
		'/api-reference': 'apiReference',
		'/forms': 'forms',
		'/linked-state': 'linkedState',
		'/external-dom-mutations': 'externalDomMutations',
		'/extending-component': 'extendingComponent',
		'/unit-testing-with-enzyme': 'unitTestingWithEnzyme',
		'/progressive-web-apps': 'progressiveWebApps'
	}
};

/**
 * @satisfies {Record<string, keyof Translations['tutorialNav']>}
 */
export const tutorialPages = {
	'/tutorial': 'learnPreact',
	'/tutorial/01-vdom': 'virtualDom',
	'/tutorial/02-events': 'events',
	'/tutorial/03-components': 'components',
	'/tutorial/04-state': 'state',
	'/tutorial/05-refs': 'refs',
	'/tutorial/06-context': 'context',
	'/tutorial/07-side-effects': 'sideEffects',
	'/tutorial/08-keys': 'keys',
	'/tutorial/09-error-handling': 'errorHandling',
	'/tutorial/10-links': 'congratulations'
};

/**
 * @satisfies {Record<string, { label: keyof Translations['blogPosts'], date: string }>}
 */
export const blogPosts = {
	'/blog/website-redesign-competition-winners': {
		label: 'websiteRedesignCompetitionWinners',
		// TODO: I don't love this, we're conflating route config with metadata
		date: '2026-11-07'
	},
	'/blog/website-redesign-competition': {
		label: 'websiteRedesignCompetition',
		date: '2026-10-01'
	},
	'/blog/preact-11': {
		label: 'preact11',
		date: '2026-09-29'
	},
	'/blog/simplifying-islands-arch': {
		label: 'simplifyingIslandsArch',
		date: '2024-08-06'
	},
	'/blog/prerendering-preset-vite': {
		label: 'prerenderingPresetVite',
		date: '2024-08-06'
	},
	'/blog/preact-x': {
		label: 'preactX',
		date: '2024-05-24'
	},
	'/blog/signal-boosting': {
		label: 'signalBoosting',
		date: '2022-09-23'
	},
	'/blog/introducing-signals': {
		label: 'introducingSignals',
		date: '2022-09-06'
	}
};

/**
 * @param {Record<string, DocLabels>} sections
 */
function flatten(sections) {
	/** @type {DocLabels} */
	const out = {};
	for (const section in sections) {
		Object.assign(out, sections[section]);
	}
	return out;
}

/** @type {Record<DocVersion, DocLabels>} */
export const flatDocPages = {
	v8: docPages.v8,
	v10: flatten(docPages.v10),
	v11: flatten(docPages.v11)
};

const routes = new Set(['/404', '/branding', '/translation-score-table']);
for (const path in headerNav) routes.add(path);
for (const path in tutorialPages) routes.add(path);
for (const path in blogPosts) routes.add(path);
/** @type {keyof typeof flatDocPages} */
let version;
for (version in flatDocPages) {
	for (const path in flatDocPages[version])
		routes.add(`/guide/${version}${path}`);
}

export const allRoutes = [...routes];
