import { useEffect } from 'preact/hooks';
import { useRoute, useLocation } from 'preact-iso';
import { SolutionProvider } from './tutorial/contexts';
import { getContent } from '../../lib/content';
import { useContent } from '../../lib/use-resource';
import { useTitle, useDescription } from './utils';
import { NotFound } from './not-found';
import { useLanguage } from '../../lib/i18n';
import { tutorialRoutes } from '../../lib/route-utils';
import { Tutorial } from './tutorial';

export default function TutorialPage() {
	const { params } = useRoute();
	const { step } = params;

	if (!tutorialRoutes[`/tutorial${step ? `/${step}` : ''}`]) {
		return <NotFound />;
	}

	return <TutorialLayout />;
}

function TutorialLayout() {
	const { url } = useLocation();
	const { params } = useRoute();
	const [lang] = useLanguage();

	const { html, meta } = useContent([lang, !params.step ? 'tutorial/index' : url]);
	useTitle(meta.title);
	useDescription(meta.description);

	// Preload the next chapter
	useEffect(() => {
		if (meta && meta.next) {
			getContent([lang, meta.next]);
		}
	}, [meta && meta.next, url]);

	return (
		<SolutionProvider>
			<Tutorial html={html} meta={meta} />
		</SolutionProvider>
	);
}
