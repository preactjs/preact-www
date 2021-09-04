import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Router, Route, ErrorBoundary, lazy } from 'preact-iso';
import { DocPage } from './controllers/doc-page';
import { NotFound } from './controllers/not-found';

let { pushState } = history;
history.pushState = (a, b, url) => {
	pushState.call(history, a, b, url);
	if (url.indexOf('#') < 0) {
		// next time content loads, scroll to top:
		window.nextStateToTop = true;
		// scrollTo(0, 0);
	}
};

const Repl = lazy(() => import('./controllers/repl'));

export default function Routes() {
	const [loading, setLoading] = useState(true);
	return (
		<main>
			<progress-bar showing={loading} />
			<ErrorBoundary>
				<Router
					onLoadStart={() => setLoading(true)}
					onLoadEnd={() => setLoading(false)}
				>
					<Route path="/about/we-are-using" component={DocPage} />
					<Route path="/guide/:version/:name?" component={DocPage} />
					<Route path="/repl" component={Repl} />
					<Route default component={NotFound} />
				</Router>
			</ErrorBoundary>
		</main>
	);
}
