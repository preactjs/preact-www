import { h } from 'preact';
import style from './style.less';
import { getCurrentUrl, route } from 'preact-router';
import { useStore } from '../store-adapter';

function onChange(e) {
	const url = getCurrentUrl().replace(/(v\d{1,2})/, `v${e.target.value}`);
	route(url);
}

/**
 * Select box to switch the currently displayed docs version
 */
export default function DocVersion() {
	const { docVersion } = useStore(['docVersion']).state;

	return (
		<label class={style.root}>
			Version:{' '}
			<select value={docVersion} class={style.select} onChange={onChange}>
				<option value="10">10.x (current)</option>
				<option value="8">8.x</option>
			</select>
		</label>
	);
}
