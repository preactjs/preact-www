import { useEffect, useLayoutEffect, useRef } from 'preact/hooks';
import { useRoute } from 'preact-iso';
import { inertOthers, isVisible, trapTabKey } from '../../lib/inert-others.js';
import DocVersion from '../doc-version/index.jsx';
import SidebarNav from './sidebar-nav.jsx';
import { DESKTOP_QUERY, useOverlayToggle } from '../../lib/toggle-overlay.js';
import {
	HiddenLabel,
	useFallbackLang,
	useLanguageContext,
	useTranslate
} from '../../lib/i18n.jsx';
import { docPages } from '../../route-config.js';
import style from './style.module.css';

export default function Sidebar() {
	const route = useRoute();
	const { version } = /** @type {{ version: 'v8' | 'v10' | 'v11' }} */ (
		route.params
	);
	const wrapper = useRef(/** @type {HTMLDivElement | null} */ (null));
	const toggle = useRef(/** @type {HTMLButtonElement | null} */ (null));
	const aside = useRef(/** @type {HTMLElement | null} */ (null));
	// Widening past the breakpoint hides the drawer's toggle: focus the
	// current page's link in the (now regular) sidebar, else its version select
	const getDesktopFocus = () =>
		/** @type {HTMLElement | null | undefined} */ (
			aside.current?.querySelector('a[aria-current="page"]') ??
				aside.current?.querySelector('select')
		);
	const [open, setOpen] = useOverlayToggle(getDesktopFocus);

	// Crossing the breakpoint with the drawer closed can hide the focused
	// control too: the toggle when widening, the sidebar (now the closed
	// drawer) when narrowing. Move focus to the visible counterpart.
	useEffect(() => {
		if (open) return;
		const desktop = matchMedia(DESKTOP_QUERY);
		const onChange = () => {
			// Noted now: browsers blur it (to <body>) once it's hidden, and only
			// after the next frame's style update (or, narrowing, after the closed
			// drawer's visibility transition), so check after those
			const active = document.activeElement;
			const check = () => {
				if (
					!(active instanceof HTMLElement) ||
					isVisible(active) ||
					(document.activeElement !== active &&
						document.activeElement !== document.body)
				) {
					return;
				}
				if (active === toggle.current) getDesktopFocus()?.focus();
				else if (aside.current?.contains(active)) toggle.current?.focus();
			};
			requestAnimationFrame(() => setTimeout(check));
			setTimeout(check, 300);
		};
		desktop.addEventListener('change', onChange);
		return () => desktop.removeEventListener('change', onChange);
	}, [open]);
	const translate = useTranslate();
	const fallbackLang = useFallbackLang();
	const { translations } = useLanguageContext();
	const wasOpen = useRef(false);

	// The closing drawer stays visible while it fades out: keep Tab from
	// reaching into it (focus would drop to <body> once it's hidden). A layout
	// effect, so it's in place before the next key press.
	useLayoutEffect(() => {
		const el = aside.current;
		if (open) {
			wasOpen.current = true;
			return;
		}
		if (!wasOpen.current || !el) return;
		wasOpen.current = false;
		// Closed by widening past the breakpoint: it's the regular (visible)
		// sidebar now, with nothing fading out, so keep it usable & focused
		if (matchMedia(DESKTOP_QUERY).matches) return;
		// Back in its in-flow spot (it was pinned over the drawer): keep the
		// focused toggle in view
		if (document.activeElement === toggle.current) {
			toggle.current.scrollIntoView({ block: 'nearest' });
		}
		el.inert = true;
		const timer = setTimeout(() => (el.inert = false), 250);
		return () => {
			clearTimeout(timer);
			el.inert = false;
		};
	}, [open]);

	// On small screens the open sidebar is a full-screen modal drawer: move
	// focus into it, make the rest of the page inert, keep Tab within it
	// (and its toggle) and close on Escape.
	useEffect(() => {
		const el = wrapper.current;
		if (!open || !el) return;
		const restore = inertOthers(el);
		// The page behind the full-screen drawer doesn't scroll (e.g. via
		// Page Down from the pinned toggle)
		const root = document.documentElement;
		const overflow = root.style.overflow;
		root.style.overflow = 'hidden';
		/** @type {HTMLElement | null} */ (
			el.querySelector('aside select, aside a[href]')
		)?.focus();

		/** @param {KeyboardEvent} e */
		const onKeyDown = (e) => {
			// DocSearch (e.g. via Ctrl+K) sits on top and handles its own keys
			if (document.querySelector('.DocSearch-Modal')) return;
			if (e.key === 'Escape') {
				setOpen(false);
				toggle.current?.focus();
			} else {
				trapTabKey(e, el);
			}
		};
		addEventListener('keydown', onKeyDown);
		return () => {
			removeEventListener('keydown', onKeyDown);
			root.style.overflow = overflow;
			restore();
		};
	}, [open]);

	// Any other navigation (e.g. browser Back) closes it too, rather than
	// changing the page under the modal drawer. Focus inside it would be lost
	// once it's hidden: move it to the toggle.
	useEffect(() => {
		if (!open) return;
		const inside = aside.current?.contains(document.activeElement);
		setOpen(false);
		if (inside) toggle.current?.focus({ preventScroll: true });
	}, [route.path]);

	// Picking a page closes the drawer, hiding the focused link: move focus to
	// the toggle, the closest visible control (just before the article)
	const closeFromLink = () => {
		if (!open) return;
		setOpen(false);
		toggle.current?.focus({ preventScroll: true });
	};

	const navItems = [];
	for (const item in docPages[version]) {
		if (version == 'v8') {
			navItems.push({
				text: translate('sidebarNav', docPages[version][item]),
				level: 2,
				href: `/guide/${version}${item}`
			});
		} else {
			navItems.push({
				text: translate(
					'sidebarSections',
					/** @type {keyof typeof docPages.v10 | keyof typeof docPages.v11} */ (
						item
					)
				),
				level: 2,
				href: null,
				routes: Object.entries(docPages[version][item]).map(
					([pagePath, label]) => ({
						text: translate('sidebarNav', label),
						level: 3,
						href: `/guide/${version}${pagePath}`
					})
				)
			});
		}
	}

	return (
		<div
			class={style.wrapper}
			data-open={open}
			ref={wrapper}
			// Only ever open on small screens, where it's a full-screen modal
			role={open ? 'dialog' : undefined}
			aria-modal={open ? 'true' : undefined}
			// Not `aria-label`: the name may be an English fallback, the
			// content inside is translated
			aria-labelledby={open ? 'docs-drawer-label' : undefined}
		>
			<HiddenLabel
				id="docs-drawer-label"
				namespace="i18n"
				k="mobileGuideButton"
			/>
			<button
				ref={toggle}
				type="button"
				class={style.toggle}
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				aria-controls="docs-sidebar"
			>
				{/* Pinned below the open drawer, it's the dialog's close button: say
				    so visibly, so the visible label and accessible name match */}
				{open ? (
					<span lang={translations.i18n?.closeGuide ? undefined : 'en'}>
						{translate('i18n', 'closeGuide')}
					</span>
				) : (
					<span lang={fallbackLang('i18n', 'mobileGuideButton')}>
						{translate('i18n', 'mobileGuideButton')}
					</span>
				)}
			</button>
			<aside
				ref={aside}
				id="docs-sidebar"
				class={style.sidebar}
				aria-labelledby="docs-sidebar-label"
			>
				<HiddenLabel id="docs-sidebar-label" namespace="headerNav" k="docs" />
				<div class={style.sidebarInner}>
					<DocVersion />
					<SidebarNav items={navItems} onClick={closeFromLink} />
				</div>
			</aside>
		</div>
	);
}
