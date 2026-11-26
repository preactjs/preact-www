import { useEffect, useState } from 'preact/hooks';

const QUERY = '(prefers-reduced-motion: reduce)';

/** One-off check, for use inside effects & event handlers */
export const prefersReducedMotion = () => matchMedia(QUERY).matches;

/**
 * Tracks the user's `prefers-reduced-motion` setting. Always `false` during
 * prerendering and the first client render so hydration output matches.
 */
export function useReducedMotion() {
	const [reduced, setReduced] = useState(false);

	useEffect(() => {
		const mql = matchMedia(QUERY);
		const update = () => setReduced(mql.matches);
		update();
		mql.addEventListener('change', update);
		return () => mql.removeEventListener('change', update);
	}, []);

	return reduced;
}
