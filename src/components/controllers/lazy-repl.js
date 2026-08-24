import { lazy } from 'preact-iso';

/**
 * The REPL's heavy parts — CodeMirror, an in-browser Rollup, and the preview
 * runner — split out so only the REPL and the tutorial pay for them.
 *
 * These used to live in the old `components/routes.jsx`, alongside the route
 * table. pracht owns routing now, so they sit with the components that use them.
 */
export const CodeEditor = lazy(() =>
	import('../../lib/repl').then(m => m.CodeEditor)
);
export const Runner = lazy(() => import('../../lib/repl').then(m => m.Runner));
export const ErrorOverlay = lazy(() =>
	import('../../lib/repl').then(m => m.ErrorOverlay)
);
export const Splitter = lazy(() =>
	import('../../lib/repl').then(m => m.Splitter)
);
