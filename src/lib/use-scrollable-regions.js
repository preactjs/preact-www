import { useEffect } from 'preact/hooks';

/**
 * Horizontally scrolling regions (wide tables, long code lines) inside `ref`:
 * make the ones that actually overflow keyboard accessible, i.e. focusable &
 * scrollable with the arrow keys (which not every browser does for focused
 * scroll containers).
 *
 * @param {import('preact').RefObject<HTMLElement>} ref
 * @param {string} selector The scroll containers, e.g. `'table, pre'`
 * @param {unknown} content Re-scans whenever this changes
 */
export function useScrollableRegions(ref, selector, content) {
	useEffect(() => {
		const el = ref.current;
		if (!el || typeof ResizeObserver === 'undefined') return;

		const regions = () =>
			/** @type {HTMLElement[]} */ ([
				...(el.matches(selector) ? [el] : []),
				...el.querySelectorAll(selector)
			]);
		const update = () => {
			for (const region of regions()) {
				if (region.scrollWidth > region.clientWidth + 1) {
					region.setAttribute('tabindex', '0');
				} else {
					region.removeAttribute('tabindex');
				}
			}
		};
		/** @param {KeyboardEvent} e */
		const onKeyDown = (e) => {
			const region = /** @type {HTMLElement} */ (e.target);
			if (!region.matches(selector) || !region.hasAttribute('tabindex')) return;
			// Leave shortcuts like Alt+← / Cmd+← (history back) alone
			if (e.altKey || e.ctrlKey || e.metaKey) return;
			const step = { ArrowLeft: -40, ArrowRight: 40 }[e.key];
			if (step) {
				e.preventDefault();
				region.scrollBy({ left: step });
			}
		};

		update();
		// Observe the regions themselves, e.g. `<content-region>` is inline
		const observer = new ResizeObserver(update);
		for (const region of regions()) observer.observe(region);
		el.addEventListener('keydown', onKeyDown);
		return () => {
			observer.disconnect();
			el.removeEventListener('keydown', onKeyDown);
		};
	}, [content]);
}
