import { h, Component } from 'preact';
import cx from '../../lib/cx';
import { InvertedLogo } from '../logo';
import Search from './search';
import style from './style';
import { useStore } from '../store-adapter';
import config from '../../config';
import { useCallback, useEffect } from 'preact/hooks';
import ReleaseLink from './gh-version';
import Corner from './corner';
import ThemeSwitcher from '../theme-switcher';
import { useOverlayToggle } from '../../lib/toggle-overlay';

const LINK_FLAIR = {
	logo: InvertedLogo
};

export default function Header() {
	const { url } = useStore(['url']).state;
	const [open, setOpen] = useOverlayToggle(false);
	const toggle = useCallback(() => setOpen(!open), [open]);

	useEffect(() => {
		if (open) setOpen(false);
	}, [url]);

	return (
		<header class={cx(style.header, open && style.open)}>
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
						<img src="/assets/github.svg" alt="GitHub" />
					</a>
					<a
						class={style.socialItem}
						aria-label="Follow us on Twitter"
						href="https://twitter.com/preactjs"
					>
						<img src="/assets/twitter.svg" alt="Twitter" />
					</a>
					<ThemeSwitcher />
				</div>
				<Hamburger open={open} onClick={toggle} />
				<Corner />
			</div>
		</header>
	);
}

// hamburger menu
const Hamburger = ({ open, ...props }) => (
	<div class={style.hamburger} open={open} {...props}>
		<div class={style.hb1} />
		<div class={style.hb2} />
		<div class={style.hb3} />
	</div>
);

// nested nav renderer
const Nav = ({ routes, current, ...props }) => (
	<nav {...props}>
		{routes.map(route => (
			<NavItem
				to={route}
				current={current}
				data-route={getRouteIdent(route)}
				class={cx(
					route.class,
					(route.path === current ||
						(route.content === 'guide' && /^\/guide\//.test(current))) &&
						style.current
				)}
			/>
		))}
	</nav>
);

// nav items are really the only complex bit for menuing, since they handle click events.
class NavItem extends Component {
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

	render({ to, current, ...props }, { open }) {
		if (!to.routes) return <NavLink to={to} {...props} />;

		return (
			<div {...props} data-open={open} class={style.navGroup}>
				<NavLink to={to} onClick={this.toggle} aria-haspopup isOpen={open} />
				<Nav
					routes={to.routes}
					current={current}
					aria-label="submenu"
					aria-hidden={'' + !open}
				/>
			</div>
		);
	}
}

// depending on the type of nav link, use <a>
const NavLink = ({ to, isOpen, route, ...props }) => {
	const { lang } = useStore(['lang']).state;
	let Flair = to.flair && LINK_FLAIR[to.flair];

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

	return (
		<a href={to.path} {...props} data-route={route}>
			{Flair && <Flair />}
			{getRouteName(to, lang)}
		</a>
	);
};

export function getRouteName(route, lang) {
	return typeof route.name === 'object'
		? route.name[lang] || route.name.en
		: route.name || route.title;
}

// get a CSS-addressable identifier for a given route
const getRouteIdent = route =>
	(getRouteName(route, 'en') || route.url)
		.toLowerCase()
		.replace(/[^a-z0-9]/i, '');
