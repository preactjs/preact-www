import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { lazy as isoLazy } from 'preact-iso';

/** @param {string} str */
const hash = (str) => {
	let n = 0;
	for (let i = 0; i < str.length; i++) {
		n = (Math.imul(31, n) + str.charCodeAt(i)) | 0;
	}
	return (n >>> 0).toString(36);
};

/**
 * Loads the current URL from the server, unless that was already tried for
 * `key` (so a chunk that's broken for good can't cause a reload loop)
 *
 * @param {string} key
 * @returns {boolean} Whether the page is reloading
 */
function reloadOnce(key) {
	try {
		if (sessionStorage.getItem(key)) return false;
		sessionStorage.setItem(key, '1');
	} catch {
		return false;
	}
	location.reload();
	return true;
}

let fullPageNavigation = false;

/**
 * Shown when even loading the page from the server didn't help. Once it's
 * shown, links and Back/Forward load pages from the server, as Preact may have
 * kept the prerendered markup it couldn't hydrate (which the next in-app page
 * would render next to).
 */
function LoadFailed() {
	useEffect(() => {
		if (fullPageNavigation) return;
		fullPageNavigation = true;
		addEventListener(
			'click',
			(e) => {
				const link =
					e.target instanceof Element ? e.target.closest('a[href]') : null;
				if (
					!(link instanceof HTMLAnchorElement) ||
					link.origin !== location.origin ||
					link.target ||
					e.button !== 0 ||
					e.metaKey ||
					e.ctrlKey ||
					e.shiftKey ||
					e.altKey
				) {
					return;
				}
				e.preventDefault();
				e.stopImmediatePropagation();
				location.assign(link.href);
			},
			true
		);
		addEventListener('popstate', () => location.reload());
	}, []);
	return h(
		'p',
		{ lang: 'en', style: { padding: '2rem 1rem', textAlign: 'center' } },
		"This part of the page couldn't be loaded. ",
		h(
			'button',
			{ type: 'button', class: 'btn-small', onClick: () => location.reload() },
			'Reload'
		)
	);
}

/**
 * `lazy()` from preact-iso, but recovering from a failed import (e.g. a
 * network hiccup, for the JS chunk or its CSS). Browsers and Vite's preload
 * helper keep such failures around, so it isn't retried in place: the page
 * is loaded from the server instead, once per chunk, either right away when
 * it's still the one that needed the component, or else the next time it's
 * rendered (e.g. after a failed hover preload). If that was tried already, it
 * shows `LoadFailed` (rather than suspending forever, which would also keep
 * the router from rendering any other page).
 *
 * @template T
 * @param {() => Promise<T>} load
 */
export function lazy(load) {
	// The built import names the chunk's hashed file, so this is per build
	const key = `lazy-reload:${hash(String(load))}`;
	let failed = false;
	/** The URL of the page that rendered it while it was loading */
	let neededBy = '';

	const Lazy = isoLazy(() =>
		load().then(
			(module) => {
				try {
					sessionStorage.removeItem(key);
				} catch {}
				return module;
			},
			(error) => {
				// Prerendering: fail the build
				if (typeof location == 'undefined') throw error;
				failed = true;
				if (neededBy === location.href && reloadOnce(key)) {
					return new Promise(() => {});
				}
				return { default: LoadFailed };
			}
		)
	);

	/** @param {any} props */
	const Component = (props) => {
		if (typeof location != 'undefined') {
			if (failed) return reloadOnce(key) ? null : h(LoadFailed, null);
			neededBy = location.href;
		}
		return h(Lazy, props);
	};
	Component.preload = () => Lazy.preload().catch(() => {});
	// Like preact-iso's: a `ref` is passed on to the loaded component
	Component._forwarded = true;
	return Component;
}
