import { useStore } from '../store-adapter';
import style from './style.less';

export default function EditThisPage(props) {
	const store = useStore(['lang', 'url']);
	const { url, lang } = store.state;
	let path = url.replace(/\/$/, '') || '/index';
	let editUrl = `https://github.com/preactjs/preact-www/tree/master/content/${lang}${path}.md`;
	return (
		props.show && (
			<div class={style.wrapper}>
				<a
					class={style.edit}
					href={editUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					Edit this Page
				</a>
			</div>
		)
	);
}
