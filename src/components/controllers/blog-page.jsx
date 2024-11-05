import { useRoute } from 'preact-iso';
import { useContent } from '../../lib/use-content';
import { NotFound } from './not-found';
import { MarkdownRegion } from './markdown-region';
import Footer from '../footer/index';
import { blogRoutes } from '../../lib/route-utils';
import style from './style.module.css';

export default function BlogPage() {
	const { params } = useRoute();
	const { slug } = params;

	if (!blogRoutes[`/blog/${slug}`]) {
		return <NotFound />;
	}

	return <BlogLayout />;
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
