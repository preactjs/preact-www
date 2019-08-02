import { h, Component } from 'preact';
import { connect } from 'unistore/preact';
import { memoize } from 'decko';
import Markdown from 'lib/markdown';
import widgets from './widgets';
import { markdownToHtml } from '../lib/markdown';
import { localStorageGet } from '../lib/localstorage';
import { addLangToUrl } from '../lib/language';

const COMPONENTS = {
	...widgets,
	pre: widgets.CodeBlock,
	img(props) {
		return <img decoding="async" {...props} />;
	}
	// Component for `<a>` elements will be created dynamically to be able
	// to access information from context.
};

const EMPTY = {};

// Find YAML FrontMatter preceeding a markdown document
const FRONT_MATTER_REG = /^\s*---\n\s*([\s\S]*?)\s*\n---\n/i;

// only memoize in prod
const memoizeProd = process.env.NODE_ENV === 'production' ? memoize : f => f;

// fetch and parse a markdown document
const getContent = memoizeProd(([lang, name]) => {
	if (lang == '') lang = 'en';
	let path = lang !== 'en' ? `/content/lang/${lang}` : '/content',
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
			if (!r.ok && lang != 'en') {
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

export const getContentOnServer = PRERENDER
	? route => {
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

			// generate Table of Contents
			const html = markdownToHtml(parsed.content);
			const dom = new DOMParser().parseFromString(html, 'text/html');
			parsed.meta.toc = getToc(dom);

			return parsed;
	  }
	: () => {};

function parseContent(text) {
	let [, frontMatter] = text.match(FRONT_MATTER_REG) || [],
		meta = (frontMatter && JSON.parse(frontMatter)) || {},
		content = text.replace(FRONT_MATTER_REG, '');

	// hoist title
	const TITLE_REG = /^\s*#\s+(.+)\n+/;
	if (!meta.title) {
		let [, title] = content.match(TITLE_REG) || [];
		if (title) {
			content = content.replace(TITLE_REG, '');
			meta.title = title;
		}
	}

	// Many markdown formatters can generate the table of contents
	// automatically. To skip a specific heading the use an html
	// comment at the end of it. Example:
	//
	// ## Some random title <!-- omit in toc -->
	//
	if (meta.title) {
		meta.title = meta.title.replace(/\s*<!--.*-->/, '');
	}

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
				level: Math.round(level),
				element: headings[i]
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
			this.setState(s, () => {
				s.content = this.state.content;
				if (onLoad) onLoad(s);
				this.updateToc();
			});
			this.applyEmoji(s.content);
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
		let toc = (this.toc = getToc(this.base));
		const store = this.context.store;
		store.setState({
			...store.getState(),
			toc
		});
	}

	componentDidMount() {
		this.fetch();
	}

	componentDidUpdate({ name, lang }) {
		if (name !== this.props.name || lang !== this.props.lang) this.fetch();
	}

	render(
		{ store, name, children, onLoad, content: cachedContent, ...props },
		{ content }
	) {
		if (!content) {
			if (cachedContent) {
				content = cachedContent;
			} else if (PRERENDER) {
				// this is all only run during prerendering
				({ content } = getContentOnServer(location.pathname));
			}
		}

		function a(props) {
			const href = props.href;
			if (!props.target && props.href.match(/:\/\//)) {
				props.target = '_blank';
				props.rel = 'noopener noreferrer';
			} else if (href[0] != null && href[0] !== '#') {
				const { lang } = store.getState();
				if (lang) props.href = addLangToUrl(href);
			}
			return <a {...props} />;
		}

		return (
			<content-region {...props}>
				{content && (
					<Markdown
						key={content}
						content={content}
						components={{ ...COMPONENTS, a }}
					/>
				)}
			</content-region>
		);
	}
}
