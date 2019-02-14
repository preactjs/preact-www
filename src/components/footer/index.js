import { h, Component } from 'preact';
import { connect } from 'unistore/preact';
import config from '../../config';
import style from './style';

@connect( ({ lang, url }) => ({ lang, url }) )
export default class Footer extends Component {
	setLang = e => {
		this.props.store.setState({ lang: e.target.value });
	};

	render({ lang, url = location.pathname }) {
		let path = url.replace(/\/$/,'') || '/index';
		if (lang) path = `/lang/${lang}${path}`;
		let editUrl = `https://github.com/developit/preact-www/tree/master/content${path}.md`;
		if (typeof document!=='undefined' && document.documentElement) document.documentElement.lang = lang;
		return (
			<footer class={style.footer}>
				<div class={style.inner}>
					<p>
						<a href={editUrl} target="_blank" rel="noopener">Edit this Page</a>
						<label class={style.lang}>
							Language:{' '}
							<select value={lang || ''} onChange={this.setLang}>
								<option value="">English</option>
								{ Object.keys(config.languages).map( id => (
									<option selected={id==lang} value={id}>{ config.languages[id] }</option>
								)) }
							</select>
							{ lang && <code>?lang={lang}</code> }
						</label>
					</p>
					<p>
						Built by <a href="https://github.com/developit" target="_blank" rel="noopener">@developit</a>{' '}
						and a bunch of <a href="https://github.com/developit/preact/graphs/contributors" target="_blank" rel="noopener">lovely people</a>.
					</p>
				</div>
			</footer>
		);
	}
}
