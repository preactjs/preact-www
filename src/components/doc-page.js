import { useState } from 'preact/hooks';
import {
	useRoute,
	ErrorBoundary,
	Router,
	Route,
	useLocation
} from 'preact-iso';
import config from '../config.json';
import Page from './controllers/page';

/** @type {string[]} */
const routes = [];

const stack = [...config.docs].reverse();
let item;
while ((item = stack.pop())) {
	if (item.routes) {
		for (let i = item.routes.length - 1; i >= 0; i--) {
			stack.push(item.routes[i]);
		}
	} else {
		routes.push(item.path);
	}
}

const Foo = () => {
	const route = useRoute();
	console.log('page', route);
	return (
		<div>
			<h2>it works</h2>
		</div>
	);
};

export function DocPage() {
	const { params, path } = useRoute();
	// const r = useRoute();
	// const loc = useLocation();
	const [loading, setLoading] = useState(true);
	console.log('hey', params);
	return (
		<div>
			<h1 id="foo">Docpage</h1>
			<progress-bar showing={!!loading} />
			<ErrorBoundary>
				<Router
					onLoadStart={() => setLoading(true)}
					onLoadEnd={() => setLoading(false)}
				>
					{routes.map(p => (
						<Route key={p} path={p} component={Foo} />
					))}
					{/* <Route path="/guide/v10/getting-started" component={Page} />
					<Route path="/guide/v10/switching-to-preact" component={Foo} /> */}
				</Router>
			</ErrorBoundary>
		</div>
	);
}
