import { Component } from 'preact';
import cx from '../../../lib/cx';
import ContentRegion, { getContentOnServer } from '../../content-region';
import config from '../../../config';
import style from './style';
import Toc from './table-of-content';
import Hydrator from '../../../lib/hydrator';

const EMPTY = {};

const getContent = route => route.content || route.path;

export default class Page extends Component {
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

	gotToc = ({ toc }) => {
		this.setState({ toc, gotToc: true });
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
			this.setState({ loading: true, gotToc: false });
		}
	}

	componentDidUpdate() {
		this.setTitle();
	}

	render({ route }, { current, loading, meta = EMPTY, toc, gotToc } = {}) {
		let layout = `${meta.layout || 'default'}Layout`,
			name = getContent(route),
			data;
		if (name !== current) loading = true;

		if (PRERENDER) {
			loading = false;
			// on the server, pass data down through the tree to avoid repeated FS lookups
			data = getContentOnServer(route.path);
			({ meta } = data);
			toc = meta.toc;
		}

		let hasToc = toc && meta.toc !== false && toc.length > 0;
		if (toc && toc[0] && toc[0].level === 1) {
			meta.title = toc[0].text;
		}
		return (
			<div class={cx(style.page, style[layout], hasToc && style.withToc)}>
				<progress-bar showing={loading} />
				<Hydrator
					load={() => Title}
					boot={!loading && gotToc}
					show={name != 'index' && meta.show_title !== false}
					title={meta.title || route.title}
				/>
				<Hydrator
					load={() => Toc}
					boot={!loading && gotToc}
					items={hasToc ? toc : []}
				/>
				<div class={style.inner}>
					<ContentRegion
						name={name}
						data={data}
						onToc={this.gotToc}
						onLoad={this.onLoad}
					/>
				</div>
			</div>
		);
	}
}

const Title = ({ title, show }) => show && <h1 class={style.title}>{title}</h1>;
