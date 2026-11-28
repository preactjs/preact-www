import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import { Router, Route, useLocation } from 'preact-iso';
import { lazy } from '../lib/lazy.js';
import { useNavigationTime } from '../lib/reader-input.js';
import { markRouteHydrated } from '../lib/route-hydrated.js';
import { Page, pages } from './controllers/page.jsx';
import { GuidePage } from './controllers/guide-page.jsx';
import { NotFound } from './controllers/not-found.jsx';
import { LATEST_MAJOR } from './doc-version/index.jsx';

// The home page's interactive diagrams & playground are only needed there
export const Home = lazy(() => import('./home/index.jsx'));
export const ReplPage = lazy(() => import('./controllers/repl-page.jsx'));
export const BlogPage = lazy(() => import('./controllers/blog-page.jsx'));
export const TutorialPage = lazy(
	() => import('./controllers/tutorial-page.jsx')
);

// Combined 'REPL' components, re-evaluate if any are used outside of the REPL in the future
export const CodeEditor = lazy(() =>
	import('../lib/repl.js').then((m) => m.CodeEditor)
);
export const Runner = lazy(() =>
	import('../lib/repl.js').then((m) => m.Runner)
);
export const ErrorOverlay = lazy(() =>
	import('../lib/repl.js').then((m) => m.ErrorOverlay)
);
export const Splitter = lazy(() =>
	import('../lib/repl.js').then((m) => m.Splitter)
);

/** @param {string} url */
const routeChange = (url) =>
	// @ts-ignore
	typeof ga === 'function' && ga('send', 'pageview', url);

/**
 * `/docs` and `/docs/<page>` lead to the latest docs, like the `_redirects`
 * rules do for full page loads
 */
function DocsRedirect() {
	const { path, route } = useLocation();
	useLayoutEffect(() => {
		const name =
			path.replace(/^\/docs\/?/, '').replace(/\/$/, '') || 'getting-started';
		route(
			`/guide/${LATEST_MAJOR}/${name}${location.search}${location.hash}`,
			true
		);
	}, [path]);
	return null;
}

const genericRoutes = pages.map((route) => (
	<Route key={route} path={route} component={Page} />
));

export default function Routes() {
	const [loading, setLoading] = useState(false);
	useNavigationTime();
	// The first route is hydrated once rendered, after loading if it suspended
	const suspended = useRef(false);
	useLayoutEffect(() => {
		if (!suspended.current) markRouteHydrated();
	}, []);
	return (
		<main>
			<loading-bar showing={loading} />
			<Router
				onLoadStart={() => {
					suspended.current = true;
					setLoading(true);
				}}
				onLoadEnd={() => {
					markRouteHydrated();
					setLoading(false);
				}}
				onRouteChange={routeChange}
			>
				<Route path="/" component={Home} />
				{genericRoutes}
				<Route path="/tutorial/:step?" component={TutorialPage} />
				<Route path="/guide/:version/:name" component={GuidePage} />
				<Route path="/blog/:slug" component={BlogPage} />
				<Route path="/repl" component={ReplPage} />
				<Route path="/docs/:rest*" component={DocsRedirect} />
				<Route default component={NotFound} />
			</Router>
		</main>
	);
}
