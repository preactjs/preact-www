import { LocationProvider, ErrorBoundary } from 'preact-iso';
import { LanguageProvider } from '../lib/i18n';
import Header from './header';
import Routes from './routes';

export default function App() {
	return (
		<ErrorBoundary>
			<LocationProvider>
				<LanguageProvider>
					<Header />
					<Routes />
				</LanguageProvider>
			</LocationProvider>
		</ErrorBoundary>
	);
}
