import { useCallback } from 'preact/hooks';
import { languages } from '../../app-config.js';
import { useLanguage } from '../../lib/i18n';
import { useResource } from '../../lib/use-resource';
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

/**
 * Display a random contributor of the list above.
 */
function useContributors() {
	const contributors = useResource(
		() =>
			fetch('/contributors.json', {
				credentials: 'include',
				mode: 'no-cors',
				priority: 'low'
			}).then(r => r.json()),
		['/contributors.json']
	);

	return contributors[(Math.random() * (contributors.length - 1)) | 0];
}

export default function Footer() {
	const contrib = useContributors();
	const [lang, setLang] = useLanguage();

	const onSelect = useCallback(e => setLang(e.target.value), [setLang]);

	return (
		<footer class={style.footer}>
			<div class={style.inner}>
				<p>
					<label class={style.lang}>
						Language:{' '}
						<select value={lang || 'en'} onInput={onSelect}>
							{Object.keys(languages).map(id => (
								<option selected={id == lang} value={id}>
									{languages[id]}
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
