import { LocationProvider, ErrorBoundary } from 'preact-iso';
import { LanguageProvider } from '../lib/i18n';
import { PrerenderDataProvider } from '../lib/prerender-data.jsx';
import Header from './header';
import Routes from './routes';

/**
 * @param {{ prerenderData?: import('../types.d.ts').PrerenderData }} props
 */
export default function App({ prerenderData }) {
	return (
		<ErrorBoundary>
			<LocationProvider>
				<LanguageProvider>
					<PrerenderDataProvider value={prerenderData}>
						<Header />
						<Routes />
					</PrerenderDataProvider>
				</LanguageProvider>
			</LocationProvider>
		</ErrorBoundary>
	);
}
