import { options } from 'preact';
import { lazy } from 'preact-iso';

const CodeEditor = lazy(() => import('../components/code-editor'));
const Runner = lazy(() => import('../components/controllers/repl/runner'));

// `preact-iso` doesn't forward refs to lazy-loaded components (should we?)
// so we need to manually do it here to support the tutorial which reads the runner ref
const oldDiff = options.__b;
options.__b = (vnode) => {
	if (vnode.type === Runner && vnode.ref) {
		vnode.props.ref = vnode.ref;
		vnode.ref = null;
	}

	if (oldDiff) oldDiff(vnode);
};

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
