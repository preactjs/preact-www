import { h, Component } from 'preact';
import { connect } from 'unistore/preact';
import config from '../../config';
import style from './style';

/*
 *  To update this list, on https://github.com/preactjs/preact/graphs/contributors run:
 *	$$('.contrib-person [data-hovercard-type="user"]:nth-of-type(2)').map(p=>p.textContent).filter(x => !/-bot$/.test(x)).join(' ')
 */
const CONTRIBS = 'developit marvinhagemeister andrewiggins k1r0s cristianbote sventschui JoviDeCroock AlexGalays rpetrich valotas robertknight wardpeet kruczy pmkroeker NekR ForsakenHarmony jviide juicelink billneff79 yaodingyd prateekbh vutran rmacklin impronunciable zouhir scurker SolarLiner mseddon vaneenige lukeed kristoferbaxter reznord'.split(' ');

@connect( ({ lang, url }) => ({ lang, url }) )
export default class Footer extends Component {
	state = {
		contrib: CONTRIBS[new Date().getMonth()]
	};

	componentWillReceiveProps({ url }) {
		if (url!==this.props.url) {
			this.setState({
				contrib: CONTRIBS[Math.random()*(CONTRIBS.length-1)|0]
			});
		}
	}

	setLang = e => {
		this.props.store.setState({ lang: e.target.value });
	};

	render({ lang, url = location.pathname }, { contrib }) {
		let path = url.replace(/\/$/,'') || '/index';
		if (lang) path = `/lang/${lang}${path}`;
		let editUrl = `https://github.com/preactjs/preact-www/tree/master/content${path}.md`;
		if (typeof document!=='undefined' && document.documentElement) document.documentElement.lang = lang;
		return (
			<footer class={style.footer}>
				<div class={style.inner}>
					<p>
						<a href={editUrl} target="_blank" rel="noopener noreferrer">Edit this Page</a>
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
					<p style={{ lineHeight: 1 }}>
						Built by a bunch of <a href="https://github.com/preactjs/preact/graphs/contributors" target="_blank" rel="noopener noreferrer">lovely people</a>
						{' '}
						like <a href={'https://github.com/' + contrib} target="_blank" rel="noopener noreferrer">@{contrib}</a>.
					</p>
				</div>
			</footer>
		);
	}
}
