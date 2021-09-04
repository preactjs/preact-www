import { useRoute, useLocation } from 'preact-iso';
import { useResource } from '../use-resource';
import config from '../../config.json';
import { NotFound } from './not-found';
import cx from '../../lib/cx';
import { LATEST_MAJOR, isDocPage } from '../../lib/docs';
import { getContent } from '../../lib/content';
import { useLanguage } from '../../lib/i18n';
import { MarkdownRegion } from './markdown-region';
import style from './page/style.module.less';
import Sidebar from './page/sidebar';
import Footer from '../footer/index';

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
		return <NotFound />;
	}

	return <DocLayout />;
}

function DocLayout() {
	const { url } = useLocation();
	const [lang] = useLanguage();

	const { html, meta } = useResource(() => getContent([lang, url]), [url]);

	const hasSidebar = meta.toc !== false && isDocPage(url);

	return (
		<div class={cx(style.page, hasSidebar && style.withSidebar)}>
			<div class={style.outer}>
				{hasSidebar && (
					<div class={style.sidebarWrap}>
						<Sidebar />
					</div>
				)}
				<div class={style.inner}>
					<OldDocsWarning />
					<MarkdownRegion html={html} meta={meta} />
					<Footer />
				</div>
			</div>
		</div>
	);
}

function OldDocsWarning() {
	const { name, version } = useRoute().params;
	const { url } = useLocation();

	if (
		!isDocPage(url) ||
		+version === LATEST_MAJOR ||
		!config.docs['v' + LATEST_MAJOR][name]
	) {
		return null;
	}

	return (
		<div class={style.oldDocsWarning}>
			You are viewing the documentation for an older version of Preact.
			{config.docs['v' + LATEST_MAJOR][name] && (
				<>
					{' '}
					Switch to the{' '}
					<a href={`/guide/v${LATEST_MAJOR}/${name}`}>current version</a>.
				</>
			)}
		</div>
	);
}
