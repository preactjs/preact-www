import { useCallback } from 'preact/hooks';
import { useLocation, useRoute } from 'preact-iso';
import { docRoutes } from '../../lib/route-utils.js';
import style from './style.module.css';

export const LATEST_MAJOR = 'v10';
export const AVAILABLE_DOCS = ['10', '8'];

/**
 * Select box to switch the currently displayed docs version
 */
export default function DocVersion() {
	const { route } = useLocation();
	const { params, path } = useRoute();
	const { version, name } = params;

	const onChange = useCallback(
		e => {
			const version = e.currentTarget.value;
			const url = docRoutes[version]?.[`/${name}`]
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
					const suffix = LATEST_MAJOR.slice(1) == v ? ' (current)' : '';
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
