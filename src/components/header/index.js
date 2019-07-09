import { h, Component } from 'preact';
import cx from '../../lib/cx';
import { InvertedLogo } from '../logo';
import { connect } from 'unistore/preact';
// import pure from '../../lib/pure-component';
import Search from './search';
import style from './style';
import config from '../../config';


const LINK_FLAIR = {
	logo: InvertedLogo
};


@connect( ({ url }) => ({ url }) )
// @pure
export default class Header extends Component {
	state = { open: false };

	toggle = () => this.setState({ open: !this.state.open });

	// close menu on navigate
	componentWillReceiveProps({ url }) {
		if (url!==this.props.url && this.state.open) {
			this.setState({ open: false });
		}
	}

	render({ url }, { open }) {
		return (
			<header class={cx(style.header, open && style.open)}>
				<Nav routes={config.nav} current={url} />
				<Search />
				<Hamburgler open={open} onClick={this.toggle} />
				<Corner />
			</header>
		);
	}
}


// hamburgler menu
const Hamburgler = ({ open, ...props }) => (
	<div class={style.hamburgler} open={open} {...props}>
		<div class={style.hb1} />
		<div class={style.hb2} />
		<div class={style.hb3} />
	</div>
);


// nested nav renderer
const Nav = ({ routes, current, ...props }) => (
	<nav {...props}>
		{ routes.map( route => (
			<NavItem
				to={route}
				current={current}
				route={getRouteIdent(route)}
				class={cx(route.class, route.path===current && style.current)}
			/>
		)) }
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
				if (target===this.base) return;
			} while ((target=target.parentNode));
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
		if (current!==this.props.current && this.state.open) {
			this.close();
		}
	}

	render({ to, current, ...props }, { open }) {
		if (!to.routes) return (
			<NavLink to={to} {...props} />
		);

		return (
			<section {...props} open={open}>
				<NavLink to={to} onClick={this.toggle} aria-haspopup />
				<Nav routes={to.routes} current={current} aria-label="submenu" aria-hidden={''+!open} />
			</section>
		);
	}
}


// depending on the type of nav link, use <a>
const NavLink = ({ to, ...props }) => {
	let Flair = to.flair && LINK_FLAIR[to.flair];
	return (
		<a href={to.path || 'javascript:'} {...props}>
			{ Flair && <Flair /> }
			{ to.name || to.title }
		</a>
	);
};


// get a CSS-addressable identifier for a given route
const getRouteIdent = route => (
	(route.name || route.title || route.url).toLowerCase().replace(/[^a-z0-9]/i,'')
);

const Corner = () => (
	<a href="https://opencollective.com/preact" target="_blank" rel="noopener noreferrer" class={style.corner}>
		<div class={style.cornerText}>
			Help Support Us !
		</div>
	</a>
);
