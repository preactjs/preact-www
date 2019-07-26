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

const cached =
	!PRERENDER && document.querySelector(`script[type="text/prerender-data"]`);
const bootRoute = cached && cached.getAttribute('data-route');
const bootData =
	cached &&
	JSON.parse(
		cached.firstChild.data
			.replace(/(^<!--|-->$)/g, '')
			.replace(/--&gt;/g, '-->')
	);

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

	const hydrated = bootData && bootRoute === route.path;
	const content = hydrated && bootData.content;

	const [loading, setLoading] = useState(!hydrated);
	// const [meta, setMeta] = useState(cached || {});
	const [meta, setMeta] = useState(hydrated ? bootData.meta : {});
	const [current, setCurrent] = useState({});

	useEffect(() => {
		if (!didLoad) {
			setLoading(true);
		}
	}, [getContent(route)]);

	useTitle(meta.title);

	let didLoad = false;
	function onLoad({ meta }) {
		didLoad = true;
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
		content,
		meta,
		loading,
		onLoad
	};
}

export default function Page({ route }) {
	const { loading, meta, content, onLoad } = usePage(route);
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
						component={EditThisPage}
						show={name != 'index' && name != '404'}
					/>
					<Hydrator
						component={Title}
						boot={isReady}
						show={name != 'index' && meta.show_title !== false}
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
			{PRERENDER && (
				<script
					type="text/prerender-data"
					data-route={route.path}
					dangerouslySetInnerHTML={{
						__html:
							'<!--' +
							JSON.stringify({ content, meta }).replace(/-->/g, '--&gt;') +
							'-->'
					}}
				/>
			)}
		</div>
	);
}

const Title = ({ title, show }) => show && <h1 class={style.title}>{title}</h1>;
