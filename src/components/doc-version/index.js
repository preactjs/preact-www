import { h } from 'preact';
import style from './style.less';

// TODO: Make it switch the url onChange
export default function DocVersion() {
	return (
		<label class={style.root}>
			Version:{' '}
			<select value="10" class={style.select}>
				<option value="10">10.x (current)</option>
				<option value="8">8.x</option>
			</select>
		</label>
	);
}
