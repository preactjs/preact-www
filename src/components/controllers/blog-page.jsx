import { useRoute } from '../../lib/router.js';
import { useContent } from '../../lib/use-content';
import { MarkdownRegion } from './markdown-region';
import Footer from '../footer/index';
import style from './style.module.css';

/**
 * @param {object} props
 * @param {import('../../types.d.ts').ContentData} props.content
 */
export function BlogLayout({ content }) {
	const { path } = useRoute();
	const { html, meta } = useContent(path, content);

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
