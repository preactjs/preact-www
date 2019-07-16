import { h, Component } from 'preact';
import linkState from 'linkstate';
import cx from '../../../lib/cx';
import ContentRegion from '../../content-region';
import config from '../../../config';
import style from './style';
import Toc from './table-of-content';

const EMPTY = {};

const getContent = route => route.content || route.path;

export default class Page extends Component {
	constructor(props) {
		super(props);
		// TODO: Remove this once it's fixed in `preact`
		// or `preact-render-to-string`
		this.state = {};
	}

	onLoad = ({ meta }) => {
		this.setState({
			current: getContent(this.props.route),
			meta,
			loading: false
		});
		// content was loaded. if this was a forward route transition, animate back to top
		if (window.nextStateToTop) {
			window.nextStateToTop = false;
			scrollTo({
				top: 0,
				left: 0,
				behavior: 'smooth'
			});
		}
	};

	setTitle() {
		let { props, state } = this,
			title = (state.meta && state.meta.title) || props.route.title || '';
		document.title = `${title} | ${config.title}`;
	}

	componentDidMount() {
		this.setTitle();
	}

	componentWillReceiveProps({ route }) {
		if (getContent(route) !== getContent(this.props.route)) {
			this.setState({ loading: true });
		}
	}

	componentDidUpdate() {
		this.setTitle();
	}

	render({ route }, { current, loading, meta = EMPTY, toc }) {
		let layout = `${meta.layout || 'default'}Layout`,
			name = getContent(route);
		if (name !== current) loading = true;

		let hasToc = toc && meta.toc !== false && toc.length > 0;
		return (
			<div class={cx(style.page, style[layout], hasToc && style.withToc)}>
				<progress-bar showing={loading} />
				{name != 'index' && meta.show_title !== false && (
					<h1 class={style.title}>{meta.title || route.title}</h1>
				)}
				{hasToc && <Toc items={toc} />}
				<div class={style.inner}>
					<ContentRegion
						name={name}
						onToc={linkState(this, 'toc', 'toc')}
						onLoad={this.onLoad}
					/>
				</div>
			</div>
		);
	}
}
