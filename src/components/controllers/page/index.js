import { h } from 'preact';
import cx from '../../../lib/cx';
import ContentRegion, { getContentOnServer } from '../../content-region';
import config from '../../../config';
import style from './style';
import Footer from '../../footer';
import { useEffect, useState, useCallback } from 'preact/hooks';
import Sidebar from './sidebar';
import Hydrator from '../../../lib/hydrator';
import EditThisPage from '../../edit-button';
import { getPrerenderData, InjectPrerenderData } from '../../../lib/prerender-data';

const getContent = route => route.content || route.path;

/**
 * Set `document.title`
 * @param {string} title
 */
export function useTitle(title) {
	useEffect(() => {
		if (title) {
			document.title = `${title} | ${config.title}`;
		}
	}, [title]);
}

const noop = () => {};

// const cached = !PRERENDER && document.querySelector('[type="text/prerender-data"]');
// const bootRoute = cached && cached.getAttribute('data-preid');
// const bootData =
// 	cached &&
// 	JSON.parse(
// 		cached.firstChild.data
// 			.replace(/(^<!--|-->$)/g, '')
// 			.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
// 	);


export function usePage(route) {
	// on the server, pass data down through the tree to avoid repeated FS lookups
	if (PRERENDER) {
		const { content, meta } = getContentOnServer(route.path);
		return {
			current: null,
			content,
			meta,
			loading: true, // this is important since the client will initialize in a loading state.
			onLoad: noop
		};
	}

	const [current, setCurrent] = useState(getContent(route));
	
	const bootData = getPrerenderData(current);
	console.log({ current, bootData });

	const [hydrated, setHydrated] = useState(!!bootData);
	const content = hydrated && bootData.content;

	const [loading, setLoading] = useState(true);
	let [meta, setMeta] = useState(hydrated ? bootData.meta : {});
	if (hydrated) meta = bootData.meta;

	useEffect(() => {
		if (hydrated) {
			onLoad({ meta });
		}
		else if (!didLoad) {
			setLoading(true);
		}
	}, [getContent(route)]);

	useTitle(meta.title);

	let didLoad = false;
	function onLoad({ meta }) {
		didLoad = true;
		setMeta(meta);
		setLoading(false);
		const current = getContent(route);
		setHydrated(!!bootData);
		setCurrent(current);
		// content was loaded. if this was a forward route transition, animate back to top
		if (window.nextStateToTop) {
			window.nextStateToTop = false;
			scrollTo({
				top: 0,
				left: 0,
				behavior: 'smooth'
			});
		}
	}

	return {
		current,
		content,
		meta,
		loading,
		onLoad
	};
}

export default function Page({ route }) {
	const { loading, meta, content, current, onLoad } = usePage(route);
	const [toc, setToc] = useState(meta.toc);
	const onToc = useCallback(clientMeta => {
		setToc(clientMeta.toc || []);
	});

	const layout = `${meta.layout || 'default'}Layout`;
	const name = getContent(route);

	const isReady = !loading && toc != null;
	const hasToc = meta.toc !== false && toc && toc.length > 0;

	// Note:
	// "name" is the exact page ID from the URL
	// "current" is the currently *displayed* page ID.

	const showTitle = current != 'index' && meta.show_title !== false;

	return (
		<div class={cx(style.page, style[layout], hasToc && style.withSidebar)}>
			<progress-bar showing={loading} />
			<div class={style.outer}>
				<Hydrator
					wrapperProps={{ class: style.sidebarWrap }}
					component={Sidebar}
					boot={isReady}
					toc={toc}
				/>
				<div class={style.inner}>
					<Hydrator
						boot={isReady}
						component={EditThisPage}
						show={showTitle && current != '404'}
					/>
					<Hydrator
						component={Title}
						boot={isReady}
						show={showTitle}
						title={meta.title || route.title}
					/>
					<ContentRegion
						name={name}
						content={content}
						onToc={onToc}
						onLoad={onLoad}
					/>
					<Footer />
				</div>
			</div>
			<InjectPrerenderData name={name} data={{ content, meta }} />
		</div>
	);
}

const Title = ({ title, show }) => show && <h1 class={style.title}>{title}</h1>;
