import { useEffect } from 'preact/hooks';

import { prefetchContent } from './use-content.js';
import { useLanguageContext } from './i18n.jsx';

/**
 * Warm the content cache on hover/touch.
 *
 * pracht already prefetches route chunks and loader data for links it owns, and
 * for English readers the loader payload *is* the content. Translations are
 * still fetched separately, though, so those are what we prefetch here.
 */
export function useDelegatedPrefetch() {
	const { lang } = useLanguageContext();

	useEffect(() => {
		if (lang === 'en') return;

		const prefetch = e => {
			if (e.target.tagName !== 'A') return;
			if (!e.target.href?.startsWith(location.origin)) return;

			prefetchContent(new URL(e.target.href).pathname);
		};

		addEventListener('mouseover', prefetch);
		addEventListener('touchstart', prefetch);

		return () => {
			removeEventListener('mouseover', prefetch);
			removeEventListener('touchstart', prefetch);
		};
	}, [lang]);
}
