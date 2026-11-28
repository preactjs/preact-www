import { useCallback } from 'preact/hooks';
import { useLocation, useRoute } from 'preact-iso';
import { flatDocPages } from '../../route-config.js';
import { useFallbackLang, useTranslate } from '../../lib/i18n.jsx';
import style from './style.module.css';

export const LATEST_MAJOR = 'v11';
export const PREVIEW_MAJOR = '';
export const AVAILABLE_DOCS = ['11', '10', '8'];

/**
 * Select box to switch the currently displayed docs version
 */
export default function DocVersion() {
	const { route } = useLocation();
	const { params, path } = useRoute();
	const { version, name } = params;
	const translate = useTranslate();
	const fallbackLang = useFallbackLang();

	const onChange = useCallback(
		(e) => {
			const version = e.currentTarget.value;
			const url = flatDocPages[version]?.[`/${name}`]
				? path.replace(/(v\d{1,2})/, version)
				: `/guide/${version}/getting-started`;
			route(url);
		},
		[path, route]
	);

	return (
		<label class={style.root}>
			<span lang={fallbackLang('i18n', 'docVersion')}>
				{translate('i18n', 'docVersion')}
			</span>
			<select value={version} class={style.select} onChange={onChange}>
				{AVAILABLE_DOCS.map((v) => {
					let suffix = '';
					if (LATEST_MAJOR.slice(1) == v) {
						suffix = ' (current)';
					} else if (PREVIEW_MAJOR.slice(1) == v) {
						suffix = ' (preview)';
					}
					return (
						<option key={v} value={`v${v}`}>
							{v}.x{suffix}
						</option>
					);
				})}
			</select>
		</label>
	);
}
