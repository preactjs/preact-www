import { useRoute } from 'preact-iso';
import { useTitle, useMeta, useTitleTemplate } from 'hoofd/preact';
import { useResource } from './use-resource';
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

const docRoutes = {};
for (const k in config.docs) {
	docRoutes[k] = flattenRoutes(config.docs[k]);
}

export function DocPage() {
	const { params } = useRoute();
	const { version, name } = params;

	if (!docRoutes[version][name]) {
		return <controllers.error route={{ content: '404', title: '404' }} />;
	}

	return (
		<div>
			<h1 id="foo">Docpage</h1>
			<MarkdownRegion />
		</div>
	);
}

function MarkdownRegion() {
	const route = useRoute();
	const [lang] = useLanguage();

	const { name, version } = route.params;

	const data = useResource(
		() => getContent([lang, `/guide/${version}/${name}`]),
		[name, version]
	);

	useTitleTemplate(
		'%s | Preact: Fast 3kb React alternative with the same ES6 API. Components & Virtual DOM.'
	);
	useTitle(data.meta.title);
	useMeta({ name: 'description', content: data.meta.description });

	return <ContentRegion name={name} content={data.html} toc={data.meta.toc} />;
}
