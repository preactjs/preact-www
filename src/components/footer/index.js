import { h } from 'preact';
import config from '../../config.json';
import { useState, useEffect, useCallback } from 'preact/hooks';
import style from './style.module.less';
import { useLanguage } from '../../lib/i18n';
import { useLocation } from 'preact-iso';

/*
 * To update this list, on https://github.com/preactjs/preact/graphs/contributors run:
 * $$('.contrib-person [data-hovercard-type="user"]:nth-of-type(2)').map(p=>p.textContent).filter(x => !/-bot$/.test(x)).join(' ')
 */
const CONTRIBS = 'developit marvinhagemeister andrewiggins k1r0s cristianbote sventschui JoviDeCroock AlexGalays rpetrich valotas robertknight wardpeet kruczy pmkroeker NekR ForsakenHarmony jviide juicelink billneff79 yaodingyd prateekbh vutran rmacklin impronunciable zouhir scurker SolarLiner mseddon vaneenige lukeed kristoferbaxter reznord'.split(
	' '
);

/**
 * Display a random contributor of the list above.
 * @param {any[]} deps
 */
export function useContributors(deps) {
	const [value, setValue] = useState(CONTRIBS[new Date().getMonth()]);
	useEffect(() => {
		setValue(CONTRIBS[(Math.random() * (CONTRIBS.length - 1)) | 0]);
	}, deps);
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
					like{' '}
					<a
						href={'https://github.com/' + contrib}
						target="_blank"
						rel="noopener noreferrer"
					>
						@{contrib}
					</a>
					.
				</p>
			</div>
		</footer>
	);
}
