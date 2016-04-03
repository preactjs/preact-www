import { h, Component } from 'preact';
import style from './style';
import config from '../../config';

export default class Footer extends Component {
	render() {
		return (
			<footer class={style.footer}>
				<div class={style.inner}>
					<p>
						Built by <a href="https://github.com/developit" target="_blank">@developit</a>{' '}
						and a bunch of <a href="https://github.com/developit/preact/graphs/contributors" target="_blank">lovely people</a>.
					</p>
				</div>
			</footer>
		);
	}
}
