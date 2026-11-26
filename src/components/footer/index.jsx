import { useEffect, useState } from 'preact/hooks';
import {
	HiddenLabel,
	useFallbackLang,
	useLanguageContext,
	useTranslate
} from '../../lib/i18n.jsx';
import LanguageSelect from '../language-select/index.jsx';
import { useResource } from '../../lib/use-resource.js';
import style from './style.module.css';

/*
 * To update the list, run:
 *
  const api = u => fetch(`https://api.github.com${u}`).then(r=>r.json());
  async function getContribs(org, repo, page=1) {
    let c = (await api(`/repos/${org}/${repo}/contributors?per_page=100&page=${page}`)).filter(u => u.contributions>1).map(u => u.login);
    if (c.length===100) c = c.concat(await getContribs(org, repo, page+1));
    return c;
  }
  const repos = await api('/orgs/preactjs/repos?per_page=100');
  const list = new Set((await Promise.all(repos.map(r => getContribs(r.owner.login, r.name)))).flat().filter(n => !n.endsWith('-bot') && !n.endsWith('[bot]')));
  copy(JSON.stringify([...list], null, '\t'));
 *
 * And paste the results into src/assets/contributors.json
 */

/**
 * Display a random contributor of the list above.
 *
 * The pick happens after hydration: choosing during render would give the
 * prerendered HTML and the client different names (a hydration mismatch).
 */
function useContributors() {
	const contributors = useResource(
		() => fetch('/contributors.json').then((r) => r.json()),
		['/contributors.json']
	);
	const [index, setIndex] = useState(0);

	useEffect(() => {
		setIndex((Math.random() * (contributors.length - 1)) | 0);
	}, [contributors.length]);

	return contributors[index];
}

export default function Footer() {
	const contrib = useContributors();
	const translate = useTranslate();
	const fallbackLang = useFallbackLang();
	const { lang } = useLanguageContext();

	return (
		<footer class={style.footer}>
			<p lang={lang === 'en' ? undefined : 'en'}>
				Built by a bunch of{' '}
				<a
					href="https://github.com/preactjs/preact/graphs/contributors"
					target="_blank"
					rel="noopener noreferrer"
				>
					lovely people
				</a>
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
			<div class={style.meta}>
				<LanguageSelect />
				<nav class={style.links} aria-labelledby="footer-links-label">
					<HiddenLabel id="footer-links-label" namespace="i18n" k="moreLinks" />
					<a
						href="/about/project-goals"
						lang={fallbackLang('headerNav', 'projectGoals')}
					>
						{translate('headerNav', 'projectGoals')}
					</a>
					<a
						href="/about/we-are-using"
						lang={fallbackLang('headerNav', 'weAreUsing')}
					>
						{translate('headerNav', 'weAreUsing')}
					</a>
					<a href="/branding" lang={fallbackLang('headerNav', 'branding')}>
						{translate('headerNav', 'branding')}
					</a>
					<a
						href="http://chat.preactjs.com/"
						lang={fallbackLang('i18n', 'chat')}
					>
						{translate('i18n', 'chat')}
					</a>
					<a
						href="https://opencollective.com/preact"
						lang={fallbackLang('i18n', 'supportUs')}
					>
						{translate('i18n', 'supportUs')}
					</a>
				</nav>
			</div>
		</footer>
	);
}
