import { useEffect } from 'preact/hooks';
import { useRoute } from '../../lib/router.js';
import { Tutorial } from './tutorial';
import { SolutionProvider } from './tutorial/contexts';
import { useContent, prefetchContent } from '../../lib/use-content';

import style from './tutorial/style.module.css';

/**
 * @param {object} props
 * @param {import('../../types.d.ts').ContentData} props.content
 */
export function TutorialLayout({ content }) {
	const { path } = useRoute();
	const { html, meta } = useContent(path, content);

	// Preload the next chapter
	useEffect(() => {
		if (meta && meta.next) {
			prefetchContent(meta.next);
		}
	}, [meta.next, path]);

	return (
		<div class={style.tutorial}>
			<style>{`
				main {
					height: 100% !important;
					overflow: hidden !important;
				}
			`}</style>
			<SolutionProvider>
				<Tutorial html={html} meta={meta} />
			</SolutionProvider>
		</div>
	);
}
