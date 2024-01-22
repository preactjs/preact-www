import { useEffect, useRef, useState } from 'preact/hooks';

import { getContentOnServer, getContent } from '../../lib/content';
import { getPrerenderData } from '../../lib/prerender-data';
import { createTitle } from '../../lib/page-title';

/**
 * Set `document.title`
 * @param {string} title
 */
export function useTitle(title) {
	useEffect(() => {
		if (title) {
			document.title = createTitle(title);
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

export const getContentId = route => route.content || route.path;
export function usePage(route, lang) {
	// on the server, pass data down through the tree to avoid repeated FS lookups
	if (PRERENDER) {
		const { content, html, meta } = getContentOnServer(route.path, lang);
		return {
			current: getContentId(route),
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
	const [html, setHtml] = useState(hydrated && bootData && bootData.html);

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
				left: 0
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
