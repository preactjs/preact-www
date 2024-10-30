import { useContent } from '../../lib/use-content';
import Footer from '../footer';
import { MarkdownRegion } from './markdown-region';
import style from './style.module.css';

export function NotFound() {
	const { html, meta } = useContent('404');

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
