import { useState } from 'preact/hooks';
import scoreManifest from 'virtual:translation-scores';

import style from './style.module.css';

/** @import { Locale } from '../../types.js' */

const locales = /** @type {Locale[]} */ (Object.keys(scoreManifest));

export default function ScoreTable() {
	const [locale, setLocale] = useState(locales[0]);

	return (
		<div>
			<label class={style.localeSelect}>
				Locale:{' '}
				<select
					onChange={(e) =>
						setLocale(/** @type {Locale} */ (e.currentTarget.value))
					}
				>
					{locales.map((locale) => (
						<option key={locale} value={locale}>
							{locale}
						</option>
					))}
				</select>
			</label>
			<table class={style.scoreTable}>
				<thead>
					<tr>
						<th>File</th>
						<th>Code</th>
						<th>Links</th>
						<th>Structure</th>
						<th>Total</th>
					</tr>
				</thead>
				<tbody>
					{scoreManifest[locale]
						.sort((a, b) => a.file.localeCompare(b.file))
						.map((entry) => (
							<tr
								key={entry.file}
								class={entry.score < 0.4 ? style.exceedsDriftLimit : ''}
							>
								<td>{entry.file}</td>
								<ScoreCell value={entry.code} />
								<ScoreCell value={entry.links} />
								<ScoreCell value={entry.structure} />
								<ScoreCell value={entry.score} />
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}

/**
 * @param {object} props
 * @param {number | null} props.value
 */
function ScoreCell({ value }) {
	return <td>{value === null ? '—' : value}</td>;
}
