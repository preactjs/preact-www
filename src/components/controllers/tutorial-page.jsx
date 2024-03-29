import { useRoute, useLocation } from 'preact-iso';
import { SolutionProvider } from './tutorial/contexts';
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
	const { path } = useLocation();
	const { params } = useRoute();
	const [lang] = useLanguage();

	const { html, meta } = useContent([lang, !params.step ? 'tutorial/index' : path]);
	useTitle(meta.title);
	useDescription(meta.description);

	// Preload the next chapter
	// TODO: Webpack creates a circular dependency that
	// it cannot resolve. Temporarily disabled
	//useEffect(() => {
	//	if (meta && meta.next) {
	//		getContent([lang, meta.next]);
	//	}
	//}, [meta && meta.next, url]);

	return (
		<SolutionProvider>
			<Tutorial html={html} meta={meta} />
		</SolutionProvider>
	);
}
