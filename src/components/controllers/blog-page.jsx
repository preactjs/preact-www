import { useRoute } from 'preact-iso';
import { useContent } from '../../lib/use-resource';
import { useTitle, useDescription } from './utils';
import { NotFound } from './not-found';
import { useLanguage } from '../../lib/i18n';
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
	const [lang] = useLanguage();

	const { html, meta } = useContent([lang, path === '/' ? 'index' : path]);
	useTitle(meta.title);
	useDescription(meta.description);

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
