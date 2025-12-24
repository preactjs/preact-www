import { useState } from 'preact/hooks';
import { Router, Route, lazy } from 'preact-iso';
import { Page } from './controllers/page';
import { GuidePage } from './controllers/guide-page';
import { NotFound } from './controllers/not-found';
import { headerNav } from '../route-config.js';

export const ReplPage = lazy(() => import('./controllers/repl-page'));
export const BlogPage = lazy(() => import('./controllers/blog-page'));
export const TutorialPage = lazy(() => import('./controllers/tutorial-page'));

// Combined 'REPL' components, re-evaluate if any are used outside of the REPL in the future
export const CodeEditor = lazy(() => import('../lib/repl').then(m => m.CodeEditor));
export const Runner = lazy(() => import('../lib/repl').then(m => m.Runner));
export const ErrorOverlay = lazy(() => import('../lib/repl').then(m => m.ErrorOverlay));
export const Splitter = lazy(() => import('../lib/repl').then(m => m.Splitter));

const routeChange = url =>
	// @ts-ignore
	typeof ga === 'function' && ga('send', 'pageview', url);

const genericRoutes = [];
for (const route in headerNav) {
	if (
		route.startsWith('/guide') ||
		route.startsWith('/tutorial') ||
		route.startsWith('/repl')
	)
		continue;

	genericRoutes.push(<Route key={route} path={route} component={Page} />);
}

export default function Routes() {
	const [loading, setLoading] = useState(false);
	return (
		<main>
			<loading-bar showing={loading} />
			<Router
				onLoadStart={() => setLoading(true)}
				onLoadEnd={() => setLoading(false)}
				onRouteChange={routeChange}
			>
				{genericRoutes}
				<Route path="/tutorial/:step?" component={TutorialPage} />
				<Route path="/guide/:version/:name" component={GuidePage} />
				<Route path="/blog/:slug" component={BlogPage} />
				<Route path="/repl" component={ReplPage} />
				<Route default component={NotFound} />
			</Router>
		</main>
	);
}
