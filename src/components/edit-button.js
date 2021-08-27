import { useStore } from './store-adapter';

export default function EditThisPage({ show, isFallback }) {
	const store = useStore(['lang', 'url']);
	const { url, lang } = store.state;
	let path = url.replace(/\/$/, '') || '/index';
	path = !isFallback ? path + '.md' : '';
	const editUrl = `https://github.com/preactjs/preact-www/tree/master/content/${lang}${path}`;
	return (
		show && (
			<div class="edit-gh">
				<a
					class="edit-gh-link"
					href={editUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					{!isFallback ? 'Edit this Page' : 'Add translation'}
				</a>

				{isFallback && (
					<div class="edit-gh-fallback">
						<div class="edit-gh-fallback-inner">
							Could not find a translation for this page. You can help us out by{' '}
							<a href={editUrl}>adding one here</a>.
						</div>
					</div>
				)}
			</div>
		)
	);
}
