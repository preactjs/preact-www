import { h } from 'preact';
import style from './corner.less';

export default function Corner() {
	return (
		<a
			href="https://opencollective.com/preact"
			target="_blank"
			rel="noopener noreferrer"
			class={style.corner}
		>
			<div class={style.cornerText}>
				Help
				<br />
				Support Us
			</div>
		</a>
	);
}
