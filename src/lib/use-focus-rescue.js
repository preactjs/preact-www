import { useEffect } from 'preact/hooks';
import { isVisible } from './inert-others.js';

/**
 * Resizing can hide the focused element, e.g. one of the two layouts' copies
 * of a link (like the "On this page" column vs. the inline contents) or a
 * toolbar control that moves into the menu. Browsers then drop focus to
 * <body>. Once resizing settles, move it to a visible counterpart: a link
 * with the same `href`, else whatever a `data-focus-fallback` selector on the
 * element (or an ancestor) names.
 *
 * Specific handlers (header menu, docs sidebar) run first; this only steps
 * in if focus is still lost.
 */
export function useFocusRescue() {
	useEffect(() => {
		/** @type {HTMLElement | null} */
		let last = null;
		let timer;

		const rescue = () => {
			const el = last;
			const active = document.activeElement;
			if (
				!el ||
				!el.isConnected ||
				isVisible(el) ||
				(active && active !== document.body && active !== el)
			) {
				return;
			}
			const href = el.getAttribute('href');
			/** @type {Element[]} */
			const candidates = href
				? [...document.querySelectorAll('a[href]')].filter(
						(a) => a.getAttribute('href') === href
					)
				: [];
			const fallback = el
				.closest('[data-focus-fallback]')
				?.getAttribute('data-focus-fallback');
			if (fallback) candidates.push(...document.querySelectorAll(fallback));
			const target = /** @type {HTMLElement | undefined} */ (
				candidates.find(
					(c) => c !== el && isVisible(c) && !c.closest('[inert]')
				)
			);
			target?.focus();
		};

		// The last focused element. Kept when it loses focus by being hidden
		// (some browsers blur it before the resize event fires), forgotten when
		// focus is deliberately dropped (e.g. a click on plain text)
		/** @param {FocusEvent} e */
		const onFocusIn = (e) => {
			if (e.target instanceof HTMLElement) last = e.target;
		};
		/** @param {FocusEvent} e */
		const onFocusOut = (e) => {
			if (
				!e.relatedTarget &&
				e.target === last &&
				last instanceof HTMLElement &&
				isVisible(last)
			) {
				last = null;
			}
		};
		const onResize = () => {
			clearTimeout(timer);
			timer = setTimeout(rescue, 350);
		};

		addEventListener('resize', onResize);
		addEventListener('focusin', onFocusIn);
		addEventListener('focusout', onFocusOut);
		return () => {
			removeEventListener('resize', onResize);
			removeEventListener('focusin', onFocusIn);
			removeEventListener('focusout', onFocusOut);
			clearTimeout(timer);
		};
	}, []);
}
