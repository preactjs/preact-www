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
 * @typedef {Record<string, { label: keyof Translations['docPages'] }>} FlatRouteGroup
 * @typedef {{ label: keyof Translations['docPages'], routes: FlatRouteGroup }} RouteGroup
 */

/**
 * @satisfies {Record<'v8' | 'v10' | 'v11', RouteGroup[] | FlatRouteGroup>}
 */
export const docPages = {
	v11: [
		{
			label: 'introduction',
			routes: {
				'/getting-started': {
					label: 'gettingStarted'
				},
				'/upgrade-guide': {
					label: 'upgradeGuide-v11'
				}
			}
		},
		{
			label: 'essentials',
			routes: {
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
			}
		},
		{
			label: 'debugTest',
			routes: {
				'/debugging': {
					label: 'debugging'
				},
				'/preact-testing-library': {
					label: 'preactTestingLibrary'
				},
				'/unit-testing-with-enzyme': {
					label: 'unitTestingWithEnzyme'
				}
			}
		},
		{
			label: 'reactCompatibility',
			routes: {
				'/differences-to-react': {
					label: 'differencesToReact'
				},
				'/switching-to-preact': {
					label: 'switchingToPreact'
				}
			}
		},
		{
			label: 'advanced',
			routes: {
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
			}
		},
		{
			label: 'libraries',
			routes: {
				'/preact-iso': {
					label: 'preactIso'
				},
				'/preact-custom-element': {
					label: 'preactCustomElement'
				},
				'/preact-root-fragment': {
					label: 'preactRootFragment'
				}
			}
		}
	],
	v10: [
		{
			label: 'introduction',
			routes: {
				'/getting-started': {
					label: 'gettingStarted'
				},
				'/whats-new': {
					label: 'whatsNew'
				},
				'/upgrade-guide': {
					label: 'upgradeGuide-v10'
				}
			}
		},
		{
			label: 'essentials',
			routes: {
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
			}
		},
		{
			label: 'debugTest',
			routes: {
				'/debugging': {
					label: 'debugging'
				},
				'/preact-testing-library': {
					label: 'preactTestingLibrary'
				},
				'/unit-testing-with-enzyme': {
					label: 'unitTestingWithEnzyme'
				}
			}
		},
		{
			label: 'reactCompatibility',
			routes: {
				'/differences-to-react': {
					label: 'differencesToReact'
				},
				'/switching-to-preact': {
					label: 'switchingToPreact'
				}
			}
		},
		{
			label: 'advanced',
			routes: {
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
			}
		},
		{
			label: 'libraries',
			routes: {
				'/preact-iso': {
					label: 'preactIso'
				},
				'/preact-custom-element': {
					label: 'preactCustomElement'
				},
				'/preact-root-fragment': {
					label: 'preactRootFragment'
				}
			}
		}
	],
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
 * @satisfies {Record<string, { label: keyof Translations['tutorialPages'] }>}
 */
export const tutorialPages = {
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
 * @param {RouteGroup[]} routes
 * @returns {FlatRouteGroup}
 */
function flattenRoutes(routes) {
	const out = /** @type {FlatRouteGroup} */ ({});
	for (const group of routes) {
		for (const path in group.routes) {
			out[path] = group.routes[path];
		}
	}

	return out;
}

export const flatv10DocPages = flattenRoutes(docPages.v10);

export const allPages = {
	...headerNav,
	...tutorialPages,
	...flattenRoutes(docPages.v11),
	...flattenRoutes(docPages.v10),
	...docPages.v8
};
