import { h } from 'preact';
import cx from '../../../lib/cx';
import ContentRegion from '../../content-region';
import config from '../../../config';
import style from './style';
import Footer from '../../footer';
import { useEffect, useState } from 'preact/hooks';
import Sidebar from './sidebar';
import EditThisPage from '../../edit-button';
import { isDocPage } from '../../../lib/docs';
import { useStore } from '../../store-adapter';

const getContent = route => route.content || route.path;

/**
 * Set `document.title`
 * @param {string} title
 */
export function useTitle(title) {
	useEffect(() => {
		document.title = `${title} | ${config.title}`;
	}, [title]);
}

export function usePage(route) {
	const [loading, setLoading] = useState(false);
	const [meta, setMeta] = useState({});
	const [current, setCurrent] = useState({});

	useEffect(() => {
		setLoading(true);
	}, [getContent(route)]);

	useTitle(meta.title);

	function onLoad({ meta, content }) {
		setLoading(false);

		// Don't show loader forever in case of an error
		if (!meta) {
			return;
		}

		// Many markdown formatters can generate the table of contents
		// automatically. To skip a specific heading the use an html
		// comment at the end of it. Example:
		//
		// ## Some random title <!-- omit in toc -->
		//
		meta.title = meta.title.replace(/\s*<!--.*-->/, '');

		setMeta(meta);
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
	const { url } = useStore(['url']).state;

	const layout = `${meta.layout || 'default'}Layout`;
	const name = getContent(route);

	let hasSidebar = meta.toc !== false && isDocPage(url);
	const canEdit = name != 'index' && name != '404';
	return (
		<div class={cx(style.page, style[layout], hasSidebar && style.withSidebar)}>
			<progress-bar showing={loading} />
			<div class={style.outer}>
				{hasSidebar && <Sidebar />}
				<div class={style.inner}>
					{!loading && canEdit && <EditThisPage />}
					<div class={!loading && canEdit ? style.withEdit : undefined}>
						{name != 'index' && meta.show_title !== false && (
							<h1 class={style.title}>{meta.title || route.title}</h1>
						)}
						<ContentRegion name={name} onLoad={onLoad} />
					</div>
					<Footer />
				</div>
			</div>
		</div>
	);
}
