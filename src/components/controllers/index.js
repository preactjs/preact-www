import { h } from 'preact';
import split from '../../lib/split-point';
import Page from './page';

export default {
	default: Page,
	error: Page,
	Repl: split(require('bundle?lazy!./repl'))
};
