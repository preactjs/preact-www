/**
 * @type {import('./types.d.ts').RouteData[]}
 */
export const routes = [
	{
		path: '/',
		name: 'Home'
	},
	{
		path: '/branding',
		name: 'Branding'
	},
	{
		name: 'Tutorial',
		routes: [
			{
				path: '/tutorial',
				name: 'Learn Preact'
			},
			{
				path: '/tutorial/01-vdom',
				name: 'Virtual DOM'
			},
			{
				path: '/tutorial/02-events',
				name: 'Events'
			},
			{
				path: '/tutorial/03-components',
				name: 'Components'
			},
			{
				path: '/tutorial/04-state',
				name: 'State'
			},
			{
				path: '/tutorial/05-refs',
				name: 'Refs'
			},
			{
				path: '/tutorial/06-context',
				name: 'Context'
			},
			{
				path: '/tutorial/07-side-effects',
				name: 'Side Effects'
			},
			{
				path: '/tutorial/08-keys',
				name: 'Keys'
			},
			{
				path: '/tutorial/09-error-handling',
				name: 'Error Handling'
			},
			{
				path: '/tutorial/10-links',
				name: 'Congratulations!'
			}
		]
	},
	{
		name: 'Guide',
		routes: []
	},
	{
		name: 'About',
		routes: [
			{
				path: '/about/we-are-using',
				name: 'Companies using Preact'
			},
			{
				path: '/about/libraries-addons',
				name: 'Libraries & Add-ons'
			},
			{
				path: '/about/demos-examples',
				name: 'Demos & Examples'
			},
			{
				path: '/about/project-goals',
				name: 'Project Goals'
			},
			{
				path: '/about/browser-support',
				name: 'Browser Support'
			}
		]
	},
	{
		name: 'Blog',
		routes: [
			{
				path: '/blog',
				name: 'Blog'
			},
			{
				path: '/blog/simplifying-islands-arch',
				name: 'Build your own Island Components'
			},
			{
				path: '/blog/prerendering-preset-vite',
				name: 'Prerendering with Preset Vite'
			},
			{
				path: '/blog/preact-x',
				name: 'Preact X, a story of stability'
			},
			{
				path: '/blog/signal-boosting',
				name: 'Signal Boosting'
			},
			{
				path: '/blog/introducing-signals',
				name: 'Introducing Signals'
			}
		]
	},
	{
		path: '/repl',
		name: 'REPL'
	}
];
