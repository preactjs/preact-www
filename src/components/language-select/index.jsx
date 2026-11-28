import { useCallback } from 'preact/hooks';
import config from '../../config.json' with { type: 'json' };
import cx from '../../lib/cx.js';
import {
	useFallbackLang,
	useLanguageContext,
	useTranslate
} from '../../lib/i18n.jsx';
import style from './style.module.css';

/**
 * The site language picker
 *
 * @param {{ class?: string, focusFallback?: string }} props
 *   `focusFallback`: selector for where focus goes if a resize hides it
 *   (see `useFocusRescue`)
 */
export default function LanguageSelect({ class: className, focusFallback }) {
	// What the reader picked, also while the page waits to switch to it
	const { selectedLang: lang, setLang } = useLanguageContext();
	const translate = useTranslate();
	const fallbackLang = useFallbackLang();
	const onSelect = useCallback((e) => setLang(e.target.value), [setLang]);

	return (
		<label
			class={cx(style.lang, className)}
			data-focus-fallback={focusFallback}
		>
			<span lang={fallbackLang('i18n', 'language')}>
				{translate('i18n', 'language')}
			</span>
			<select value={lang || 'en'} onInput={onSelect}>
				{Object.entries(config.locales).map(([id, label]) => (
					<option selected={id == lang} value={id}>
						{label}
					</option>
				))}
			</select>
		</label>
	);
}
