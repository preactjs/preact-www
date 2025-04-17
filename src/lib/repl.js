import { lazy } from 'preact-iso';

const CodeEditor = lazy(() => import('../components/code-editor'));
const Runner = lazy(() => import('../components/controllers/repl/runner'));

/**
 * @returns {void}
 */
export function preloadRepl() {
	CodeEditor.preload();
	Runner.preload();
}

export const Repl = {
	CodeEditor,
	Runner
};
