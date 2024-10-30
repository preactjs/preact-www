import { useRoute } from 'preact-iso';
import { useEffect } from 'preact/hooks';
import { Tutorial } from './tutorial';
import { SolutionProvider } from './tutorial/contexts';
import { NotFound } from './not-found';
import { useContent } from '../../lib/use-content';
import { prefetchContent } from '../../lib/use-resource.js';
import { useLanguage } from '../../lib/i18n';
import { tutorialRoutes } from '../../lib/route-utils';

import style from './tutorial/style.module.css';

export default function TutorialPage() {
	const { params } = useRoute();
	const { step } = params;

	if (!tutorialRoutes[`/tutorial${step ? `/${step}` : ''}`]) {
		return <NotFound />;
	}

	return <TutorialLayout />;
}

function TutorialLayout() {
	const { path, params } = useRoute();
	const [lang] = useLanguage();
	const { html, meta } = useContent(!params.step ? 'tutorial/index' : path);

	// Preload the next chapter
	useEffect(() => {
		if (meta && meta.next) {
			prefetchContent([lang, meta.next]);
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
