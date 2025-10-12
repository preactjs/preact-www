/**
 * @typedef {import('./locales/en.json')} Translations
 */

/**
 * @type {Record<string, { label: keyof Translations['headerNav'] }>}
 */
export const headerNav = {
	'/': {
		label: 'home'
	},
	'/tutorial': {
		label: 'tutorial'
	},
	'/guide/v10/getting-started': {
		label: 'guide'
	},
	'/about': {
		label: 'about'
	},
	'/about/we-are-using': {
		label: 'weAreUsing'
	},
	'/about/libraries-addons': {
		label: 'librariesAddons'
	},
	'/about/demos-examples': {
		label: 'demosExamples'
	},
	'/about/project-goals': {
		label: 'projectGoals'
	},
	'/about/browser-support': {
		label: 'browserSupport'
	},
	'/blog': {
		label: 'blog'
	},
	'/repl': {
		label: 'repl'
	}
};

/**
 * @type {Record<string, { label: keyof Translations['tutorialPages'] }>}
 */
export const tutorialPages = {
	'/tutorial': {
		label: 'learnPreact'
	},
	'/tutorial/01-vdom': {
		label: 'virtualDom'
	},
	'/tutorial/02-events': {
		label: 'events'
	},
	'/tutorial/03-components': {
		label: 'components'
	},
	'/tutorial/04-state': {
		label: 'state'
	},
	'/tutorial/05-refs': {
		label: 'refs'
	},
	'/tutorial/06-context': {
		label: 'context'
	},
	'/tutorial/07-side-effects': {
		label: 'sideEffects'
	},
	'/tutorial/08-keys': {
		label: 'keys'
	},
	'/tutorial/09-error-handling': {
		label: 'errorHandling'
	},
	'/tutorial/10-links': {
		label: 'congratulations'
	}
};
