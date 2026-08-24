import { ErrorBoundary } from 'preact-iso/lazy';
import { useIsHydrated } from '@pracht/core';
import { useBrowserQuery, useLocation } from '../../lib/router.js';
import { Repl } from './repl';
import { base64ToText } from './repl/query-encode.js';
import { fetchExample } from './repl/examples';
import { useResource } from '../../lib/use-resource';

import style from './repl/style.module.css';

/**
 * The page is server-rendered for its `<head>` and chrome, but the editor
 * itself is not: its starting code comes from `?code`, `?example` or
 * `localStorage`, and CodeMirror and the in-browser bundler are browser-only.
 * So the frame renders on the server and the editor mounts after hydration.
 */
export function ReplPage() {
	return (
		<div class={style.repl}>
			<style>{`
				main {
					height: 100% !important;
					overflow: hidden !important;
				}
			`}</style>
			<ErrorBoundary>
				<ReplEditor />
			</ErrorBoundary>
		</div>
	);
}

function ReplEditor() {
	const hydrated = useIsHydrated();
	// Safe here: this component only renders after hydration.
	const query = useBrowserQuery();
	const { route } = useLocation();

	if (!hydrated) return null;

	return <Editor query={query} route={route} />;
}

/**
 * Split from `ReplEditor` so the resource is only ever requested in the
 * browser — `useResource` suspends, and suspending during SSR would block the
 * render we deliberately skipped.
 *
 * @param {object} props
 * @param {Record<string, string>} props.query
 * @param {(url: string, replace?: boolean) => void} props.route
 */
function Editor({ query, route }) {
	const code = useResource(() => getInitialCode(query, route), [query]);

	return <Repl code={code} />;
}

/**
 * Go down the list of fallbacks to get initial code
 *
 * ?code -> ?example -> localStorage -> simple counter example
 *
 * @param {Record<string, string>} query
 * @param {(url: string, replace?: boolean) => void} route Navigation helper,
 *   passed in because this runs outside of the render pass.
 */
async function getInitialCode(query, route) {
	let code;
	if (query.code) {
		code = base64ToText(query.code);
	} else if (query.example) {
		code = await fetchExample(query.example);
		if (!code) {
			route('/repl', true);
		}
	}

	if (!code) {
		if (
			typeof window !== 'undefined' &&
			localStorage.getItem('preact-www-repl-code')
		) {
			code = localStorage.getItem('preact-www-repl-code');
		} else {
			const slug = 'counter-hooks';
			if (typeof window !== 'undefined') {
				route(`/repl?example=${encodeURIComponent(slug)}`, true);
			}
			code = await fetchExample(slug);
		}
	}

	return code;
}
