import { h, Component } from 'preact';
import cx from '../../lib/cx';
import style from './style';

export default class Jumbotron extends Component {
	render({ children, class:c, ...props }) {
		return <div class={cx(style.jumbotron, 'full-width', c)} {...props}>{ children }</div>;
	}
}
