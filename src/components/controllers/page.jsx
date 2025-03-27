import { useLocation } from 'preact-iso';
import { navRoutes } from '../../lib/route-utils';
import { NotFound } from './not-found';
import { DocLayout } from './doc-page';

export function Page() {
	const { path } = useLocation();

	if (!navRoutes[path]) {
		return <NotFound />;
	}

	return <DocLayout />;
}
