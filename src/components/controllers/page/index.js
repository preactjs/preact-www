import { h, Component } from 'preact';
import cx from 'classnames';
import { bind } from 'decko';
import ContentRegion from '../../content-region';
import style from './style';

const EMPTY = {};

const getContent = route => route.content || route.path;

export default class Page extends Component {
	state = { loading:true };

	componentWillReceiveProps({ route }) {
		if (getContent(route)!==getContent(this.props.route)) {
			this.setState({ loading:true });
		}
	}

	@bind
	onLoad({ meta }) {
		this.setState({
			current: getContent(this.props.route),
			meta,
			loading: false
		});
	}

	render({ route }, { current, loading, meta=EMPTY }) {
		let layout = `${meta.layout || 'default'}Layout`,
			name = getContent(route);
		if (name!==current) loading = true;
		return (
			<div class={cx(style.page, style[layout])} loading={loading}>
				{ meta.show_title!==false && (
					<h1 class={style.title}>{ meta.title || route.title }</h1>
				) }
				<div class={style.loading}>
					<progress-spinner />
				</div>
				<div class={style.inner}>
					<ContentRegion
						name={name}
						onLoad={this.onLoad}
					/>
				</div>
			</div>
		);
	}
}
