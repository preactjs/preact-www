import { h, Component } from 'preact';

export default (load, fallback) => class extends Component {
	componentWillMount() {
		load(this.linkState('child'));
	}
	render(props, { child }) {
		return child ? h(child.default || child, props) : fallback;
	}
};
