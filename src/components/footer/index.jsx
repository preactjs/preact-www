import { useCallback } from 'preact/hooks';
import config from '../../config.json';
import { useLanguageContext } from '../../lib/i18n';
import { usePrerenderData } from '../../lib/prerender-data.jsx';
import style from './style.module.css';

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
 * copy(JSON.stringify([...list], null, 2));
 *
 * And paste the results into src/assets/contributors.json
 */

export default function Footer() {
	// Chosen by the route loader from `src/assets/contributors.json`, so the
	// name is server-rendered instead of costing a fetch after paint.
	const { contributor: contrib } = usePrerenderData();
	const { lang, setLang } = useLanguageContext();

	const onSelect = useCallback(e => setLang(e.target.value), [setLang]);

	return (
		<footer class={style.footer}>
			<div class={style.inner}>
				<p>
					<label class={style.lang}>
						Language:{' '}
						<select value={lang || 'en'} onInput={onSelect}>
							{Object.entries(config.locales).map(([id, label]) => (
								<option selected={id == lang} value={id}>
									{label}
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
