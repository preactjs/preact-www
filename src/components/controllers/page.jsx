import { useRoute } from '../../lib/router.js';
import { useContent } from '../../lib/use-content';
import { MarkdownRegion } from './markdown-region';
import Footer from '../footer/index';
import style from './style.module.css';

/**
 * Layout for the generic markdown pages — `/`, `/about/*`, `/branding`.
 *
 * `content` is the document the route loader compiled on the server. It is used
 * as-is while the reader is on English, and replaced by a client fetch of
 * `/content/<lang>/**.json` once they pick another language.
 *
 * @param {object} props
 * @param {import('../../types.d.ts').ContentData} props.content
 */
export function PageLayout({ content }) {
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
