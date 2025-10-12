import cx from '../../lib/cx';
import { InvertedLogo } from '../logo';
import Search from './search';
import style from './style.module.css';
import config from '../../config.json';
import { useCallback, useEffect, useState } from 'preact/hooks';
import ReleaseLink from './gh-version';
import Corner from './corner';
import { useOverlayToggle } from '../../lib/toggle-overlay';
import { useLocation } from 'preact-iso';
import {
	useLanguage,
	useTranslation,
	usePathTranslation
} from '../../lib/i18n';

export default function Header() {
	const { url } = useLocation();
	const [open, setOpen] = useOverlayToggle();
	const toggle = useCallback(() => setOpen(!open), [open]);

	useEffect(() => {
		if (open) setOpen(false);
	}, [url]);

	return (
		<header class={cx(style.header, open && style.open)}>
			<div class={style.banner}>
				<a href="https://www.stopputin.net/">
					We stand with Ukraine. <b>Show your support</b> 🇺🇦
				</a>
			</div>
			<div class={style.outer}>
				<div class={style.inner}>
					<MainNav />
					<Search />
					<SocialLinks />
					<LanguagePicker />
					<HamburgerMenu open={open} onClick={toggle} />
				</div>
			</div>
			<Corner />
		</header>
	);
}

function MainNav() {
	const { path, route } = useLocation();
	const about = usePathTranslation('/about');

	const brandingRedirect = e => {
		e.preventDefault();
		route('/branding');
	};

	return (
		<nav class={style.nav}>
			<NavLink
				href="/"
				clsx="home"
				flair={<InvertedLogo title="Preact Logo" />}
				onContextMenu={brandingRedirect}
				aria-label="Home"
			/>
			<NavLink href="/tutorial" />
			<NavLink href="/guide/v10/getting-started" />
			<NavMenu>
				{isOpen => (
					<ExpandableNavLink
						isOpen={isOpen}
						label={about}
						class={cx(path.startsWith('/about') && style.current)}
					>
						<>
							<NavLink href="/about/we-are-using" />
							<NavLink href="/about/libraries-addons" />
							<NavLink href="/about/demos-examples" />
							<NavLink href="/about/project-goals" />
							<NavLink href="/about/browser-support" />
						</>
					</ExpandableNavLink>
				)}
			</NavMenu>
			<NavLink href="/blog" />
			<NavLink href="/repl" />
		</nav>
	);
}

function SocialLinks() {
	return (
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
	);
}

function LanguagePicker() {
	const [lang, setLang] = useLanguage();
	const selectYourLanguage = useTranslation('selectYourLanguage');

	return (
		<div class={style.translation}>
			<NavMenu>
				{isOpen => (
					<ExpandableNavLink
						isOpen={isOpen}
						label={
							<svg aria-hidden viewBox="0 0 24 24">
								<use href="/icons.svg#i18n" />
							</svg>
						}
						aria-label={selectYourLanguage}
					>
						{typeof window !== 'undefined' &&
							Object.keys(config.languages).map(id => (
								<button
									class={cx(id == lang && style.current)}
									data-value={id}
									onClick={e => setLang(e.currentTarget.dataset.value)}
								>
									{config.languages[id]}
								</button>
							))}
					</ExpandableNavLink>
				)}
			</NavMenu>
		</div>
	);
}

/**
 * @param {Object} props
 * @param {string} props.label - The aria label for the social icon
 * @param {string} props.href - The URL the icon links to
 * @param {string} props.viewbox - The SVG viewBox attribute -- must match the SVG's viewBox
 * @param {string} props.id - The ID of the icon in the `/icons.svg` spritesheet
 */
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

/**
 * @param {{ open: boolean } & import('preact').HTMLAttributes<HTMLDivElement>} props
 */
const HamburgerMenu = ({ open, ...props }) => (
	<div class={style.hamburger} data-open={open} {...props}>
		<div class={style.hb1} />
		<div class={style.hb2} />
		<div class={style.hb3} />
	</div>
);

/**
 * Sets up event listeners to toggle submenu visibility. Takes the menu as a child function
 *
 * @param {Object} props
 * @param {(open: boolean) => import('preact').JSX.Element} props.children
 */
function NavMenu(props) {
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
 * @typedef {Object} ExpandableNavLinkProps
 * @property {boolean} props.isOpen
 * @property {string | import('preact').JSX.Element} props.label
 * @property {import('preact').ComponentChildren} props.children
 */

/**
 * Button that expands into a menu when clicked. Pass in label & menu items as children.
 *
 * @param {ExpandableNavLinkProps & import('preact').ButtonHTMLAttributes} props
 */
function ExpandableNavLink({ isOpen, label, children, ...rest }) {
	return (
		<>
			<button aria-haspopup aria-expanded={isOpen} {...rest}>
				{label}
			</button>
			<nav aria-label="submenu" aria-hidden={!isOpen}>
				{children}
			</nav>
		</>
	);
}

/**
 * @typedef {import('../../locales/en.json')} Translations
 */

/**
 * @typedef {Object} NavLinkProps
 * @property {keyof Translations['headerNav']} props.href
 * @property {string} [props.clsx]
 * @property {import('preact').ComponentChildren} [props.flair]
 * @property {boolean} [props.isOpen]
 */

/**
 * @param {NavLinkProps & Omit<import('preact').AnchorHTMLAttributes, 'role'>} props
 */
function NavLink({ href, flair, clsx, isOpen, ...rest }) {
	const { path } = useLocation();
	const label = usePathTranslation(href);

	return (
		<a
			href={href}
			class={cx(pathMatchesHref(path, href) && style.current, clsx)}
			{...rest}
		>
			{flair}
			{label}
		</a>
	);
}

/**
 * @param {string} path
 * @param {string} href
 * @returns {boolean}
 */
function pathMatchesHref(path, href) {
	if (!path || !href) return false;
	if (path === href) return true;

	if (href !== '/' && path.startsWith(href)) return true;
	if (path.startsWith('/guide/') && href.startsWith('/guide/')) return true;
	return false;
}
