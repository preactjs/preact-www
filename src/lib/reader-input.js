import { useLayoutEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';

// Whether the reader has done anything since a navigation, so a scroll or
// focus change scheduled for its page (e.g. once its content has loaded)
// doesn't override what they did in the meantime

let navigation = { path: '', at: 0 };

/** @type {{ __readerInput?: number }} */
const store = typeof window === 'object' ? /** @type {any} */ (window) : {};
// Normally already recorded by a script in index.html, also before the app
// has loaded (e.g. scrolling the prerendered page)
if (
	store.__readerInput === undefined &&
	typeof addEventListener === 'function'
) {
	store.__readerInput = -1;
	for (const type of ['pointerdown', 'keydown', 'wheel', 'touchstart']) {
		addEventListener(type, () => (store.__readerInput = performance.now()), {
			capture: true,
			passive: true
		});
	}
}

/** @param {number} since A `performance.now()` time */
export const hasInputSince = (since) => (store.__readerInput ?? -1) > since;

export const hasInputSinceNavigation = () => hasInputSince(navigation.at);

/**
 * Notes the time of each in-app navigation to another page (the page load
 * counts as `0`), not of query changes like dropping `?lang=`
 */
export function useNavigationTime() {
	const { path } = useLocation();
	useLayoutEffect(() => {
		if (path === navigation.path) return;
		navigation = { path, at: navigation.path ? performance.now() : 0 };
	}, [path]);
}
