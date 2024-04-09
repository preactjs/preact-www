import { useEffect } from 'preact/hooks';
import Markup from 'preact-markup';
import widgets from '../widgets';
import style from './style.module.css';
import { useTranslation } from '../../lib/i18n';
import { TocContext } from '../table-of-contents';

const COMPONENTS = {
	...widgets,
	pre: widgets.CodeBlock,
	img(props) {
		return <img decoding="async" {...props} />;
	},
	a(props) {
		if (!props.target && props.href.match(/:\/\//)) {
			props.target = '_blank';
			props.rel = 'noopener noreferrer';
		}
		return <a {...props} />;
	}
};

for (let i = 1; i <= 6; i++) {
	const Tag = 'h' + i;
	COMPONENTS[Tag] = function header(props) {
		props.children = props.id
			? [<a href={'#' + props.id} />, props.children]
			: props.children;
		return <Tag {...props} />;
	};
}

function SiblingNav({ route, lang, start }) {
	let title = '';
	let url = '';
	if (route) {
		url = route.path.toLowerCase();
		title =
			typeof route.name === 'object'
				? route.name[lang || 'en']
				: route.name || route.title;
	}
	const label = useTranslation(start ? 'previous' : 'next');

	return (
		<a class={style.nextLink} data-dir-end={!start} href={url}>
			{start && <span class={style.icon}>&larr;&nbsp;</span>}
			{!start && <span class={style.icon}>&nbsp;&rarr;</span>}
			<span class={style.nextInner}>
				<span class={style.nextTitle}>
					<span class={style.nextTitleInner}>{title}</span>
				</span>
				<span class={style.nextUrl}>{label}</span>
			</span>
		</a>
	);
}

export default function ContentRegion({ content, components, ...props }) {
	const hasNav = !!(props.next || props.prev);
	components = Object.assign({}, COMPONENTS, components);

	useEffect(() => {
		const hash = location.hash;
		if (hash) {
			// Hack to force a scroll
			location.hash = '';
			location.hash = hash;
		}
	}, [props.current]);

	return (
		<content-region name={props.current} data-page-nav={hasNav} can-edit={props.canEdit}>
			{content && (
				<TocContext.Provider value={{ toc: props.toc }}>
					<Markup
						markup={content}
						type="html"
						trim={false}
						components={components}
					/>
				</TocContext.Provider>
			)}
			{hasNav && (
				<div class={style.nextWrapper}>
					{props.prev ? (
						<SiblingNav start lang={props.lang} route={props.prev} />
					) : (
						<span />
					)}
					{props.next ? (
						<SiblingNav lang={props.lang} route={props.next} />
					) : (
						<span />
					)}
				</div>
			)}
		</content-region>
	);
}
