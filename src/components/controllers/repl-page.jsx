import { useLocation, useRoute } from 'preact-iso';
import { Repl } from './repl';
import { base64ToText } from './repl/query-encode.js';
import { fetchExample } from './repl/examples';
import { useResource } from '../../lib/use-resource';
import { useContent } from '../../lib/use-content';

import style from './repl/style.module.css';

export default function ReplPage() {
	const { query } = useRoute();

	useContent('repl');

	const code = useResource(() => getInitialCode(query), [query]);

	return (
		<div class={style.repl}>
			<style>{`
				main {
					height: 100% !important;
					overflow: hidden !important;
				}
			`}</style>
			<Repl code={code} />
		</div>
	);
}

/**
 * Go down the list of fallbacks to get initial code
 *
 * ?code -> ?example -> localStorage -> simple counter example
 */
async function getInitialCode(query) {
	const { route } = useLocation();
	let code;
	if (query.code)  {
		code = base64ToText(query.code);
	} else if (query.example) {
		code = await fetchExample(query.example);
		if (!code) {
			route('/repl', true);
		}
	}

	if (!code) {
		if (typeof window !== 'undefined' && localStorage.getItem('preact-www-repl-code')) {
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
