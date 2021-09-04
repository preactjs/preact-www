import { h, Component } from 'preact';
import Routes from './routes';
import Header from './header';
import { LocationProvider } from 'preact-iso';
import { LanguageProvider } from '../lib/i18n';

export default class App extends Component {
	handleUrlChange = ({ url }) => {
		// FIXME:
		// if (typeof ga === 'function') {
		// 	ga('send', 'pageview', url);
		// }
	};

	render() {
		return (
			<LocationProvider>
				<LanguageProvider>
					<div id="app">
						<Header />
						<Routes onChange={this.handleUrlChange} />
					</div>
				</LanguageProvider>
			</LocationProvider>
		);
	}
}
