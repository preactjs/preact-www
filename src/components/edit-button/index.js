import { useStore } from '../store-adapter';
import style from './style.less';
import { Fragment } from 'preact';

export default function EditThisPage({ show, isFallback }) {
	const store = useStore(['lang', 'url']);
	const { url, lang } = store.state;
	let path = url.replace(/\/$/, '') || '/index';
	path = !isFallback ? path + '.md' : '';
	const editUrl = `https://github.com/preactjs/preact-www/tree/master/content/${lang}${path}`;
	return (
		show && (
			<Fragment>
				<div class={style.wrapper}>
					<a
						class={style.edit}
						href={editUrl}
						target="_blank"
						rel="noopener noreferrer"
					>
						{!isFallback ? 'Edit this Page' : 'Add translation'}
					</a>

					{isFallback && (
						<div class={style.fallback}>
							<div class={style.fallbackInner}>
								Could not find a translation for this page. You can help us out
								by <a href={editUrl}>adding one here</a>.
							</div>
						</div>
					)}
				</div>
			</Fragment>
		)
	);
}
