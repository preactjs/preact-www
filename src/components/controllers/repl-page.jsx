import { useRoute } from 'preact-iso';
import { Repl } from './repl';
import { useExample } from './repl/examples';
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

	const [code, slug] = initialCode(query);

	return (
		<div class={style.repl}>
			<style>{`
				main {
					height: 100% !important;
					overflow: hidden !important;
				}
				footer {
					display: none !important;
				}
			`}</style>
			<Repl code={code} slug={slug} />
		</div>
	);
}

/**
 * Go down the list of fallbacks to get initial code
 *
 * ?code -> ?example -> localStorage -> simple counter example
 */
function initialCode(query) {
	let code, slug;
	if (query.code)  {
		try {
			code = useResource(() => querySafetyCheck(atob(query.code)), [query.code]);
		} catch (e) {}
	} else if (query.example) {
		code = useExample([query.example]);
		if (code) {
			slug = query.example;
			history.replaceState(
				null,
				null,
				`/repl?example=${encodeURIComponent(slug)}`
			);
		}
		else history.replaceState(null, null, '/repl');
	}

	if (!code) {
		if (typeof window !== 'undefined' && localStorage.getItem('preact-www-repl-code')) {
			code = localStorage.getItem('preact-www-repl-code');
		} else {
			slug = 'counter';
			if (typeof window !== 'undefined') {
				history.replaceState(
					null,
					null,
					`/repl?example=${encodeURIComponent(slug)}`
				);
			}
			code = useExample([slug]);
		}
	}

	return [code, slug];
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
