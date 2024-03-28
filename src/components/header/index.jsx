import { Component } from 'preact';
import cx from '../../lib/cx';
import { InvertedLogo } from '../logo';
import Search from './search';
import style from './style.module.css';
import config from '../../config.json';
import { useCallback, useEffect } from 'preact/hooks';
import ReleaseLink from './gh-version';
import Corner from './corner';
import { useOverlayToggle } from '../../lib/toggle-overlay';
import { useLocation } from 'preact-iso';
import { useLanguage } from '../../lib/i18n';

const LINK_FLAIR = {
	logo: InvertedLogo
};

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
					<Nav class={style.nav} routes={config.nav} current={url} />
					<Search />
					<div class={style.social}>
						<ReleaseLink class={cx(style.socialItem, style.release)} />
						<a
							class={style.socialItem}
							aria-label="Browse the code on GitHub"
							href="https://github.com/preactjs/preact"
						>
							<svg aria-hidden viewBox="0 0 24 24">
								<use href="/header-icons.svg#github" />
							</svg>
						</a>
						<a
							class={style.socialItem}
							aria-label="Follow us on Twitter"
							href="https://twitter.com/preactjs"
						>
							<svg aria-hidden viewBox="0 0 34 27.646">
								<use href="/header-icons.svg#twitter" />
							</svg>
						</a>
						<a
							class={style.socialItem}
							aria-label="Chat with us on Slack"
							href="http://chat.preactjs.com/"
						>
							<svg aria-hidden viewBox="0 0 512 512">
								<use href="/header-icons.svg#slack" />
							</svg>
						</a>
					</div>
					<div class={style.translation}>
						<NavMenu language />
					</div>
					<HamburgerMenu open={open} onClick={toggle} />
				</div>
			</div>
			<Corner />
		</header>
	);
}

const HamburgerMenu = ({ open, ...props }) => (
	<div class={style.hamburger} open={open} {...props}>
		<div class={style.hb1} />
		<div class={style.hb2} />
		<div class={style.hb3} />
	</div>
);

// nested nav renderer
const Nav = ({ routes, current, ...props }) => (
	<nav {...props}>
		{routes.map(route =>
			route.routes ? (
				<NavMenu
					to={route}
					current={current}
					data-route={getRouteIdent(route)}
				/>
			) : (
				<NavLink
					to={route}
					class={cx(
						route.class,
						(pathMatchesRoute(current, route) ||
							(route.content === 'guide' && /^\/guide\//.test(current)) ||
							(route.content === 'blog' && /^\/blog\//.test(current))) &&
							style.current
					)}
				/>
			)
		)}
	</nav>
);

// nav items are really the only complex bit for menuing, since they handle click events.
class NavMenu extends Component {
	state = { open: false };

	close = () => (this.setState({ open: false }), false);

	toggle = () => (this.setState({ open: !this.state.open }), false);

	handleClickOutside = ({ target }) => {
		if (this.state.open) {
			do {
				if (target === this.base) return;
			} while ((target = target.parentNode));
			this.close();
		}
	};

	componentDidMount() {
		addEventListener('click', this.handleClickOutside);
	}

	componentWillUnmount() {
		removeEventListener('click', this.handleClickOutside);
	}

	componentDidUpdate({ current }) {
		if (current !== this.props.current && this.state.open) {
			this.close();
		}
	}

	render({ to, current, language, ...props }, { open }) {
		return (
			<div {...props} data-open={open} class={style.navGroup}>
				{language ? (
					<LanguageSelectorMenu
						isOpen={open}
						toggle={this.toggle}
						close={this.close}
						{...props}
					/>
				) : (
					<>
						<NavLink
							to={to}
							onClick={this.toggle}
							aria-haspopup
							isOpen={open}
						/>
						<Nav
							routes={to.routes}
							current={current}
							aria-label="submenu"
							aria-hidden={'' + !open}
						/>
					</>
				)}
			</div>
		);
	}
}

// depending on the type of nav link, use <a>
const NavLink = ({ to, isOpen, route, ...props }) => {
	const location = useLocation();
	const [lang] = useLanguage();
	let Flair = to.flair && LINK_FLAIR[to.flair];

	if (to.skipHeader) return;

	if (!to.path) {
		return (
			<button
				{...props}
				aria-haspopup="true"
				aria-expanded={isOpen}
				data-route={route}
			>
				{getRouteName(to, lang)}
			</button>
		);
	}

	function BrandingRedirect(e) {
		if (to.href == '/' || to.path == '/') {
			e.preventDefault();
			location.route('/branding');
		}
	}

	return (
		<a
			href={to.href || to.path}
			{...props}
			data-route={route}
			onContextMenu={BrandingRedirect}
		>
			{Flair && <Flair />}
			{getRouteName(to, lang)}
		</a>
	);
};

const LanguageSelectorMenu = ({ isOpen, toggle, close, ...props }) => {
	const [lang, setLang] = useLanguage();
	const onClick = useCallback(
		e => {
			setLang(e.target.dataset.value);
			close();
		},
		[setLang]
	);

	return (
		<>
			<button
				{...props}
				onClick={toggle}
				aria-label="Select your language"
				aria-haspopup
				aria-expanded={isOpen}
			>
				<svg aria-hidden viewBox="0 0 24 24">
					<use href="/header-icons.svg#i18n" />
				</svg>
			</button>
			<nav aria-label="submenu" aria-hidden={'' + !isOpen}>
				{Object.keys(config.languages).map(id => (
					<span
						class={cx(id == lang && style.current)}
						data-value={id}
						onClick={onClick}
					>
						{config.languages[id]}
					</span>
				))}
			</nav>
		</>
	);
};

export function getRouteName(route, lang) {
	return typeof route.name === 'object'
		? route.name[lang] || route.name.en
		: route.name || route.title;
}

function pathMatchesRoute(path, route) {
	if (!route || !route.path) return false;
	if (path === route.path) return true;
	let segs = path.replace(/(^\/|\/$)/g, '').split('/');
	let psegs = route.path.replace(/(^\/|\/$)/g, '').split('/');
	let len = Math.max(psegs.length, segs.length);
	for (let i = 0; i < len; i++) {
		let p = psegs[i];
		let s = segs[i];
		if (!p || (p[0] !== ':' && s !== p)) return false;
		if (!s) return /[?*]$/g.test(p);
		if (/[*+]$/g.test(p)) return true;
	}
	return true;
}

// get a CSS-addressable identifier for a given route
const getRouteIdent = route =>
	(getRouteName(route, 'en') || route.url)
		.toLowerCase()
		.replace(/[^a-z0-9]/i, '');
