import { useEffect, useMemo } from 'preact/hooks';
import cx from '../../../lib/cx';
import ContentRegion from '../../content-region';
import config from '../../../config.json';
import style from './style.module.css';
import Footer from '../../footer';
import Sidebar from './sidebar';
import Hydrator from '../../../lib/hydrator';
import EditThisPage from '../../edit-button';
import { InjectPrerenderData } from '../../../lib/prerender-data';
import { isDocPage } from '../../../lib/docs';
import { useStore } from '../../store-adapter';
import { AVAILABLE_DOCS } from '../../doc-version';
import { Time } from '../../time';
import { usePage, getContentId } from '../utils';

export default function Page({ route, prev, next }, ctx) {
	const store = useStore(['url', 'lang', 'docVersion']);
	const { loading, meta, content, html, current, isFallback } = usePage(
		route,
		store.state.lang
	);
	const urlState = store.state;
	const url = useMemo(() => urlState.url, [current]);

	const docsUrl = useMemo(
		() => url.replace(/(v\d{1,2})/, `v${AVAILABLE_DOCS[0]}`),
		[url]
	);

	const layout = `${meta.layout || 'default'}Layout`;
	const name = getContentId(route);

	const isReady = !loading;

	// workaround: we toc in the store in order for <table-of-contents> to pick it up.
	if (meta.toc && ctx.store.getState().toc !== meta.toc) {
		ctx.store.setState({
			toc: meta.toc
		});
	}

	// Note:
	// "name" is the exact page ID from the URL
	// "current" is the currently *displayed* page ID.

	// `current` is null during SSR
	const canEdit =
		(current && current !== 'index') || (!current && route.path !== '/');
	const isBlog = route.path.startsWith('/blog/');
	const hasSidebar = meta.toc !== false && isDocPage(url);

	useEffect(() => {
		if (location.hash) {
			const anchor = document.querySelector(location.hash);
			if (anchor) {
				// Do not use scrollIntoView as it will cause
				// the heading to be covered by the header
				scrollTo({ top: anchor.offsetTop });
			}
		}
	}, [html]);

	return (
		<div class={cx(style.page, style[layout], hasSidebar && style.withSidebar)}>
			<progress-bar showing={loading} />
			<div class={style.outer}>
				<Hydrator
					wrapperProps={{ class: style.sidebarWrap }}
					component={Sidebar}
					boot={isReady}
					show={hasSidebar}
				/>
				<div class={style.inner}>
					{isDocPage(url) && +store.state.docVersion !== AVAILABLE_DOCS[0] && (
						<div class={style.oldDocsWarning}>
							You are viewing the documentation for an older version of Preact.{' '}
							<a href={docsUrl}>Switch to the current version →</a>
						</div>
					)}
					<Hydrator
						boot={isReady}
						component={EditThisPage}
						show={canEdit}
						isFallback={isFallback}
					/>
					{isBlog && <BlogMeta meta={meta} />}
					<Hydrator
						component={ContentRegion}
						boot={!!html}
						current={current}
						content={html}
						prev={prev}
						next={next}
						lang={store.state.lang}
					/>
					<Footer />
				</div>
			</div>
			<InjectPrerenderData
				name={name}
				data={{
					content,
					meta: { ...meta, toc: undefined }
				}}
			/>
		</div>
	);
}

function BlogMeta({ meta }) {
	return (
		<div class={style.blogMeta}>
			{meta.date && <Time value={meta.date} />}
			{Array.isArray(meta.authors) && meta.authors.length > 0 && (
				<>
					, written by{' '}
					<address class={style.authors}>
						{meta.authors.map((author, i, arr) => {
							const authorData = config.blogAuthors.find(
								data => data.name === author
							);
							return (
								<span key={author} class={style.author}>
									{authorData ? (
										<a
											href={authorData.link}
											target="_blank"
											rel="noopener noreferrer"
										>
											{author}
										</a>
									) : (
										<span>{author}</span>
									)}
									{i < arr.length - 2
										? ', '
										: i === arr.length - 2
										? ' and '
										: null}
								</span>
							);
						})}
						{(meta.translation_by || []).map((author, i, arr) => {
							const authorData = config.blogAuthors.find(
								data => data.name === author
							);
							return (
								<>
									{', translated by '}
									<span key={author} class={style.author}>
										{authorData ? (
											<a
												href={authorData.link}
												target="_blank"
												rel="noopener noreferrer"
											>
												{author}
											</a>
										) : (
											<span>{author}</span>
										)}
										{i < arr.length - 2
											? ', '
											: i === arr.length - 2
											? ' and '
											: null}
									</span>
								</>
							);
						})}
					</address>
				</>
			)}
		</div>
	);
}
