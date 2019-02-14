import { h } from 'preact';
import split from '../../lib/split-point';
import Page from './page';

const Repl = split(cb => {
	require.ensure([], (require) => {
		cb(require('./repl').default);
	}, () => Page, 'repl');
});

export default {
	default: Page,
	error: Page,
	Repl
};
