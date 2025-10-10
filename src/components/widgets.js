import { lazy } from 'preact-iso';

import Jumbotron from './jumbotron';
import GithubRepos from './github-repos';
import TodoList from './todo-list';
import Logo from './logo';
import Toc from './table-of-contents';
import Sponsors from './sponsors';
import TabGroup from './tab-group';

// Hoist the CSS to avoid FOUC
import './branding/style.module.css';
import './blog-overview/style.module.css';
import './we-are-using/style.module.css';

const Branding = lazy(() => import('./branding'));
const BlogOverview = lazy(() => import('./blog-overview'));
const WeAreUsing = lazy(() => import('./we-are-using'));

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
	TabGroup
};
