import { useRoute, ErrorBoundary } from 'preact-iso';
import { useContent } from '../../lib/use-content.js';
import { NotFound } from './not-found.jsx';
import { MarkdownRegion } from './markdown-region.jsx';
import Footer from '../footer/index.jsx';
import style from './style.module.css';

export const pages = [
	'/',
	'/about/we-are-using',
	'/about/project-goals',
	'/blog',
	'/branding',
	'/translation-score-table'
];

// Supports generic pages like `/`, `/about/*`, `/blog`, etc.
export function Page() {
	const { path } = useRoute();
	const isValidRoute = pages.some((pagePath) => pagePath === path);

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
