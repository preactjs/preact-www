import config from '../../config.json';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import style from './style.module.css';
import { useLanguage } from '../../lib/i18n';

/*
 * To update the list, run:
 *
 * const api = u => fetch(`https://api.github.com${u}`).then(r=>r.json());
 * async function getContribs(org, repo, page=1) {
 *   let c = (await api(`/repos/${org}/${repo}/contributors?per_page=100&page=${page}`)).filter(u => u.contributions>1).map(u => u.login);
 *   if (c.length===100) c = c.concat(await getContribs(org, repo, page+1));
 *   return c;
 * }
 * const repos = await api('/orgs/preactjs/repos?per_page=100');
 * const list = new Set((await Promise.all(repos.map(r => getContribs(r.owner.login, r.name)))).flat().filter(n => !n.endsWith('-bot') && !n.endsWith('[bot]')));
 * copy(JSON.stringify(list, null, 2));
 *
 * And paste the results into src/assets/contributors.json
 */

/**
 * Display a random contributor of the list above.
 * @param {any[]} deps
 */
function useContributors(deps) {
	const [contributors, setContributors] = useState([]);
	const [value, setValue] = useState(
		contributors ? contributors[new Date().getMonth()] : undefined
	);
	useEffect(() => {
		fetch('/contributors.json')
			.then(r => r.json())
			.then(d => setContributors(d));
	}, []);
	useEffect(() => {
		if (contributors)
			setValue(contributors[(Math.random() * (contributors.length - 1)) | 0]);
	}, [...deps, contributors]);
	return value;
}

export default function Footer() {
	const { url } = useLocation();
	const contrib = useContributors([url]);
	const [lang, setLang] = useLanguage();

	const onSelect = useCallback(e => setLang(e.target.value), [setLang]);

	return (
		<footer class={style.footer}>
			<div class={style.inner}>
				<p>
					<label class={style.lang}>
						Language:{' '}
						<select value={lang || 'en'} onInput={onSelect}>
							{Object.keys(config.languages).map(id => (
								<option selected={id == lang} value={id}>
									{config.languages[id]}
								</option>
							))}
						</select>
						{lang && <code>?lang={lang}</code>}
					</label>
				</p>
				<p style="line-height: 1">
					Built by a bunch of{' '}
					<a
						href="https://github.com/preactjs/preact/graphs/contributors"
						target="_blank"
						rel="noopener noreferrer"
					>
						lovely people
					</a>{' '}
					{contrib && [
						' like ',
						<a
							href={'https://github.com/' + contrib}
							target="_blank"
							rel="noopener noreferrer"
						>
							@{contrib}
						</a>
					]}
					.
				</p>
			</div>
		</footer>
	);
}
