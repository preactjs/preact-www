/**
 * Makes everything on the page except `el` (and its ancestors) inert, for
 * modal UI that isn't a native `<dialog>`.
 *
 * @param {Element} el
 * @returns {() => void} Restores the previous state
 */
export function inertOthers(el) {
	/** @type {Element[]} */
	const changed = [];
	for (let node = el; node.parentElement; node = node.parentElement) {
		for (const sibling of node.parentElement.children) {
			if (
				sibling !== node &&
				!sibling.hasAttribute('inert') &&
				!(sibling instanceof HTMLScriptElement)
			) {
				sibling.setAttribute('inert', '');
				changed.push(sibling);
			}
		}
		if (node.parentElement === document.body) break;
	}
	return () => changed.forEach((n) => n.removeAttribute('inert'));
}

/**
 * Rendered & visible. Unlike `offsetParent !== null`, this is true for
 * `position: fixed` elements, e.g. the docs drawer's toggle button.
 *
 * @param {Element} el
 */
export function isVisible(el) {
	return (
		el.getClientRects().length > 0 &&
		getComputedStyle(el).visibility !== 'hidden'
	);
}

const FOCUSABLE =
	'a[href], button, select, input, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab / Shift+Tab focus cycling within `container`. Every move is made
 * explicitly, rather than left to the browser, as e.g. Safari skips links &
 * buttons when tabbing by default and would otherwise drop focus to `<body>`.
 *
 * @param {KeyboardEvent} e
 * @param {Element} container
 */
export function trapTabKey(e, container) {
	if (e.key !== 'Tab' || e.altKey || e.ctrlKey || e.metaKey) return;
	const focusable = /** @type {HTMLElement[]} */ ([
		...container.querySelectorAll(FOCUSABLE)
	]).filter((el) => isVisible(el) && !el.hasAttribute('disabled'));
	if (!focusable.length) return;

	e.preventDefault();
	const index = focusable.indexOf(
		/** @type {HTMLElement} */ (document.activeElement)
	);
	const next =
		index === -1
			? e.shiftKey
				? focusable.length - 1
				: 0
			: (index + (e.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
	focusable[next].focus();
}
