import { h } from 'preact';
import config from '../../config';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { useStore } from '../store-adapter';
import style from './style';
import { useLanguage } from '../../lib/i18n';

/*
 * To update this list, on https://github.com/preactjs/preact/graphs/contributors run:
 * $$('.contrib-person [data-hovercard-type="user"]:nth-of-type(2)').map(p=>p.textContent).filter(x => !/-bot$/.test(x)).join(' ')
 */
const CONTRIBS = 'developit marvinhagemeister andrewiggins JoviDeCroock jviide prateekbh ForsakenHarmony AlexGalays cristianbote pmkroeker rpetrich 38elements sventschui k1r0s robertknight mochiya98 mkxml NekR valotas AimWhy wardpeet braddunbar natevw gpoitch tanhauhau mhmdanas Rafi993 garybernhardt zouhir jmrog Download vutran yaodingyd harish2704 billneff79 mxstbr staeke ouzhenkun ivantm guybedford jridgewell Connormiha aralroca calebeby Alexendoo paranoidjk vkentta kitten yuqianma programbo Almo7aya LukasBombach btk5h hbroer jakearchibald hadeeb ngyikp johakr intrnl JiLiZART futantan jamesb3ll impronunciable feross btm6084 ddayguerrero namankheterpal KevinDoughty andybons gcraftyg jdanford egdbear niedzielski matthewp juicelink mseddon mitranim utkarshkukreti jmfirth 4cm4k1 vaneenige sangupta kruczy jackmoore scurker polemius amilajack lukeed teodragovic asolove rmacklin siddharthkp bmeurer jrf0110 wojtczal jeremy-coleman afzalsayed96 SomethingSexy'.split(
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
	const { url } = useStore(['url']).state;
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
