import { h, Component } from 'preact';
import { connect } from 'unistore/preact';
import { memoize } from 'decko';
import Markdown from 'lib/markdown';
import widgets from './widgets';
import { markdownToHtml } from '../lib/markdown';
import Hydrator from '../lib/hydrator';

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

const EMPTY = {};

// Find YAML FrontMatter preceeding a markdown document
const FRONT_MATTER_REG = /^\s*---\n\s*([\s\S]*?)\s*\n---\n/i;

// only memoize in prod
const memoizeProd = process.env.NODE_ENV === 'production' ? memoize : f => f;

// fetch and parse a markdown document
const getContent = memoizeProd(([lang, name]) => {
	let path = lang ? `/content/lang/${lang}` : '/content',
		url = `${path}/${name.replace(/^\//, '')}`,
		[, ext] = url.match(/\.([a-z]+)$/i) || [];
	if (!ext) url += '.md';
	// attempt to use prefetched request
	let fetchPromise =
		(process.env.NODE_ENV === 'production' &&
			typeof window !== 'undefined' &&
			window['_boostrap_' + url]) ||
		fetch(url);
	return fetchPromise
		.then(r => {
			// fall back to english
			if (!r.ok && lang) {
				return fetch(url.replace(/lang\/[^/]+\//, ''));
			}
			return r;
		})
		.then(r => {
			if (r.ok) return r;
			ext = 'md';
			return fetch(`${path}/${r.status}.md`);
		})
		.then(r => r.text())
		.then(r => parseContent(r));
});

export function getContentOnServer(route) {
	if (!PRERENDER) return;
	if (route == '/') route = '/index';

	const fs = __non_webpack_require__('fs');
	let data = fs.readFileSync(`content${route}.md`, 'utf8');

	// convert frontmatter from yaml to json:
	const yaml = __non_webpack_require__('yaml');
	data = data.replace(FRONT_MATTER_REG, (s, y) => {
		const meta = yaml.eval('---\n' + y.replace(/^/gm, '  ') + '\n') || {};
		return '---\n' + JSON.stringify(meta) + '\n---\n';
	});

	if (typeof DOMParser === 'undefined') {
		const jsdom = __non_webpack_require__('jsdom');
		global.DOMParser = new jsdom.JSDOM().window.DOMParser;
	}

	const parsed = parseContent(data, 'md');
	parsed.meta = parsed.meta || {};

	// hoist title
	const TITLE_REG = /^\s*#\s+(.+)\n+/;
	if (!parsed.meta.title) {
		let [, title] = parsed.content.match(TITLE_REG) || [];
		if (title) {
			parsed.content = parsed.content.replace(TITLE_REG, '');
			parsed.meta.title = title;
		}
	}

	// generate Table of Contents
	const html = markdownToHtml(parsed.content);
	const dom = new DOMParser().parseFromString(html, 'text/html');
	parsed.meta.toc = getToc(dom);

	return parsed;
}

function parseContent(text) {
	let [, frontMatter] = text.match(FRONT_MATTER_REG) || [],
		meta = frontMatter && JSON.parse(frontMatter),
		content = text.replace(FRONT_MATTER_REG, '');

	return {
		content,
		meta
	};
}

export function getToc(root) {
	let headings = root.querySelectorAll('[id]'),
		toc = [];
	for (let i = 0; i < headings.length; i++) {
		let [, level] = String(headings[i].nodeName).match(/^h(\d)$/i) || [];
		if (level) {
			toc.push({
				text: headings[i].textContent,
				id: headings[i].getAttribute('id'),
				level: Math.round(level)
			});
		}
	}
	return toc;
}

@connect(({ lang }) => ({ lang }))
export default class ContentRegion extends Component {
	state = {};

	fetch() {
		let { name, lang, onLoad } = this.props;
		getContent([lang, name]).then(s => {
			this.setState(s);
			this.applyEmoji(s.content);
			if (onLoad) onLoad(s);
		});
	}

	applyEmoji(content) {
		content = content || this.state.content;
		if (!content.match(/([^\\]):[a-z0-9_]+:/gi)) return;

		if (!this.emoji) {
			import(/* webpackChunkName: "emoji" */ '../lib/gh-emoji').then(
				({ replace }) => {
					this.emoji = replace || EMPTY;
					this.applyEmoji();
				}
			);
		} else if (typeof this.emoji === 'function') {
			this.setState({ content: this.emoji(content) });
		}
	}

	updateToc() {
		let { onToc } = this.props;
		let toc = (this.toc = getToc(this.base));
		if (onToc) onToc({ toc });
	}

	componentDidMount() {
		this.fetch();
	}

	componentDidUpdate({ name, lang }, { content }) {
		if (name !== this.props.name || lang !== this.props.lang) this.fetch();
		if (content !== this.state.content) this.updateToc();
	}

	render(
		{ store, name, children, onLoad, onToc, data, ...props },
		{ content }
	) {
		// const regionHtml = this.regionHtml || (this.regionHtml = {});

		if (!content) {
			if (data) {
				({ content } = data);
			} else if (PRERENDER) {
				// this is all only run during prerendering
				({ content } = getContentOnServer(location.pathname));
			}
		}

		// if (!content) {
		// 	console.warn('No content received (name="'+name+'"), falling back to regionHtml.');
		// 	props.dangerouslySetInnerHTML = `<div>${regionHtml}</div>`;
		// }

		return (
			<content-region {...props}>
				<Hydrator
					component={Markdown}
					boot={!!content}
					content={content}
					components={COMPONENTS}
				/>
				{/*
				{content && (
					<Markdown
						key={content}
						type={type}
						content={content}
						components={COMPONENTS}
					/>
				)}
				*/}
			</content-region>
		);
	}
}
