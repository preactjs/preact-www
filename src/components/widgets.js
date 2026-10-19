import { lazy } from 'preact-iso';

import Jumbotron from './jumbotron/index.jsx';
import GithubRepos from './github-repos.jsx';
import TodoList from './todo-list.jsx';
import Logo from './logo.jsx';
import Toc from './table-of-contents/index.jsx';
import Sponsors from './sponsors/index.jsx';
import TabGroup from './tab-group/index.jsx';

const BlogOverview = lazy(() => import('./blog-overview/index.jsx'));
const WeAreUsing = lazy(() => import('./we-are-using/index.jsx'));
const Branding = lazy(() => import('./branding/index.jsx'));
const TranslationScoreTable = lazy(
	() => import('./translation-score-table/index.jsx')
);

export default {
	Toc,
	BlogOverview,
	Jumbotron,
	GithubRepos,
	TodoList,
	Sponsors,
	Logo,
	WeAreUsing,
	Branding,
	TabGroup,
	TranslationScoreTable
};
