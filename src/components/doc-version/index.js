import { h } from 'preact';
import style from './style.less';
import { getCurrentUrl, route } from 'preact-router';
import { useStore } from '../store-adapter';

function onChange(e) {
	const url = getCurrentUrl().replace(/(v\d{1,2})/, `v${e.target.value}`);
	route(url);
}

const AVAILABLE_DOCS = [10, 8];

/**
 * Select box to switch the currently displayed docs version
 */
export default function DocVersion() {
	const { docVersion, preactVersion } = useStore([
		'docVersion',
		'preactVersion'
	]).state;

	// A simple `parseInt` works remarkeable well for getting the major version.
	// It works with release tags, like "10.0.0-beta.2".
	const major = parseInt(preactVersion, 10);

	return (
		<label class={style.root}>
			Version:{' '}
			<select value={docVersion} class={style.select} onChange={onChange}>
				{AVAILABLE_DOCS.map(v => {
					const suffix =
						v === major ? ' (current)' : v > major ? ' (next)' : '';
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
