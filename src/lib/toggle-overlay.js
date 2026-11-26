import { useEffect, useState } from 'preact/hooks';

/** Matches `--sidebar-break` in the sidebar CSS, above which it's no overlay */
export const DESKTOP_QUERY = '(min-width: 900px)';

/**
 * Open state for the docs sidebar overlay, which closes itself once the
 * viewport is wide enough for the regular sidebar (e.g. a rotated tablet).
 *
 * @param {() => HTMLElement | null | undefined} [getDesktopFocus] Where focus
 * goes if it was on a drawer control the desktop layout hides
 */
export function useOverlayToggle(getDesktopFocus) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (!open) return;
		const desktop = matchMedia(DESKTOP_QUERY);
		if (desktop.matches) {
			setOpen(false);
			return;
		}

		const onChange = () => {
			if (!desktop.matches) return;
			setOpen(false);
			// Don't leave focus on a drawer control the new layout hides
			requestAnimationFrame(() => {
				const active = document.activeElement;
				if (active instanceof HTMLElement && !active.getClientRects().length) {
					const target = getDesktopFocus?.();
					if (target) target.focus();
					else active.blur();
				}
			});
		};
		desktop.addEventListener('change', onChange);
		return () => desktop.removeEventListener('change', onChange);
	}, [open]);

	return /** @type {const} */ ([open, setOpen]);
}
