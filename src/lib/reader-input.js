import { useLayoutEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';

// Whether the reader has done anything since a navigation, so a scroll or
// focus change scheduled for its page (e.g. once its content has loaded)
// doesn't override what they did in the meantime

let lastInput = -1;
let navigation = { url: '', at: 0 };

if (typeof addEventListener === 'function') {
	for (const type of ['pointerdown', 'keydown', 'wheel', 'touchstart']) {
		addEventListener(type, () => (lastInput = performance.now()), {
			capture: true,
			passive: true
		});
	}
}

/** @param {number} since A `performance.now()` time */
export const hasInputSince = (since) => lastInput > since;

export const hasInputSinceNavigation = () => hasInputSince(navigation.at);

/** Notes the time of each in-app navigation (the page load counts as `0`) */
export function useNavigationTime() {
	const { url } = useLocation();
	useLayoutEffect(() => {
		if (url === navigation.url) return;
		navigation = { url, at: navigation.url ? performance.now() : 0 };
	}, [url]);
}
