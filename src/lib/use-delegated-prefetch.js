import { useEffect } from 'preact/hooks';

import { prefetchContent } from './use-content.js';
import { useLanguageContext } from './i18n.jsx';

/**
 * Warm the content cache on hover/touch.
 *
 * Pracht's general route prefetcher is disabled to avoid shipping its client
 * runtime. Translations are fetched separately, so keep warming only those
 * content requests here; English content loads with its route on navigation.
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
