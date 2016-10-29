import { h, Component } from 'preact';
import { connect } from '../../lib/store';
import config from '../../config';
import style from './style';

@connect( ({ lang }) => ({ lang }) )
export default class Footer extends Component {
	setLang = e => {
		this.props.store.setState({ lang: e.target.value });
	};

	render({ lang }) {
		let path = location.pathname.replace(/\/$/,'') || '/index';
		if (lang) path = '/' + lang + path;
		let editUrl = `https://github.com/developit/preact-www/tree/master/content${path}.md`;
		return (
			<footer class={style.footer}>
				<div class={style.inner}>
					<p>
						<a href={editUrl} target="_blank">Edit this Page</a>
						{' | '}
						<label class={style.lang}>
							Change Language:{' '}
							<select value={lang} onChange={this.setLang}>
								<option value="">English</option>
								{ Object.keys(config.languages).map( id => (
									<option value={id}>{ config.languages[id] }</option>
								)) }
							</select>
						</label>
					</p>
					<p>
						Built by <a href="https://github.com/developit" target="_blank">@developit</a>{' '}
						and a bunch of <a href="https://github.com/developit/preact/graphs/contributors" target="_blank">lovely people</a>.
					</p>
				</div>
			</footer>
		);
	}
}
