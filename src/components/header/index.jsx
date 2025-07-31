import cx from '../../lib/cx';
import { InvertedLogo } from '../logo';
import Search from './search';
import style from './style.module.css';
import * as appConfig from '../../app-config.js';
import { useCallback, useEffect, useState } from 'preact/hooks';
import ReleaseLink from './gh-version';
import Corner from './corner';
import { useOverlayToggle } from '../../lib/toggle-overlay';
import { useLocation } from 'preact-iso';
import { useLanguage } from '../../lib/i18n';
import { prefetchContent } from '../../lib/use-content';
import { ReplPage, TutorialPage, CodeEditor } from '../routes';

export default function Header() {
	const { url, route } = useLocation();
	const [lang, setLang] = useLanguage();
	//const { headerLinks } = useTranslation();
	const [open, setOpen] = useOverlayToggle();
	const toggle = useCallback(() => setOpen(!open), [open]);

	useEffect(() => {
		if (open) setOpen(false);
	}, [url]);

	const brandingRedirect = e => {
		e.preventDefault();
		route('/branding');
	};

	return (
		<header class={cx(style.header, open && style.open)}>
			<div class={style.banner}>
				<a href="https://www.stopputin.net/">
					We stand with Ukraine. <b>Show your support</b> 🇺🇦
				</a>
			</div>
			<div class={style.outer}>
				<div class={style.inner}>
					<nav class={style.nav}>
						<NavLink
							href="/"
							label="Preact"
							clsx="home"
							onContextMenu={brandingRedirect}
							aria-label="Home"
						/>
						<NavLink href="/tutorial" label="Tutorial" />
						<NavLink href="/guide/v10/getting-started" label="Guide" />
						<Menu>
							{isOpen => (
								<ExpandableNavLink isOpen={isOpen} label="About">
									<>
										<NavLink
											href="/about/we-are-using"
											label="Companies using Preact"
										/>
										<NavLink
											href="/about/libraries-addons"
											label="Libraries & Addons"
										/>
										<NavLink
											href="/about/demos-examples"
											label="Demos & Examples"
										/>
										<NavLink
											href="/about/project-goals"
											label="Project Goals"
										/>
										<NavLink
											href="/about/browser-support"
											label="Browser Support"
										/>
									</>
								</ExpandableNavLink>
							)}
						</Menu>
						<NavLink href="/blog" label="Blog" />
						<NavLink href="/repl" label="REPL" />
					</nav>
					<Search />
					<div class={style.social}>
						<ReleaseLink class={cx(style.socialItem, style.release)} />
						<SocialIcon
							label="Browse the code on GitHub"
							href="https://github.com/preactjs/preact"
							viewbox="0 0 24 24"
							id="github"
						/>
						<SocialIcon
							label="Follow us on Twitter"
							href="https://twitter.com/preactjs"
							viewbox="0 0 34 27.646"
							id="twitter"
						/>
						<SocialIcon
							label="Follow us on Bluesky"
							href="https://bsky.app/profile/preactjs.com"
							viewbox="0 0 568 501"
							id="bluesky"
						/>
						<SocialIcon
							label="Chat with us on Slack"
							href="http://chat.preactjs.com/"
							viewbox="0 0 512 512"
							id="slack"
						/>
					</div>
					<div class={style.translation}>
						<Menu>
							{isOpen => (
								<ExpandableNavLink
									isOpen={isOpen}
									label={
										<svg aria-hidden viewBox="0 0 24 24">
											<use href="/icons.svg#i18n" />
										</svg>
									}
									ariaLabel="Select your language"
								>
									{typeof window !== 'undefined' &&
										Object.keys(appConfig.languages).map(id => (
											<button
												class={cx(id == lang && style.current)}
												data-value={id}
												onClick={e => setLang(e.currentTarget.dataset.value)}
											>
												{appConfig.languages[id]}
											</button>
										))}
								</ExpandableNavLink>
							)}
						</Menu>
					</div>
					<HamburgerMenu open={open} onClick={toggle} />
				</div>
			</div>
			<Corner />
		</header>
	);
}

const SocialIcon = ({ label, href, viewbox, id }) => (
	<a
		class={style.socialItem}
		aria-label={label}
		href={href}
		target="_blank"
		rel="noopener noreferrer"
	>
		<svg aria-hidden viewBox={viewbox}>
			<use href={`/icons.svg#${id}`} />
		</svg>
	</a>
);

const HamburgerMenu = ({ open, ...props }) => (
	<div class={style.hamburger} data-open={open} {...props}>
		<div class={style.hb1} />
		<div class={style.hb2} />
		<div class={style.hb3} />
	</div>
);

/**
 * @param {Object} props
 * @param {(open: boolean) => import('preact').JSX.Element} props.children
 */
function Menu(props) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		// We don't actually have to check where the click occurs, as if
		// it happens within the menu, the toggle handler will close it.
		// Therefore, this will only catch the clicks outside the menu.
		const handleClickOutside = () => {
			if (isOpen) setIsOpen(false);
		};

		addEventListener('click', handleClickOutside);
		return () => removeEventListener('click', handleClickOutside);
	}, [isOpen]);

	return (
		<div
			class={style.navGroup}
			data-open={isOpen}
			onClick={() => setIsOpen(!isOpen)}
		>
			{props.children(isOpen)}
		</div>
	);
}

/**
 * @typedef {Object} NavLinkProps
 * @property {string} props.href
 * @property {string} props.label
 * @property {string} [props.clsx]
 * @property {boolean} [props.isOpen]
 */

/**
 * @param {NavLinkProps & import('preact').JSX.AnchorHTMLAttributes} props
 */
function NavLink({ href, label, clsx, isOpen, ...rest }) {
	const { path } = useLocation();

	const prefetchAndPreload = () => {
		if (href.startsWith('/repl')) {
			ReplPage.preload();
			CodeEditor.preload();
		} else if (href.startsWith('/tutorial')) {
			TutorialPage.preload();
			CodeEditor.preload();
		}

		prefetchContent(href);
	};

	return (
		<a
			href={href}
			onMouseOver={prefetchAndPreload}
			onTouchStart={prefetchAndPreload}
			class={cx(pathMatchesRoute(href, path) && style.current, clsx)}
			{...rest}
		>
			{href == '/' ? <InvertedLogo title="Preact Logo" /> : null}
			{label}
		</a>
	);
}

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {string | import('preact').JSX.Element} props.label
 * @param {string} [props.ariaLabel]
 * @param {import('preact').ComponentChildren} props.children
 */
function ExpandableNavLink({ isOpen, children, label, ariaLabel }) {
	return (
		<>
			<button
				aria-label={ariaLabel || null}
				aria-haspopup
				aria-expanded={isOpen}
			>
				{label}
			</button>
			<nav aria-label="submenu" aria-hidden={!isOpen}>
				{children}
			</nav>
		</>
	);
}

export function getRouteName(route, lang) {
	return typeof route.name === 'object'
		? route.name[lang] || route.name.en
		: route.name || route.title;
}

/**
 * @param {string} path
 * @param {string} route
 * @returns {boolean}
 */
function pathMatchesRoute(path, route) {
	if (!path || !route) return false;
	if (path === route) return true;

	if (path !== '/' && route.startsWith(path)) return true;
	return false;
}
