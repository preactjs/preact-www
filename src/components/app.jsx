import { LocationProvider, ErrorBoundary } from 'preact-iso';
import { LanguageProvider } from '../lib/i18n';
import Header from './header';
import Routes from './routes';

export default function App({ preactVersion }) {
	return (
		<ErrorBoundary>
			<LocationProvider>
				<LanguageProvider>
					<div id="app">
						<Header preactVersion={preactVersion || '10.19.3'} />
						<Routes />
					</div>
				</LanguageProvider>
			</LocationProvider>
		</ErrorBoundary>
	);
}
