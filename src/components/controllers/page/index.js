import { h } from 'preact';
import cx from '../../../lib/cx';
import ContentRegion from '../../content-region';
import config from '../../../config';
import style from './style';
import Toc from './table-of-content';
import { useEffect, useState, useCallback } from 'preact/hooks';

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
	const [toc, setToc] = useState([]);
	const onToc = useCallback(v => setToc(v.toc || []));

	const layout = `${meta.layout || 'default'}Layout`;
	const name = getContent(route);

	let hasToc = meta.toc !== false && toc.length > 0;
	return (
		<div class={cx(style.page, style[layout], hasToc && style.withToc)}>
			<progress-bar showing={loading} />
			{name != 'index' && meta.show_title !== false && (
				<h1 class={style.title}>{meta.title || route.title}</h1>
			)}
			{hasToc && <Toc items={toc} />}
			<div class={style.inner}>
				<ContentRegion name={name} onToc={onToc} onLoad={onLoad} />
			</div>
		</div>
	);
}
