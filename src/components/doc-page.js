import { useMemo, useState, useRef, useEffect } from 'preact/hooks';
import {
	useRoute,
	ErrorBoundary,
	Router,
	Route,
	useLocation
} from 'preact-iso';
import config from '../config.json';
import controllers from './controllers';
import { getContent } from '../lib/content';
import { useLanguage } from '../lib/i18n';
import ContentRegion from './content-region';

function flattenRoutes(routes) {
	let out = {};

	const stack = [...routes];
	let item;
	while ((item = stack.pop())) {
		if (item.routes) {
			for (let i = item.routes.length - 1; i >= 0; i--) {
				stack.push(item.routes[i]);
			}
		} else {
			out[item.path.slice(1)] = item;
		}
	}

	return out;
}

export function DocPage() {
	const { params } = useRoute();
	const { version, name } = params;
	const [loading, setLoading] = useState(true);

	const routes = useMemo(() => {
		const docRoutes = {};
		for (const k in config.docs) {
			docRoutes[k] = flattenRoutes(config.docs[k]);
		}
		return docRoutes;
	}, [config.docs]);

	if (!routes[version][name]) {
		return <controllers.error route={{ content: '404', title: '404' }} />;
	}

	return (
		<div>
			<h1 id="foo">Docpage</h1>
			<MarkdownRegion />
		</div>
	);
}

const CACHE = new Map();

function readResource(fn, deps) {
	const cacheKey = '' + fn + JSON.stringify(deps);

	let state = CACHE.get(cacheKey);
	if (!state) {
		state = { promise: null, status: 'pending', result: undefined };
		state.promise = fn()
			.then(r => {
				state.status = 'success';
				state.result = r;
			})
			.catch(err => {
				state.status = 'error';
				state.result = err;
			});

		CACHE.set(cacheKey, state);
	}

	if (state.status === 'pending') {
		throw state.promise;
	} else if (state.status === 'error') {
		throw state.result;
	}

	return state.result;
}

function MarkdownRegion() {
	const route = useRoute();
	const loc = useLocation();
	const [lang] = useLanguage();

	const { name, version } = route.params;

	console.log('--> markdown', lang, loc.path);
	const content = readResource(
		() => getContent([lang, `/guide/${version}/${name}`]),
		[name, version]
	);

	console.log('--> done', content);

	return <ContentRegion name={name} content={content.html} />;
}
