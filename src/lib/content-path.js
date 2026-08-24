/**
 * Correct the few site paths that differ from the markdown file name/structure.
 *
 * Shared by the client (which fetches `/content/<lang><path>.json` when the
 * reader switches language) and the server (which reads
 * `content/<lang><path>.md` off disk in a loader).
 *
 * @param {string} path
 * @returns {string}
 */
export function getContentPath(path) {
	if (path == '/') return '/index';
	if (path == '/tutorial') return '/tutorial/index';
	return path;
}
