import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import cx from '../../lib/cx.js';
import { trapTabKey } from '../../lib/inert-others.js';
import { HiddenLabel, useFallbackLang, useTranslate } from '../../lib/i18n.jsx';
import LanguageSelect from '../language-select/index.jsx';
import Search, { SearchTrigger, cancelSearch } from './search.jsx';
import style from './style.module.css';

/**
 * @typedef {{ key: keyof import('../../route-config.js').Translations['headerNav'], href: string, match: (path: string) => boolean }} NavItem
 */

/** @type {NavItem[]} */
const NAV_ITEMS = [
	{
		key: 'learn',
		href: '/tutorial',
		match: (p) => p.startsWith('/tutorial')
	},
	{
		key: 'docs',
		href: '/guide/v11/getting-started',
		match: (p) => p.startsWith('/guide/')
	},
	{
		key: 'about',
		href: '/about/we-are-using',
		match: (p) => p.startsWith('/about/')
	},
	{ key: 'blog', href: '/blog', match: (p) => p.startsWith('/blog') },
	{ key: 'repl', href: '/repl', match: (p) => p.startsWith('/repl') }
];

const SOCIAL_LINKS = [
	{
		label: 'Preact on GitHub',
		href: 'https://github.com/preactjs/preact',
		d: 'M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.06c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.7 2.63 1.21 3.27.92.1-.71.39-1.2.71-1.48-2.48-.28-5.09-1.24-5.09-5.51 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.12-1.44 3.05-1.15 3.05-1.15.61 1.54.23 2.68.12 2.96.71.78 1.14 1.78 1.14 3.01 0 4.28-2.61 5.22-5.1 5.5.4.35.75 1.02.75 2.06V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z'
	},
	{
		label: 'Preact on Bluesky',
		href: 'https://bsky.app/profile/preactjs.com',
		d: 'M5.2 2.6c2.75 2.06 5.72 6.24 6.8 8.49 1.08-2.25 4.05-6.43 6.8-8.49C20.79 1.1 24 .02 24 3.67c0 .73-.42 6.15-.67 7.02-.86 3.04-4 3.82-6.8 3.34 4.9.83 6.14 3.59 3.45 6.35-5.1 5.25-7.33-1.32-7.9-3.01-.1-.31-.15-.46-.28-.46s-.18.15-.28.46c-.57 1.69-2.8 8.26-7.9 3.01-2.69-2.76-1.45-5.52 3.45-6.35-2.8.48-5.94-.3-6.8-3.34C.42 9.82 0 4.4 0 3.67 0 .02 3.21 1.1 5.2 2.6Z'
	},
	{
		label: 'Preact on Twitter',
		href: 'https://twitter.com/preactjs',
		d: 'M23.4 4.8a9.4 9.4 0 0 1-2.77.76 4.84 4.84 0 0 0 2.12-2.67 9.65 9.65 0 0 1-3.06 1.17 4.82 4.82 0 0 0-8.2 4.39A13.68 13.68 0 0 1 1.55 3.42a4.82 4.82 0 0 0 1.49 6.43 4.78 4.78 0 0 1-2.18-.6v.06a4.83 4.83 0 0 0 3.86 4.73 4.83 4.83 0 0 1-2.17.08 4.83 4.83 0 0 0 4.5 3.35A9.68 9.68 0 0 1 0 19.47a13.65 13.65 0 0 0 7.4 2.17c8.88 0 13.74-7.36 13.74-13.74l-.02-.62a9.8 9.8 0 0 0 2.4-2.5Z'
	}
];

// The complement of the CSS `(max-width: 64rem)` breakpoint up to which the
// hamburger menu shows (no gap at fractional widths)
const DESKTOP_QUERY = 'not all and (max-width: 64rem)';

export default function Header() {
	const { url } = useLocation();
	const translate = useTranslate();
	const fallbackLang = useFallbackLang();
	const [open, setOpen] = useState(false);
	const openButton = useRef(/** @type {HTMLButtonElement | null} */ (null));
	const closeButton = useRef(/** @type {HTMLButtonElement | null} */ (null));
	const panel = useRef(/** @type {HTMLDivElement | null} */ (null));
	const banner = useRef(/** @type {HTMLDivElement | null} */ (null));

	// The banner wraps with larger text (or is hidden on short viewports):
	// keep the header offset everything uses in sync with its real height
	useLayoutEffect(() => {
		const el = banner.current;
		if (!el || typeof ResizeObserver == 'undefined') return;
		const root = document.documentElement;
		const observer = new ResizeObserver(() =>
			root.style.setProperty(
				'--banner-height',
				`${el.getBoundingClientRect().height}px`
			)
		);
		observer.observe(el);
		return () => {
			observer.disconnect();
			root.style.removeProperty('--banner-height');
		};
	}, []);
	const wasOpen = useRef(false);
	const inner = useRef(/** @type {HTMLDivElement | null} */ (null));
	/** Where focus goes when widening the viewport closes the menu */
	const desktopFocus = useRef(/** @type {HTMLElement | null} */ (null));

	useEffect(() => {
		setOpen(false);
		// A search requested on the previous page mustn't open on this one
		cancelSearch();
	}, [url]);

	// Crossing the breakpoint with the menu closed can hide the focused
	// control: the menu button when widening, a desktop-only one (nav link,
	// search, social link) when narrowing. Move focus to its counterpart.
	useEffect(() => {
		if (open) return;
		const desktop = matchMedia(DESKTOP_QUERY);
		const onChange = () => {
			// Noted now: browsers blur it (to <body>) once it's hidden, and only
			// after the next frame's style update, so check after that (and once
			// more later, in case that frame came late)
			const active = document.activeElement;
			const check = () => {
				const root = inner.current;
				if (
					!(active instanceof HTMLElement) ||
					!root?.contains(active) ||
					active.getClientRects().length ||
					(document.activeElement !== active &&
						document.activeElement !== document.body)
				) {
					return;
				}
				if (desktop.matches) {
					/** @type {HTMLElement | null} */ (
						root.querySelector('nav a[href]')
					)?.focus();
				} else {
					openButton.current?.focus();
				}
			};
			requestAnimationFrame(() => setTimeout(check));
			setTimeout(check, 300);
		};
		desktop.addEventListener('change', onChange);
		return () => desktop.removeEventListener('change', onChange);
	}, [open]);

	// Treat the mobile menu as a modal dialog: move focus into it, make the
	// rest of the page inert, keep Tab inside it, close on Escape (or once the
	// viewport is wide enough for the desktop nav) and restore focus afterwards.
	useEffect(() => {
		const main = document.querySelector('#app > main');
		if (open) {
			wasOpen.current = true;
			main?.setAttribute('inert', '');
			closeButton.current?.focus();

			/** @param {KeyboardEvent} e */
			const onKeyDown = (e) => {
				// DocSearch, opened from within the menu, handles its own keys
				if (document.querySelector('.DocSearch-Modal')) return;
				if (e.key === 'Escape') {
					setOpen(false);
				} else if (panel.current) {
					trapTabKey(e, panel.current);
				}
			};
			const desktop = matchMedia(DESKTOP_QUERY);
			const onResize = () => {
				if (!desktop.matches) return;
				// Focus in the menu moves to its desktop counterpart (e.g. the Docs
				// link or the search button), else to the first header link. (Not
				// when it's elsewhere, like in the DocSearch modal opened from here.)
				const active = document.activeElement;
				const root = inner.current;
				desktopFocus.current = null;
				if (root && active && panel.current?.contains(active)) {
					const href = active.closest('a')?.getAttribute('href');
					desktopFocus.current =
						[...root.querySelectorAll('a[href]')].find(
							(a) => a.getAttribute('href') === href
						) ||
						(active.matches('.DocSearch-Button') &&
							root.querySelector('.DocSearch-Button')) ||
						root.querySelector('a[href]');
				}
				setOpen(false);
			};
			addEventListener('keydown', onKeyDown);
			desktop.addEventListener('change', onResize);
			return () => {
				removeEventListener('keydown', onKeyDown);
				desktop.removeEventListener('change', onResize);
				main?.removeAttribute('inert');
			};
		}
		if (wasOpen.current) {
			wasOpen.current = false;
			// Nor one requested from the menu, now that it's closed
			cancelSearch();
			// The open button is hidden if the menu closed by widening the viewport
			if (openButton.current?.offsetParent) openButton.current.focus();
			else desktopFocus.current?.focus();
			desktopFocus.current = null;
		}
	}, [open]);

	return (
		<header class={style.header}>
			<div ref={banner} class={style.banner} lang="en" inert={open}>
				<a href="https://u24.gov.ua/">
					We stand with Ukraine. <b>Show your support</b> 🇺🇦
				</a>
			</div>
			<div ref={inner} class={style.inner} inert={open}>
				<div class={style.left}>
					<Brand />
					<nav class={style.nav} aria-labelledby="main-nav-label">
						<HiddenLabel
							id="main-nav-label"
							namespace="i18n"
							k="mainNavigation"
						/>
						<NavList />
					</nav>
				</div>
				<div class={style.right}>
					<div class={style.desktopOnly}>
						<Search />
					</div>
					<SocialLinks class={style.desktopOnly} />
					<button
						ref={openButton}
						type="button"
						class={cx(style.iconButton, style.mobileOnly)}
						onClick={() => setOpen(true)}
						aria-label={translate('i18n', 'openMenu')}
						lang={fallbackLang('i18n', 'openMenu')}
						aria-expanded={open}
						aria-controls="mobile-navigation"
					>
						<MenuIcon />
					</button>
				</div>
			</div>
			{open && (
				<div
					ref={panel}
					id="mobile-navigation"
					class={style.mobilePanel}
					role="dialog"
					aria-modal="true"
					aria-labelledby="mobile-nav-label"
					style={{ '--menu-scroll': `${scrollY}px` }}
				>
					<HiddenLabel
						id="mobile-nav-label"
						namespace="i18n"
						k="mainNavigation"
					/>
					<div class={style.mobileTop}>
						{/* Also closes the menu when already on the home page */}
						<Brand onClick={() => setOpen(false)} />
						<button
							ref={closeButton}
							type="button"
							class={style.iconButton}
							onClick={() => setOpen(false)}
							aria-label={translate('i18n', 'closeMenu')}
							lang={fallbackLang('i18n', 'closeMenu')}
						>
							<CloseIcon />
						</button>
					</div>
					<nav class={style.mobileNav} aria-labelledby="mobile-nav-label">
						<NavList mobile onNavigate={() => setOpen(false)} />
					</nav>
					<SearchTrigger />
					<LanguageSelect class={style.mobileLang} />
					<SocialLinks />
				</div>
			)}
		</header>
	);
}

/** @param {{ onClick?: () => void }} props */
function Brand({ onClick }) {
	const { route } = useLocation();
	const translate = useTranslate();
	const fallbackLang = useFallbackLang();

	/** @param {MouseEvent} e */
	const brandingRedirect = (e) => {
		e.preventDefault();
		route('/branding');
	};

	return (
		<a
			href="/"
			class={style.brand}
			aria-label={translate('headerNav', 'home')}
			lang={fallbackLang('headerNav', 'home')}
			onClick={onClick}
			onContextMenu={brandingRedirect}
		>
			<img
				src="/branding/symbol.svg"
				alt=""
				aria-hidden="true"
				width="32"
				height="32"
			/>
			<span>PREACT</span>
		</a>
	);
}

/** @param {{ mobile?: boolean, onNavigate?: () => void }} props */
function NavList({ mobile, onNavigate }) {
	const { path } = useLocation();
	const translate = useTranslate();
	const fallbackLang = useFallbackLang();

	return (
		<ul class={mobile ? style.mobileList : style.list}>
			{NAV_ITEMS.map(({ key, href, match }) => (
				<li key={key}>
					<a
						href={href}
						lang={fallbackLang('headerNav', key)}
						class={cx(match(path) && style.current)}
						// "page" only on the page it links to; elsewhere in its section
						// it's the current item of the set
						aria-current={
							match(path)
								? path.replace(/(.)\/$/, '$1') === href
									? 'page'
									: 'true'
								: undefined
						}
						onClick={onNavigate}
					>
						<span class={style.slash} aria-hidden="true">
							/{mobile ? '' : ' '}
						</span>
						{translate('headerNav', key)}
					</a>
				</li>
			))}
		</ul>
	);
}

/** @param {{ class?: string }} props */
function SocialLinks(props) {
	const translate = useTranslate();
	const fallbackLang = useFallbackLang();
	return (
		<ul
			class={cx(style.social, props.class)}
			aria-label={translate('i18n', 'socialLinks')}
			lang={fallbackLang('i18n', 'socialLinks')}
		>
			{SOCIAL_LINKS.map(({ label, href, d }) => (
				<li key={label}>
					<a
						class={style.iconButton}
						href={href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={label}
						lang="en"
					>
						<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
							<path fill="currentColor" d={d} />
						</svg>
					</a>
				</li>
			))}
		</ul>
	);
}

const MenuIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		aria-hidden="true"
	>
		<path d="M4 5h16" />
		<path d="M4 12h16" />
		<path d="M4 19h16" />
	</svg>
);

const CloseIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		aria-hidden="true"
	>
		<path d="M18 6 6 18" />
		<path d="m6 6 12 12" />
	</svg>
);
