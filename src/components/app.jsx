import { LocationProvider, ErrorBoundary } from 'preact-iso';
import { LanguageProvider } from '../lib/i18n.jsx';
import { PrerenderDataProvider } from '../lib/prerender-data.jsx';
import { useDelegatedPrefetch } from '../lib/use-delegated-prefetch.js';
import Header from './header/index.jsx';
import Routes from './routes.jsx';

/**
 * @param {{ prerenderData?: import('../types.d.ts').PrerenderData }} props
 */
export default function App({ prerenderData }) {
	useDelegatedPrefetch();
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
