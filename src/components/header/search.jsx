import { render } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { ErrorBoundary } from 'preact-iso';
import { inertOthers, isVisible, trapTabKey } from '../../lib/inert-others.js';
import style from './style.module.css';
import config from '../../config.json' with { type: 'json' };

const DocSearchStylesURL = new URL(
	'@docsearch/css/dist/style.css',
	import.meta.url
).href;

/** URL of the DocSearch chunk after it failed to load, see `importDocSearch` */
let failedImportURL = '';

/**
 * Imports DocSearch. Browsers cache a failed module fetch (e.g. offline for a
 * moment) for the page's lifetime, so a retry imports the chunk under a fresh
 * URL, taken from the error message (Chromium & Firefox include it).
 *
 * @returns {Promise<typeof import('@docsearch/react')>}
 */
function importDocSearch() {
	const load = failedImportURL
		? import(/* @vite-ignore */ `${failedImportURL}?retry=${Date.now()}`)
		: import('@docsearch/react');
	return load.catch((error) => {
		failedImportURL =
			String(error?.message).match(/https?:\/\/[^\s?#]+\.js/)?.[0] ||
			failedImportURL;
		throw error;
	});
}

/** @type {Promise<void> | null} */
let docsearchCSS = null;

/**
 * Inject Docsearch styles into the document head above app styles,
 * solving some specificity issues w/ Vite's default lazy loading of CSS.
 * Resolves once they've loaded: an unstyled modal would open in the page flow
 * (e.g. behind the mobile menu). A failed load is dropped, so it's retried.
 *
 * @returns {Promise<void>}
 */
function injectDocsearchCSS() {
	if (docsearchCSS) return docsearchCSS;

	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.crossOrigin = '';
	link.href = DocSearchStylesURL;
	docsearchCSS = new Promise((resolve, reject) => {
		link.onload = () => resolve();
		link.onerror = () => {
			link.remove();
			docsearchCSS = null;
			reject(new Error(`Failed to load ${DocSearchStylesURL}`));
		};
	});
	document.head.insertAdjacentElement('afterbegin', link);
	return docsearchCSS;
}

/**
 * Wait for Docsearch to initialize so we can trigger a click if the user
 * interacted with the placeholder button prior to Docsearch fully loading.
 *
 * @param {HTMLElement} root
 * @returns {Promise<HTMLButtonElement>}
 */
function waitForDocsearch(root) {
	return new Promise((resolve) => {
		// `.DocSearch-Button-Keys` isn't part of our placeholder (and is always
		// hidden w/ `display: none`), so it marks the real, initialized button.
		// Scoped to `root` as the header can render more than one search box.
		/** @returns {HTMLButtonElement | null} */
		const getDocSearchButton = () =>
			root
				.querySelector('.DocSearch-Button-Keys')
				?.closest('.DocSearch-Button');

		let target = getDocSearchButton();
		if (target) return resolve(target);

		const observer = new MutationObserver(() => {
			target = getDocSearchButton();
			if (target) {
				observer.disconnect();
				resolve(target);
			}
		});

		observer.observe(root, { childList: true, subtree: true });
	});
}

// Might be a problem with the Algolia data, but it seemingly
// appends `#app` to all URLs without a hash fragment.
//
// It also returns the full prod URL, which isn't ideal for dev/staging
const transformItems = (items) =>
	items.map((i) => {
		// Relative to the site: Algolia hands the same (cached) items back on a
		// repeated query, whose `url` this already made relative
		const url = new URL(i.url, location.origin);
		return Object.assign(i, {
			url: url.pathname + url.hash.replace(/#app$/, '')
		});
	});

// The header renders a single DocSearch instance (it registers global
// keyboard shortcuts, so more than one would open several modals at once).
// `SearchTrigger`s elsewhere, like in the mobile menu, drive it via these.
const LOAD_EVENT = 'docsearch:load';
const OPEN_EVENT = 'docsearch:open';
/** Drops a pending open (see `cancelSearch`) */
const CANCEL_EVENT = 'docsearch:cancel';

/**
 * Cancels an open requested before DocSearch finished loading, e.g. as the
 * mobile menu it was requested from closes or the page changes.
 */
export const cancelSearch = () => dispatchEvent(new Event(CANCEL_EVENT));

/** Placeholder markup that mirrors the DocSearch button */
const PlaceholderContent = () => (
	<span class="DocSearch-Button-Container">
		<span class="DocSearch-Button-Placeholder">Search</span>
	</span>
);

/**
 * A search box that opens the header's DocSearch instance.
 */
export function SearchTrigger() {
	const load = () => dispatchEvent(new Event(LOAD_EVENT));
	return (
		<div class={style.search} lang="en">
			<button
				type="button"
				aria-label="Search"
				class="DocSearch DocSearch-Button"
				onMouseOver={load}
				onTouchStart={load}
				onFocus={load}
				onClick={() => dispatchEvent(new Event(OPEN_EVENT))}
			>
				<PlaceholderContent />
			</button>
		</div>
	);
}

export default function Search() {
	// DocSearch is rendered imperatively into `root`, an element Preact never
	// renders children into, so header re-renders can't create a second
	// instance (each one registers its own Ctrl+K handler & modal).
	const root = useRef(/** @type {HTMLDivElement | null} */ (null));
	// Resolves to the initialized DocSearch button. Reset when loading fails
	// (e.g. a network error), so the next interaction tries again.
	const ready = useRef(/** @type {Promise<HTMLButtonElement> | null} */ (null));
	// A request to open the modal once DocSearch is ready. Cancelled when
	// the user moves on first (Escape, closing the mobile menu, navigating).
	const pendingOpen = useRef(false);
	const [loaded, setLoaded] = useState(false);

	// The <loading-bar> is sat alongside the router & has it's state controlled by it,
	// so while we could create a new context to be able to set it here, direct DOM
	// manipulation is a heck of a lot simpler.
	/** @param {boolean} showing */
	const setLoadingBar = (showing) =>
		document.querySelector('loading-bar')?.toggleAttribute('showing', showing);

	/** @returns {Promise<HTMLButtonElement> | null} */
	const loadDocSearch = () => {
		if (ready.current || !root.current) return ready.current;
		const el = root.current;
		const promise = (ready.current = Promise.all([
			importDocSearch(),
			injectDocsearchCSS()
		]).then(([{ DocSearch }]) => {
			render(
				<ErrorBoundary>
					<DocSearch
						apiKey={config.docsearch.apiKey}
						indexName={config.docsearch.indexName}
						appId={config.docsearch.appId}
						transformItems={transformItems}
					/>
				</ErrorBoundary>,
				el
			);
			return waitForDocsearch(el);
		}));

		promise.then(
			(docsearchButton) => {
				// Keep keyboard focus when the placeholder gets swapped out
				const placeholderFocused =
					document.activeElement?.parentElement === el.parentElement;
				setLoaded(true);
				if (placeholderFocused && !pendingOpen.current) {
					requestAnimationFrame(() => docsearchButton.focus());
				}
				if (!pendingOpen.current) setLoadingBar(false);
			},
			() => {
				// Forget the failed attempt: the next hover/click retries
				ready.current = null;
				pendingOpen.current = false;
				setLoadingBar(false);
			}
		);
		return promise;
	};

	// Opens the modal, loading DocSearch first if needed (e.g. a click or
	// Enter on the placeholder before any hover or focus started loading)
	const open = () => {
		const promise = loadDocSearch();
		if (!promise) return;
		pendingOpen.current = true;
		setLoadingBar(true);
		promise
			.then(() => waitForDocsearch(/** @type {HTMLElement} */ (root.current)))
			.then(
				(button) => {
					if (!pendingOpen.current) return;
					pendingOpen.current = false;
					setLoadingBar(false);
					button.click();
				},
				() => {}
			);
	};

	useEffect(() => {
		// DocSearch doesn't restore focus when its modal closes, which matters
		// most when it was opened from the mobile menu or docs drawer (its own
		// button is hidden there). Track what's focused outside of it, and
		// return focus there once the modal is gone.
		/** @type {HTMLElement | null} */
		let lastFocused = null;
		// Noted up front: the mobile menu it may be in unmounts when widening
		let lastInHeader = false;
		/** @param {FocusEvent} e */
		const onFocusIn = (e) => {
			const target = /** @type {HTMLElement} */ (e.target);
			if (!target.closest?.('.DocSearch-Container')) {
				lastFocused = target;
				lastInHeader = !!target.closest('header');
			}
		};
		// Safari doesn't focus buttons on click, so record clicked search
		// buttons (the opener) explicitly
		/** @param {MouseEvent} e */
		const onClick = (e) => {
			const button = /** @type {HTMLElement} */ (e.target).closest?.(
				'.DocSearch-Button'
			);
			if (button) {
				lastFocused = /** @type {HTMLElement} */ (button);
				lastInHeader = !!button.closest('header');
			}
		};
		// Clicking plain text etc. moves focus to nothing: forget the element,
		// so Ctrl+K + Escape later doesn't jump back to it. Placeholder &
		// menu search buttons are kept: the real DocSearch button (marked by
		// its key hints) replaces the placeholder, which can blur it.
		/** @param {FocusEvent} e */
		const onFocusOut = (e) => {
			if (
				e.relatedTarget === null &&
				e.target === lastFocused &&
				// Not a blur from making the page inert behind the opening modal
				!document.querySelector('.DocSearch-Container') &&
				!(
					lastFocused.matches('.DocSearch-Button') &&
					!lastFocused.querySelector('.DocSearch-Button-Keys')
				)
			) {
				lastFocused = null;
			}
		};
		/** @param {Element} el */
		const isFocusable = (el) =>
			el.isConnected && isVisible(el) && !el.closest('[inert]');

		const restoreFocus = () => {
			const focusLost =
				!document.activeElement || document.activeElement === document.body;
			if (!focusLost || !lastFocused) return;

			let target = isFocusable(lastFocused) ? lastFocused : null;
			// The docs drawer's toggle, hidden by widening past its breakpoint: the
			// current page's link in the now regular sidebar, else its version select
			if (!target && lastFocused.matches('[aria-controls="docs-sidebar"]')) {
				const aside = document.getElementById('docs-sidebar');
				target =
					/** @type {HTMLElement | undefined} */ (
						[
							aside?.querySelector('a[aria-current="page"]'),
							aside?.querySelector('select')
						].find((el) => el && isFocusable(el))
					) ?? null;
			}
			// A sidebar control hidden by narrowing (the sidebar is the closed
			// drawer now): the drawer's toggle
			if (!target && lastFocused.closest('#docs-sidebar')) {
				const toggle = document.querySelector('[aria-controls="docs-sidebar"]');
				target =
					toggle && isFocusable(toggle)
						? /** @type {HTMLElement} */ (toggle)
						: null;
			}
			// A link hidden by a layout change, e.g. "On this page" moving inline:
			// its visible copy
			const href = lastFocused.getAttribute('href');
			if (!target && href) {
				target =
					/** @type {HTMLElement | undefined} */ (
						[...document.querySelectorAll('a[href]')].find(
							(a) => a.getAttribute('href') === href && isFocusable(a)
						)
					) ?? null;
			}
			// A search button that's since been swapped out (the placeholder) or
			// hidden by a resize (the menu's when widening, the header's when
			// narrowing): use the visible one, or else the menu button
			if (!target && lastFocused.matches('.DocSearch-Button')) {
				target =
					/** @type {HTMLElement | undefined} */ (
						[
							...document.querySelectorAll(
								'.DocSearch-Button, button[aria-controls="mobile-navigation"]'
							)
						].find(isFocusable)
					) ?? null;
			}
			// A header control hidden by a resize, like the header does with the
			// menu closed: the menu button when narrowing, else the first link
			if (!target && lastInHeader) {
				target =
					/** @type {HTMLElement | undefined} */ (
						[
							...document.querySelectorAll(
								'header button[aria-controls="mobile-navigation"], header nav a[href]'
							)
						].find(isFocusable)
					) ?? null;
			}
			if (!target) return;
			target.focus({ preventScroll: true });
			// A replacement can be anywhere, e.g. the inline contents far above
			const rect = target.getBoundingClientRect();
			if (rect.bottom < 0 || rect.top > innerHeight) {
				target.scrollIntoView({ block: 'center' });
			}
		};

		/** @param {Node} n */
		const isContainer = (n) =>
			n instanceof Element && n.classList.contains('DocSearch-Container');
		let restoreInert = () => {};
		// The backdrop gets the combobox's root props (`aria-expanded` etc.) & is
		// a focusable `role="button"`: invalid ARIA and an extra, invisible Tab
		// stop. Strip them, also when DocSearch re-renders them (`aria-owns`).
		const BACKDROP_ATTRS = [
			'role',
			'tabindex',
			'aria-expanded',
			'aria-haspopup',
			'aria-labelledby',
			'aria-owns'
		];
		/** @param {Element} el */
		const stripBackdrop = (el) =>
			BACKDROP_ATTRS.forEach((name) => el.removeAttribute(name));
		const backdropObserver = new MutationObserver((records) =>
			records.forEach((r) => stripBackdrop(/** @type {Element} */ (r.target)))
		);
		const observer = new MutationObserver((records) => {
			const added = records.flatMap((r) => [...r.addedNodes]).find(isContainer);
			const closed = records.some((r) => [...r.removedNodes].some(isContainer));
			if (closed) {
				backdropObserver.disconnect();
				restoreInert();
				restoreInert = () => {};
				// After the current event: DocSearch closes on `mousedown` on its
				// backdrop, whose default action would otherwise re-blur our focus
				setTimeout(restoreFocus, 0);
			}
			if (added instanceof Element) {
				// DocSearch's modal has no dialog semantics (its backdrop is a
				// `role="button"`), and leaves the page, incl. an open mobile menu
				// or docs drawer, exposed to assistive tech & Tab: fix both
				stripBackdrop(added);
				backdropObserver.observe(added, {
					attributes: true,
					attributeFilter: BACKDROP_ATTRS
				});
				const modal = added.querySelector('.DocSearch-Modal');
				modal?.setAttribute('role', 'dialog');
				modal?.setAttribute('aria-modal', 'true');
				modal?.setAttribute('aria-label', 'Search');
				// DocSearch's copy isn't translated
				added.setAttribute('lang', 'en');
				restoreInert = inertOthers(added);
			}
		});
		observer.observe(document.body, { childList: true });

		const cancel = () => {
			if (!pendingOpen.current) return;
			pendingOpen.current = false;
			setLoadingBar(false);
		};
		/** @param {KeyboardEvent} e */
		const onKeyDown = (e) => {
			if (e.key === 'Escape') cancel();
			// Keep Tab within the modal, explicitly: e.g. Safari would otherwise
			// skip its Cancel button & move focus out to the inert page. (Not when
			// DocSearch's own trap already wrapped focus around.)
			const modal = document.querySelector('.DocSearch-Modal');
			if (modal && !e.defaultPrevented) trapTabKey(e, modal);
		};

		addEventListener(LOAD_EVENT, loadDocSearch);
		addEventListener(OPEN_EVENT, open);
		addEventListener(CANCEL_EVENT, cancel);
		addEventListener('keydown', onKeyDown);
		addEventListener('focusin', onFocusIn);
		addEventListener('focusout', onFocusOut);
		addEventListener('click', onClick, true);
		return () => {
			removeEventListener(LOAD_EVENT, loadDocSearch);
			removeEventListener(OPEN_EVENT, open);
			removeEventListener(CANCEL_EVENT, cancel);
			removeEventListener('keydown', onKeyDown);
			removeEventListener('focusin', onFocusIn);
			removeEventListener('focusout', onFocusOut);
			removeEventListener('click', onClick, true);
			observer.disconnect();
			backdropObserver.disconnect();
			restoreInert();
		};
	}, []);

	return (
		<div class={style.search} lang="en">
			{!loaded && (
				/* Copy/paste of the HTML DocSearch normally generates, used as a placeholder */
				<button
					type="button"
					aria-label="Search"
					class="DocSearch DocSearch-Button"
					onMouseOver={loadDocSearch}
					onTouchStart={loadDocSearch}
					onFocus={loadDocSearch}
					onClick={open}
				>
					<PlaceholderContent />
				</button>
			)}
			<div ref={root} hidden={!loaded} />
		</div>
	);
}
