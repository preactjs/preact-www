import { h } from 'preact';
import style from './style.less';
import { getCurrentUrl, route } from 'preact-router';

function onChange(e) {
	const url = getCurrentUrl().replace(/(v\d{1,2})/, `v${e.target.value}`);
	route(url);
}

/**
 * Select box to switch the currently displayed docs version
 */
export default function DocVersion() {
	const version = getCurrentDocVersion(getCurrentUrl());

	return (
		<label class={style.root}>
			Version:{' '}
			<select value={version} class={style.select} onChange={onChange}>
				<option value="10">10.x (current)</option>
				<option value="8">8.x</option>
			</select>
		</label>
	);
}

// `preact-router` doesn't support url paths like `/docs/:version/*`
// so we'll just use a plain regex for now.
const reg = /\/guide\/v(\d{1,2})\/.*/;
function getCurrentDocVersion() {
	const match = getCurrentUrl().match(reg);
	return match != null ? match[1] : 10;
}
