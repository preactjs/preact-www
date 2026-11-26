import { lazy } from 'preact-iso';

import Toc from './table-of-contents/index.jsx';
import TabGroup from './tab-group/index.jsx';
import { CompetitionWinner, WinnerImage } from './competition-winner/index.jsx';

export const BlogOverview = lazy(() => import('./blog-overview/index.jsx'));
export const WeAreUsing = lazy(() => import('./we-are-using/index.jsx'));
const Branding = lazy(() => import('./branding/index.jsx'));
const TranslationScoreTable = lazy(
	() => import('./translation-score-table/index.jsx')
);

export default {
	Toc,
	BlogOverview,
	WeAreUsing,
	Branding,
	TabGroup,
	TranslationScoreTable,
	CompetitionWinner,
	WinnerImage
};
