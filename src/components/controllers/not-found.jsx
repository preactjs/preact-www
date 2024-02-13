import { useLanguage } from '../../lib/i18n';
import { useContent } from '../../lib/use-resource';
import { useTitle, useDescription } from './utils';
import Footer from '../footer';
import { MarkdownRegion } from './markdown-region';
import style from './style.module.css';

export function NotFound() {
	const [lang] = useLanguage();

	const { html, meta } = useContent([lang, '404']);
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
