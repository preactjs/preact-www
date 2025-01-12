import { useState } from 'preact/hooks';
import { Router, Route, lazy } from 'preact-iso';
import { Page } from './controllers/page';
import { DocPage } from './controllers/doc-page';
import { NotFound } from './controllers/not-found';
import { navRoutes } from '../lib/route-utils';

export const ReplPage = lazy(() => import('./controllers/repl-page'));
export const BlogPage = lazy(() => import('./controllers/blog-page'));
export const TutorialPage = lazy(() => import('./controllers/tutorial-page'));

// @ts-ignore
const routeChange = url => typeof ga === 'function' && ga('send', 'pageview', url);

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
				{Object.keys(navRoutes)
					.filter(route => !route.startsWith('/guide'))
					.filter(route => !route.startsWith('/tutorial'))
					.map(route => {
						const component = route === '/repl' ? ReplPage : Page;
						return <Route key={route} path={route} component={component} />;
					})}
				<Route path="/tutorial/:step?" component={TutorialPage} />
				<Route path="/guide/:version/:name" component={DocPage} />
				<Route path="/blog/:slug" component={BlogPage} />
				<Route default component={NotFound} />
			</Router>
		</main>
	);
}
