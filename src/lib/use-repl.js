import { useResource, createCacheKey, setupCacheEntry, CACHE } from './use-resource.js';

const loadChunks = () => Promise.all([
	import('../components/code-editor'),
	import('../components/controllers/repl/runner')
]).then(([CodeEditor, Runner]) => ({ CodeEditor: CodeEditor.default, Runner: Runner.default }));

/**
 * @returns {void}
 */
export function preloadRepl() {
	const cacheKey = createCacheKey(loadChunks, ['repl']);
	if (CACHE.has(cacheKey)) return;

	setupCacheEntry(loadChunks, cacheKey);
}

/**
 * @returns {{ CodeEditor: import('../components/code-editor').default, Runner: import('../components/controllers/repl/runner').default }}
 */
export function useRepl() {
	return useResource(loadChunks, ['repl']);
}
