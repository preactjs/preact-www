import { h } from 'preact';
import { getCurrentUrl, route } from 'preact-router';
import { useStore } from './store-adapter';

function onChange(e) {
	const url = getCurrentUrl().replace(/(v\d{1,2})/, `v${e.target.value}`);
	route(url);
}

export const AVAILABLE_DOCS = [10, 8];

/**
 * Select box to switch the currently displayed docs version
 */
export default function DocVersion() {
	const { docVersion } = useStore(['docVersion']).state;

	return (
		<label class="doc-version">
			Version:{' '}
			<select value={docVersion} class="doc-version-select" onChange={onChange}>
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
