import { useRoute, ErrorBoundary } from 'preact-iso';
import { useContent } from '../../lib/use-content';
import { NotFound } from './not-found';
import { MarkdownRegion } from './markdown-region';
import Footer from '../footer/index';
import { blogPosts } from '../../route-config.js';
import style from './style.module.css';

export default function BlogPage() {
	const { slug } = useRoute().params;
	const isValidRoute = blogPosts[`/blog/${slug}`];

	return (
		<ErrorBoundary>
			{isValidRoute ? <BlogLayout /> : <NotFound />}
		</ErrorBoundary>
	);
}

function BlogLayout() {
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
