import { h } from 'preact';
import style from './style.module.less';
import { useLocation } from 'preact-iso';
import { useStore } from '../store-adapter';

export const AVAILABLE_DOCS = [10, 8];

/**
 * Select box to switch the currently displayed docs version
 */
export default function DocVersion() {
	const location = useLocation();
	const { docVersion } = useStore(['docVersion']).state;

	return (
		<label class={style.root}>
			Version:{' '}
			<select
				value={docVersion}
				class={style.select}
				onChange={e => {
					const url = location.path.replace(/(v\d{1,2})/, `v${e.target.value}`);
					location.route(url);
				}}
			>
				{AVAILABLE_DOCS.map(v => {
					const suffix = v === 10 ? ' (current)' : '';
					return (
						<option value={v}>
							{v}.x{suffix}
						</option>
					);
				})}
			</select>
		</label>
	);
}
