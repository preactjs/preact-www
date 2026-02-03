/**
 * @typedef {import('./locales/en.json')} Translations
 */

/**
 * @satisfies {Record<string, { label: keyof Translations['headerNav'] }>}
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
	'/branding': {
		label: 'branding'
	},
	'/blog': {
		label: 'blog'
	},
	'/repl': {
		label: 'repl'
	}
};

/**
 * @typedef {Record<string, { label: keyof Translations['sidebarNav'] }>} RouteLabelMap
 * @typedef {Record<keyof Translations['sidebarSections'], RouteLabelMap>} SidebarWithSections
 */

/**
 * @satisfies {RouteLabelMap}
 */
const LIBRARIES = {
	'/preact-iso': {
		label: 'preactIso'
	},
	'/preact-custom-element': {
		label: 'preactCustomElement'
	},
	'/preact-root-fragment': {
		label: 'preactRootFragment'
	}
};

/**
 * @satisfies {Record<'v8' | 'v10' | 'v11', SidebarWithSections | RouteLabelMap>}
 */
export const docPages = {
	v11: {
		introduction: {
			'/getting-started': {
				label: 'gettingStarted'
			},
			'/upgrade-guide': {
				label: 'upgradeGuide-v11'
			},
			'/differences-to-react': {
				label: 'differencesToReact'
			}
		},
		essentials: {
			'/components': {
				label: 'components'
			},
			'/hooks': {
				label: 'hooks'
			},
			'/signals': {
				label: 'signals'
			},
			'/forms': {
				label: 'forms'
			},
			'/refs': {
				label: 'refs'
			},
			'/context': {
				label: 'context'
			}
		},
		debugAndTest: {
			'/debugging': {
				label: 'debugging'
			},
			'/preact-testing-library': {
				label: 'preactTestingLibrary'
			},
			'/unit-testing-with-enzyme': {
				label: 'unitTestingWithEnzyme'
			}
		},
		advanced: {
			'/api-reference': {
				label: 'apiReference'
			},
			'/web-components': {
				label: 'webComponents'
			},
			'/server-side-rendering': {
				label: 'serverSideRendering'
			},
			'/options': {
				label: 'options'
			},
			'/typescript': {
				label: 'typeScript'
			},
			'/no-build-workflows': {
				label: 'noBuildWorkflows'
			}
		},
		libraries: LIBRARIES
	},
	v10: {
		introduction: {
			'/getting-started': {
				label: 'gettingStarted'
			},
			'/whats-new': {
				label: 'whatsNew'
			},
			'/upgrade-guide': {
				label: 'upgradeGuide-v10'
			},
			'/differences-to-react': {
				label: 'differencesToReact'
			}
		},
		essentials: {
			'/components': {
				label: 'components'
			},
			'/hooks': {
				label: 'hooks'
			},
			'/signals': {
				label: 'signals'
			},
			'/forms': {
				label: 'forms'
			},
			'/refs': {
				label: 'refs'
			},
			'/context': {
				label: 'context'
			}
		},
		debugAndTest: {
			'/debugging': {
				label: 'debugging'
			},
			'/preact-testing-library': {
				label: 'preactTestingLibrary'
			},
			'/unit-testing-with-enzyme': {
				label: 'unitTestingWithEnzyme'
			}
		},
		advanced: {
			'/api-reference': {
				label: 'apiReference'
			},
			'/web-components': {
				label: 'webComponents'
			},
			'/server-side-rendering': {
				label: 'serverSideRendering'
			},
			'/options': {
				label: 'options'
			},
			'/typescript': {
				label: 'typeScript'
			},
			'/no-build-workflows': {
				label: 'noBuildWorkflows'
			}
		},
		libraries: LIBRARIES
	},
	v8: {
		'/getting-started': {
			label: 'gettingStarted'
		},
		'/differences-to-react': {
			label: 'differencesToReact'
		},
		'/switching-to-preact': {
			label: 'switchingToPreact'
		},
		'/types-of-components': {
			label: 'typesOfComponents'
		},
		'/api-reference': {
			label: 'apiReference'
		},
		'/forms': {
			label: 'forms'
		},
		'/linked-state': {
			label: 'linkedState'
		},
		'/external-dom-mutations': {
			label: 'externalDomMutations'
		},
		'/extending-component': {
			label: 'extendingComponent'
		},
		'/unit-testing-with-enzyme': {
			label: 'unitTestingWithEnzyme'
		},
		'/progressive-web-apps': {
			label: 'progressiveWebApps'
		}
	}
};

/**
 * @satisfies {Record<string, { label: keyof Translations['tutorialNav'] }>}
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

/**
 * @satisfies {Record<string, { label: keyof Translations['blogPosts'], date: string }>}
 */
export const blogPosts = {
	'/blog/simplifying-islands-arch': {
		label: 'simplifyingIslandsArch',
		// TODO: I don't love this, we're conflating route config with metadata
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
 * Flattens nested sidebar structure into a single object with path keys.
 *
 * @param {SidebarWithSections} routes
 * @returns {RouteLabelMap}
 */
function flattenRoutes(routes) {
	const out = /** @type {RouteLabelMap} */ ({});
	for (const group in routes) {
		for (const path in routes[group]) {
			out[path] = routes[group][path];
		}
	}

	return out;
}

export const flatDocPages = {
	v8: docPages.v8,
	v10: flattenRoutes(docPages.v10),
	v11: flattenRoutes(docPages.v11)
};
