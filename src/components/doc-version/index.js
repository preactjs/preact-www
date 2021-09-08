import { h } from 'preact';
import config from '../../config.json';
import style from './style.module.less';
import { useLocation, useRoute } from 'preact-iso';
import { useCallback } from 'preact/hooks';

export const AVAILABLE_DOCS = [10, 8];

/**
 * Select box to switch the currently displayed docs version
 */
export default function DocVersion() {
	const { path, route } = useLocation();
	const { version, name } = useRoute().params;

	const onChange = useCallback(
		e => {
			const version = `v${e.target.value}`;
			const url = config.docs[version]?.[name]
				? path.replace(/(v\d{1,2})/, version)
				: `/guide/${version}/getting-started`;
			route(url);
		},
		[path, route]
	);

	return (
		<label class={style.root}>
			Version:{' '}
			<select value={version} class={style.select} onChange={onChange}>
				{AVAILABLE_DOCS.map(v => {
					const suffix = v === 10 ? ' (current)' : '';
					return (
						<option key={v} value={v}>
							{v}.x{suffix}
						</option>
					);
				})}
			</select>
		</label>
	);
}
