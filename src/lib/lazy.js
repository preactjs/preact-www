import { h } from 'preact';
import { lazy as isoLazy } from 'preact-iso';

const RELOADED_AT = 'lazy-chunk-reload';

/**
 * Loads the current URL from the server once, unless that was just tried
 * (so a chunk that's broken for good can't cause a reload loop)
 *
 * @returns {boolean} Whether the page is reloading
 */
function reloadOnce() {
	try {
		const last = Number(sessionStorage.getItem(RELOADED_AT)) || 0;
		if (Date.now() - last < 10_000) return false;
		sessionStorage.setItem(RELOADED_AT, String(Date.now()));
	} catch {
		return false;
	}
	location.reload();
	return true;
}

/**
 * `lazy()` from preact-iso, except that a failed import (e.g. a network
 * hiccup) isn't kept: a failed preload is simply retried later, and a failed
 * import of a component that's being rendered loads the page from the server
 * instead of leaving it blank (browsers also cache failed module imports, so
 * retrying in place wouldn't help).
 *
 * @template T
 * @param {() => Promise<T>} load
 */
export function lazy(load) {
	let rendered = false;
	const create = () =>
		isoLazy(() =>
			load().catch((error) => {
				Lazy = create();
				if (rendered && reloadOnce()) return new Promise(() => {});
				throw error;
			})
		);
	let Lazy = create();

	/** @param {any} props */
	const Component = (props) => {
		rendered = true;
		return h(Lazy, props);
	};
	Component.preload = () => Lazy.preload().catch(() => {});
	// Like preact-iso's: a `ref` is passed on to the loaded component
	Component._forwarded = true;
	return Component;
}
