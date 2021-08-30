import Page from './page';
import { lazy } from 'preact-iso';

const Repl = lazy(() => import('./repl'));

export default {
	default: Page,
	error: Page,
	Repl
};
