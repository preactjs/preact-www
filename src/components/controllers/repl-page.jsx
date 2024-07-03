import { useLocation, useRoute } from 'preact-iso';
import { Repl } from './repl';
import { fetchExample } from './repl/examples';
import { useContent, useResource } from '../../lib/use-resource';
import { useTitle, useDescription } from './utils';
import { useLanguage } from '../../lib/i18n';

import style from './repl/style.module.css';

export default function ReplPage() {
	const { query } = useRoute();
	const [lang] = useLanguage();

	const { meta } = useContent([lang, 'repl']);
	useTitle(meta.title);
	useDescription(meta.description);

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
		code = querySafetyCheck(atob(query.code));
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

async function querySafetyCheck(code) {
    return (
		!document.referrer ||
		document.referrer.indexOf(location.origin) === 0 ||
		// eslint-disable-next-line no-alert
		confirm('Are you sure you want to run the code contained in this link?')
    )
		? code
		: undefined;
}
