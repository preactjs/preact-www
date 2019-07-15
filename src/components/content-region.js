import { h, Component } from 'preact';
import { connect } from 'unistore/preact';
import { memoize } from 'decko';
import Markdown from 'lib/markdown';
import Markup from 'preact-markup';
import widgets from './widgets';

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

const TYPES = {
	md: 'markdown',
	html: 'markup'
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
		.then(r => parseContent(r, ext));
});

function parseContent(text, ext) {
	let [, frontMatter] = text.match(FRONT_MATTER_REG) || [],
		meta = frontMatter && JSON.parse(frontMatter),
		content = text.replace(FRONT_MATTER_REG, '');

	return {
		type: TYPES[String(ext).toLowerCase()] || TYPES.md,
		content,
		meta
	};
}

@connect(({ lang }) => ({ lang }))
export default class ContentRegion extends Component {
	constructor(props) {
		super(props);
		// TODO: Remove this once it's fixed in `preact`
		// or `preact-render-to-string`
		this.state = {};
	}

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
		let headings = this.base.querySelectorAll('[id]'),
			{ onToc } = this.props,
			toc = (this.toc = []);
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
		if (onToc) onToc({ toc });
	}

	componentWillMount() {
		const b = (this.base = this.nextBase || this.__b);
		if (b && typeof document !== 'undefined') {
			const C = b.nodeName;
			this.bootTree = <C dangerouslySetInnerHTML={{ __html: b.innerHTML }} />;
		}
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
		{ type, content }
	) {
		if (!content) {
			/*global PRERENDER,__non_webpack_require__*/
			if (PRERENDER) {
				// this is all only run during prerendering

				let route = location.pathname == '/' ? '/index' : location.pathname;
				let data = __non_webpack_require__('fs').readFileSync(
					`content${route}.md`,
					'utf8'
				);
				const yaml = __non_webpack_require__('yaml');
				data = data.replace(FRONT_MATTER_REG, (s, y) => {
					const meta = yaml.eval('---\n' + y.replace(/^/gm, '  ') + '\n') || {};
					return '---\n' + JSON.stringify(meta) + '\n---\n';
				});
				if (typeof DOMParser === 'undefined') {
					global.DOMParser = new (__non_webpack_require__(
						'jsdom'
					)).JSDOM().window.DOMParser;
				}
				({ content, type } = parseContent(data, 'md'));
			} else if (this.bootTree) {
				return this.bootTree;
			}
		}

		return (
			<content-region {...props}>
				{content && (
					<Content type={type} content={content} components={COMPONENTS} />
				)}
			</content-region>
		);
	}
}

const Content = ({ type, content, ...props }) =>
	type === 'markdown' ? (
		<Markdown markdown={content} {...props} />
	) : type === 'markup' ? (
		<Markup markup={content} type="html" {...props} />
	) : null;
