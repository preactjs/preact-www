import { useRoute, ErrorBoundary } from 'preact-iso';
import { navRoutes } from '../../lib/route-utils';
import { useContent } from '../../lib/use-content';
import { NotFound } from './not-found';
import { MarkdownRegion } from './markdown-region';
import Footer from '../footer/index';
import style from './style.module.css';

// Supports generic pages like `/`, `/about/*`, `/blog`, etc.
export function Page() {
	const { path } = useRoute();
	const isValidRoute = navRoutes[path];

	return (
		<ErrorBoundary>
			{isValidRoute ? <PageLayout /> : <NotFound />}
		</ErrorBoundary>
	);
}

export function PageLayout() {
	const { path } = useRoute();
	const { html, meta } = useContent(path);

	return (
		<div class={style.page}>
			<div class={style.outer}>
				<div class={style.inner}>
					<MarkdownRegion html={html} meta={meta} />
					<Footer />
				</div>
			</div>
		</div>
	);
}
