import { useEffect, useState } from 'preact/hooks';

/**
 * On mobile devices 100vh refers to the whole viewport **without** the
 * address bar. So when the address bar is visible we receive the wrong
 * height. We try to work around this by measuring the actual height
 * instead of relying on css units alone.
 */
export function useOverlayToggle() {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (open) setHeight();

		function onResize() {
			if (open) {
				// If we open the mobile menu on mobile and resize to a
				// desktop breakpoint, we need to clear the "open" state
				if (window.innerWidth >= convertRemToPixels(50)) {
					setOpen(false);
				}
				setHeight();
			}
		}
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, [open]);

	return [open, setOpen];
}

function setHeight() {
	let vh = window.innerHeight;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function convertRemToPixels(rem) {
	return rem * Number(getComputedStyle(document.documentElement).fontSize);
}
