import { h, Component } from 'preact';
import cx from '../../../lib/cx';
import style from './table-of-contents.less';
import { getCurrentUrl } from 'preact-router';

export default class Toc extends Component {
	state = {
		active: 0
	};

	toggle = () => {
		this.setState({ open: !this.state.open });
		return false;
	};

	open = () => this.setState({ open: true });

	componentDidMount() {
		if ('IntersectionObserver' in window) {
			let config = {
				root: null,
				threshold: 1,
				rootMargin: '0px'
			};

			this.observer = new IntersectionObserver(entries => {
				let active = [];
				entries.forEach(entry => {
					let id = entry.target.getAttribute('id');
					let link = this.props.items.find(link => link.id === id);
					if (link && entry.isIntersecting && entry.intersectionRatio >= 0.75) {
						active.push(id);
					}
				});

				if (active.length > 0) {
					this.setState({ active: active[0] });
				}
			}, config);

			Array.from(
				document.querySelectorAll(
					'content-region h2, content-region h3, content-region h4'
				)
			).forEach(heading => this.observer.observe(heading));
		}
	}

	componentWillUnmount() {
		if (this.observer) {
			this.observer.disconnect();
		}
	}

	render({ items, onClick }, { open }) {
		const url = getCurrentUrl();
		return (
			<div
				class={cx(style.toc, !(items && items.length > 1) && style.disabled)}
				data-open={open}
			>
				<nav tabIndex="0" onFocus={this.open}>
					{items.map(({ text, level, id, href }) => {
						let activeCss = (id
						? this.state.active === id
						: href === url)
							? style.linkActive
							: undefined;
						return (
							<a
								href={id != null ? '#' + id : href}
								onClick={onClick}
								class={cx(style.link, activeCss, style['level-' + level])}
							>
								{text}
							</a>
						);
					})}
				</nav>
			</div>
		);
	}
}
