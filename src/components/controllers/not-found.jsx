import { useContent } from '../../lib/use-content';
import Footer from '../footer';
import { MarkdownRegion } from './markdown-region';
import style from './style.module.css';

/**
 * @param {object} props
 * @param {import('../../types.d.ts').ContentData} [props.content]
 */
export function NotFound({ content }) {
	const { html, meta } = useContent('/404', content);

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
