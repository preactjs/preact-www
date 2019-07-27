import { useEffect, useState } from 'preact/hooks';

/**
 * On mobile devices 100vh refers to the whole viewport **without** the
 * address bar. So when the address bar is visible we receive the wrong
 * height. We try to work around this by measuring the actual height
 * instead of relying on css units alone.
 */
export function useOverlayToggle() {
	const [open, setOpen] = useState(false);

	function onResize() {
		if (open) setHeight();
	}

	useEffect(onResize, [open]);
	useEffect(() => {
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, [open]);

	return [open, setOpen];
}

function setHeight() {
	let vh = window.innerHeight;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
}
