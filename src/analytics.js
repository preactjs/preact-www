import { useEffect, useRef } from 'preact/hooks';
import { useLocation } from '@pracht/core';

if (typeof window !== 'undefined') {
	const ga = (window.ga =
		window.ga || ((...args) => (ga.q = ga.q || []).push(args)));

	setTimeout(() => {
		ga('create', 'UA-6031694-20', 'auto');
		ga('set', 'transport', 'beacon');
		ga('send', 'pageview');
	});
}

/**
 * Report client-side navigations to Google Analytics.
 *
 * The initial load is already counted by the `ga('send', 'pageview')` above, so
 * this only fires once the reader moves to a different page. The old router
 * drove it through `<Router onRouteChange>`, which behaved the same way: keyed
 * on the pathname, so query-only changes (the REPL rewriting `?code=`) are not
 * counted as views.
 */
export function useAnalytics() {
	const { pathname, search } = useLocation();
	const reported = useRef(pathname);

	useEffect(() => {
		if (reported.current === pathname) return;
		reported.current = pathname;

		// @ts-ignore - `ga` is installed above and by the analytics.js script
		if (typeof ga === 'function') ga('send', 'pageview', pathname + search);
	}, [pathname, search]);
}
