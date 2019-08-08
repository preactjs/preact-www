import { h } from 'preact';
import { useEffect, useState, useMemo, useRef } from 'preact/hooks';
import cx from '../../../lib/cx';
import ContentRegion from '../../content-region';
import { getContentOnServer, getContent } from '../../../lib/content';
import config from '../../../config';
import style from './style';
import Footer from '../../footer';
import Sidebar from './sidebar';
import Hydrator from '../../../lib/hydrator';
import EditThisPage from '../../edit-button';
import {
	getPrerenderData,
	InjectPrerenderData
} from '../../../lib/prerender-data';
import { isDocPage } from '../../../lib/docs';
import { useStore } from '../../store-adapter';

const getContentId = route => route.content || route.path;

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

/**
 * Set the meta description tag content
 * @param {string} text
 */
export function useDescription(text) {
	useEffect(() => {
		const el = document.querySelector('meta[name=description]');
		if (text && el) {
			el.setAttribute('content', text);
		}
	}, [text]);
}

export function usePage(route, lang) {
	// on the server, pass data down through the tree to avoid repeated FS lookups
	if (PRERENDER) {
		const { content, html, meta } = getContentOnServer(route.path, lang);
		return {
			current: null,
			content,
			html,
			meta,
			loading: true // this is important since the client will initialize in a loading state.
		};
	}

	const [current, setCurrent] = useState(getContentId(route));

	const bootData = getPrerenderData(current);

	const [hydrated, setHydrated] = useState(!!bootData);
	const [content, setContent] = useState(
		hydrated && bootData && bootData.content
	);
	const [html, setHtml] = useState();

	const [loading, setLoading] = useState(true);
	const [isFallback, setFallback] = useState(false);
	let [meta, setMeta] = useState(hydrated ? bootData.meta : undefined);
	if (!meta) meta = (hydrated && bootData.meta) || {};

	const lock = useRef();
	useEffect(() => {
		if (!didLoad) {
			setLoading(true);
		}
		const contentId = getContentId(route);
		lock.current = contentId;
		getContent([lang, contentId]).then(data => {
			// Discard old load events
			if (lock.current !== contentId) return;
			onLoad(data);
		});
	}, [getContentId(route), lang]);

	useTitle(meta.title);
	useDescription(meta.description);

	let didLoad = false;
	function onLoad(data) {
		const { content, html, meta, fallback } = data;
		didLoad = true;

		// Don't show loader forever in case of an error
		if (!meta) return;

		setContent(content);
		setMeta(meta);
		setHtml(html);
		setLoading(false);
		setFallback(fallback);
		const current = getContentId(route);
		const bootData = getPrerenderData(current);
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
		html,
		meta,
		loading,
		isFallback
	};
}

export default function Page({ route }, ctx) {
	const store = useStore(['url', 'lang']);
	const { loading, meta, content, html, current, isFallback } = usePage(
		route,
		store.state.lang
	);
	const urlState = store.state;
	const url = useMemo(() => urlState.url, [current]);

	const layout = `${meta.layout || 'default'}Layout`;
	const name = getContentId(route);

	const isReady = !loading;

	// workaround: we toc in the store in order for <table-of-contents> to pick it up.
	if (meta.toc && ctx.store.getState().toc !== meta.toc) {
		ctx.store.setState({
			toc: meta.toc
		});
	}

	// Note:
	// "name" is the exact page ID from the URL
	// "current" is the currently *displayed* page ID.

	const showTitle = current != 'index' && meta.show_title !== false;
	const canEdit = showTitle && current != '404';
	const hasSidebar = meta.toc !== false && isDocPage(url);

	return (
		<div class={cx(style.page, style[layout], hasSidebar && style.withSidebar)}>
			<progress-bar showing={loading} />
			<div class={style.outer}>
				<Hydrator
					wrapperProps={{ class: style.sidebarWrap }}
					component={Sidebar}
					boot={isReady}
					show={hasSidebar}
				/>
				<div class={style.inner}>
					<Hydrator
						boot={isReady}
						component={EditThisPage}
						show={canEdit}
						isFallback={isFallback}
					/>
					{showTitle && (
						<h1 class={style.title}>{meta.title || route.title}</h1>
					)}
					<Hydrator
						component={ContentRegion}
						boot={!!html}
						name={name}
						content={html}
					/>
					<Footer />
				</div>
			</div>
			<InjectPrerenderData
				name={name}
				data={{
					content,
					meta: { ...meta, toc: undefined }
				}}
			/>
		</div>
	);
}
