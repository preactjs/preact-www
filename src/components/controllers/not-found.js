import { useLocation } from 'preact-iso';
import { getContent } from '../../lib/content';
import { useLanguage } from '../../lib/i18n';
import { useResource } from '../use-resource';
import Footer from '../footer/index';
import style from './style.module.less';
import { MarkdownRegion } from './markdown-region';

export function NotFound() {
	const { url } = useLocation();
	const [lang] = useLanguage();

	const { html, meta } = useResource(() => getContent([lang, '404']), [url]);

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
