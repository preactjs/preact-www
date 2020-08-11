import Markup from 'preact-markup';
import widgets from './widgets';
import style from './content-region.less';
import { useTranslation } from '../lib/i18n';

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

export default function ContentRegion({ content, ...props }) {
	const hasNav = !!(props.next || props.prev);
	return (
		<content-region name={props.name} data-page-nav={hasNav}>
			{content && (
				<Markup
					// key={content}
					markup={content}
					type="html"
					trim={false}
					components={COMPONENTS}
				/>
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
