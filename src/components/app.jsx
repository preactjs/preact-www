import { LocationProvider, ErrorBoundary } from 'preact-iso';
import { LanguageProvider } from '../lib/i18n';
// TODO: SolutionProvider should really just wrap the tutorial,
// but that requires a bit of refactoring
import { SolutionProvider } from './controllers/tutorial';
import Header from './header';
import Routes from './routes';

export default function App({ preactVersion }) {
	return (
		<ErrorBoundary>
			<LocationProvider>
				<LanguageProvider>
					<SolutionProvider>
						<div id="app">
							<Header preactVersion={preactVersion || '10.19.3'} />
							<Routes />
						</div>
					</SolutionProvider>
				</LanguageProvider>
			</LocationProvider>
		</ErrorBoundary>
	);
}
