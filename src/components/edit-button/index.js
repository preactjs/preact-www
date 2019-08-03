import { useStore } from '../store-adapter';
import style from './style.less';
import cx from '../../lib/cx';
import { Fragment } from 'preact';

export default function EditThisPage(props) {
	const store = useStore(['lang', 'url']);
	const { url, lang } = store.state;
	let path = url.replace(/\/$/, '') || '/index';
	const editUrl = `https://github.com/preactjs/preact-www/tree/master/content/${lang}${path}.md`;
	return (
		props.show && (
			<Fragment>
				<div class={cx(style.wrapper, props.isFallback && style.withFallback)}>
					<a
						class={style.edit}
						href={editUrl}
						target="_blank"
						rel="noopener noreferrer"
					>
						Edit this Page
					</a>
					{props.isFallback && (
						<div class={style.fallback}>
							<b>Error:</b> Could not find a translation for this page. You can
							help us out by <a href={editUrl}>adding one here</a>.
						</div>
					)}
				</div>
			</Fragment>
		)
	);
}
