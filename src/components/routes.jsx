import { useState } from 'preact/hooks';
import { Router, Route, lazy } from 'preact-iso';
import { Page } from './controllers/page';
import { DocPage } from './controllers/doc-page';
import { NotFound } from './controllers/not-found';
import { navRoutes } from '../lib/route-utils';

if (typeof history !== 'undefined') {
	let { pushState } = history;
	history.pushState = (a, b, url) => {
		pushState.call(history, a, b, url);
		if (url.indexOf('#') < 0) {
			// next time content loads, scroll to top:
			window.nextStateToTop = true;
			// scrollTo(0, 0);
		}
	};
}

const Repl = lazy(() => import('./controllers/repl'));
const BlogPage = lazy(() => import('./controllers/blog-page'));
const TutorialPage = lazy(() => import('./controllers/tutorial-page'));

export default function Routes() {
	const [loading, setLoading] = useState(false);
	return (
		<main>
			<progress-bar showing={loading} />
			<Router
				onLoadStart={() => setLoading(true)}
				onLoadEnd={() => setLoading(false)}
				onRouteChange={url =>
					typeof ga === 'function' && ga('send', 'pageview', url)
				}
			>
				{Object.keys(navRoutes)
					.filter(route => !route.startsWith('/guide'))
					.filter(route => !route.startsWith('/tutorial'))
					.map(route => {
						const component = route === '/repl' ? Repl : Page;
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
