import { h } from 'preact';
import cx from '../../../lib/cx';
import ContentRegion, { getContentOnServer } from '../../content-region';
import config from '../../../config';
import style from './style';
import Footer from '../../footer';
import { useEffect, useState, useCallback } from 'preact/hooks';
import Sidebar from './sidebar';
import Hydrator from '../../../lib/hydrator';

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

export function usePage(route) {
	// on the server, pass data down through the tree to avoid repeated FS lookups
	if (PRERENDER) {
		const { meta } = getContentOnServer(route.path);
		return {
			current: null,
			meta,
			loading: false,
			onLoad: noop
		};
	}

	const [loading, setLoading] = useState(false);
	const [meta, setMeta] = useState({});
	const [current, setCurrent] = useState({});

	useEffect(() => {
		setLoading(true);
	}, [getContent(route)]);

	useTitle(meta.title);

	function onLoad({ meta }) {
		setMeta(meta);
		setLoading(false);
		setCurrent(getContent(route));
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
		meta,
		loading,
		onLoad
	};
}

export default function Page({ route }) {
	const { loading, meta, onLoad } = usePage(route);
	const [toc, setToc] = useState(meta.toc);
	const onToc = useCallback(clientMeta => {
		setToc(clientMeta.toc || []);
	});

	const layout = `${meta.layout || 'default'}Layout`;
	const name = getContent(route);

	const isReady = !loading && toc != null;
	const hasToc = meta.toc !== false && toc && toc.length > 0;

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
						component={Title}
						boot={isReady}
						show={name != 'index' && meta.show_title !== false}
						title={meta.title || route.title}
					/>
					<ContentRegion name={name} onToc={onToc} onLoad={onLoad} />
					<Footer />
				</div>
			</div>
		</div>
	);
}

const Title = ({ title, show }) => show && <h1 class={style.title}>{title}</h1>;

/*
render({ route }, { current, loading, meta = EMPTY, toc, gotToc } = {}) {
	let layout = `${meta.layout || 'default'}Layout`,
		name = getContent(route),
		data;
	if (name !== current) loading = true;

	if (PRERENDER) {
		loading = false;
		// on the server, pass data down through the tree to avoid repeated FS lookups
		data = getContentOnServer(route.path);
		({ meta } = data);
		toc = meta.toc;
	}

	let hasToc = toc && meta.toc !== false && toc.length > 0;
	if (toc && toc[0] && toc[0].level === 1) {
		meta.title = toc[0].text;
	}
	return (
		<div class={cx(style.page, style[layout], hasToc && style.withToc)}>
			<progress-bar showing={loading} />
			<Hydrator
				load={() => Title}
				boot={!loading && gotToc}
				show={name != 'index' && meta.show_title !== false}
				title={meta.title || route.title}
			/>
			<Hydrator
				load={() => Toc}
				boot={!loading && gotToc}
				items={hasToc ? toc : []}
			/>
			<div class={style.inner}>
				<ContentRegion
					name={name}
					data={data}
					onToc={this.gotToc}
					onLoad={this.onLoad}
				/>
*/
