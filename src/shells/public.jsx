import { useNavigation, useRouteData } from '@pracht/core';
import { ErrorBoundary as SuspenseBoundary } from 'preact-iso';

import { LanguageProvider } from '../lib/i18n';
import { PrerenderDataProvider } from '../lib/prerender-data.jsx';
import { useDelegatedPrefetch } from '../lib/use-delegated-prefetch.js';
import Header from '../components/header';
import '../lib/dev-globals.js';
import { useAnalytics } from '../analytics.js';
import '../style/index.css';

/**
 * The chrome every page shares: language context, header, and the `<main>`
 * landmark route content renders into.
 *
 * Site-wide data (latest release, org repos) arrives as part of the route's
 * loader payload — see `withSiteData` — so it is server-rendered and hydrates
 * without a mismatch.
 *
 * @param {import('@pracht/core').ShellProps} props
 */
export function Shell({ children }) {
	const data =
		/** @type {{ site?: import('../types.d.ts').PrerenderData }} */ (useRouteData() ||
		{});

	return (
		// `useResource` signals "not ready yet" by throwing a promise, and the
		// language provider and content hooks both rely on it. That needs a
		// boundary above them to catch the throw and re-render when it settles —
		// preact-iso's ErrorBoundary is one, and is what the app used before.
		// Without it, switching language updates state that never reaches the DOM.
		<SuspenseBoundary>
			<LanguageProvider>
				<PrerenderDataProvider value={data.site}>
					<Chrome>{children}</Chrome>
				</PrerenderDataProvider>
			</LanguageProvider>
		</SuspenseBoundary>
	);
}

/**
 * Split out so the prefetch hook sits inside `LanguageProvider` — it only has
 * work to do when the reader is on a translation.
 *
 * @param {{ children: import('preact').ComponentChildren }} props
 */
function Chrome({ children }) {
	useDelegatedPrefetch();
	useAnalytics();

	return (
		<>
			<Header />
			<main>
				<LoadingBar />
				{children}
			</main>
		</>
	);
}

/**
 * The router used to drive this via `onLoadStart`/`onLoadEnd`; pracht exposes
 * the same signal declaratively.
 */
function LoadingBar() {
	const navigation = useNavigation();
	return <loading-bar showing={navigation.state !== 'idle'} />;
}

export function head() {
	return {
		lang: 'en',
		title: 'Preact',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1.0, minimal-ui'
			},
			{ name: 'color-scheme', content: 'dark light' },
			{ name: 'theme-color', content: '#673AB8' },
			{ property: 'og:image', content: 'https://preactjs.com/app-icon.png' },
			{ name: 'twitter:card', content: 'summary' }
		],
		link: [
			{ rel: 'icon', href: '/favicon.ico' },
			{
				rel: 'alternate',
				type: 'application/rss+xml',
				href: 'https://preactjs.com/feed.xml'
			},
			{
				rel: 'alternate',
				type: 'application/atom+xml',
				href: 'https://preactjs.com/feed.atom'
			},
			{ rel: 'preconnect', href: 'https://esm.sh', crossorigin: 'anonymous' },
			{
				rel: 'preconnect',
				href: 'https://www.google-analytics.com',
				crossorigin: 'anonymous'
			}
		]
	};
}

/**
 * @param {import('@pracht/core').ErrorBoundaryProps} props
 */
export function ErrorBoundary({ error }) {
	return (
		<div style="max-width: 40rem; margin: 4rem auto; padding: 0 1rem;">
			<h1>{error.status ?? 500}</h1>
			<p>{error.message}</p>
			<p>
				<a href="/">Go home</a>
			</p>
		</div>
	);
}
