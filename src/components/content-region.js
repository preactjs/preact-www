import { h, Component } from 'preact';
import { connect } from 'unistore/preact';
import { memoize } from 'decko';
import yaml from 'yaml';
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
const FRONT_MATTER_REG = /^\s*\-\-\-\n\s*([\s\S]*?)\s*\n\-\-\-\n/i;

// Find a leading title in a markdown document
const TITLE_REG = /^\s*#\s+(.+)\n+/;

// only memoize in prod
const memoizeProd = process.env.NODE_ENV==='production' ? memoize : f=>f;


// fetch and parse a markdown document
const getContent = memoizeProd( ([lang, name]) => {
	let path = lang ? `/content/lang/${lang}` : '/content',
		url = `${path}/${name.replace(/^\//,'')}`,
		[,ext] = url.match(/\.([a-z]+)$/i) || [];
	if (!ext) url += '.md';
	// attempt to use prefetched request
	let fetchPromise = process.env.NODE_ENV==='production' && typeof window!=='undefined' && window['_boostrap_'+url] || fetch(url);
	return fetchPromise
		.then( r => {
			if (!r.ok) {
				// @TODO: allow falling back to english? (404 crashes dev server)
				// if (lang) return fetch(url.replace(/lang\/[^/]+\//,''));
				ext = 'md';
				r = fetch(`${path}/${r.status}.md`);
			}
			return r;
		})
		.then( r => r.text() )
		.then( r => parseContent(r, ext) );
});


function parseContent(text, ext) {
	let [,frontMatter] = text.match(FRONT_MATTER_REG) || [],
		meta = frontMatter && yaml.eval('---\n'+frontMatter.replace(/^/gm,'  ')+'\n') || {},
		content = text.replace(FRONT_MATTER_REG, '');
	if (!meta.title) {
		let [,title] = content.match(TITLE_REG) || [];
		if (title) {
			content = content.replace(TITLE_REG, '');
			meta.title = title;
		}
	}

	return {
		type: TYPES[String(ext).toLowerCase()] || TYPES.md,
		content,
		meta
	};
}


const getAllPaths = memoizeProd( () => {
	let config = require('../config'),
		reducer = (acc, route) => acc.concat(route.path || [], route.routes ? route.routes.reduce(reducer,[]) : []);
	return config.nav.reduce(reducer, []);
});




@connect( ({ lang }) => ({ lang }) )
export default class ContentRegion extends Component {
	fetch() {
		let { name, lang, onLoad } = this.props;
		getContent([lang, name]).then( s => {
			this.setState(s);
			this.applyEmoji();
			if (onLoad) onLoad(s);
		});
	}

	applyEmoji() {
		let { content } = this.state;
		if (!content.match(/([^\\]):[a-z0-9_]+:/gi)) return;

		if (!this.emoji) {
			import(/* webpackChunkName: "emoji" */ '../lib/gh-emoji').then(({ replace }) => {
				this.emoji = replace || EMPTY;
				this.applyEmoji();
			});
		}
		else if (typeof this.emoji==='function') {
			this.setState({ content: this.emoji(content) });
		}
	}

	updateToc() {
		let headings = this.base.querySelectorAll('[id]'),
			{ onToc } = this.props,
			toc = this.toc = [];
		for (let i=0; i<headings.length; i++) {
			let [,level] = String(headings[i].nodeName).match(/^h(\d)$/i) || [];
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

	componentDidMount() {
		this.fetch();
	}

	componentDidUpdate({ name, lang }, { content }) {
		if (name!==this.props.name || lang!==this.props.lang) this.fetch();
		if (content!==this.state.content) this.updateToc();
	}

	render({ store, name, children, onLoad, onToc, ...props }, { type, content }) {
		return (
			<content-region loading={!content} {...props}>
				{ content && (
					<Content type={type} content={content} components={COMPONENTS} />
				) }
			</content-region>
		);
	}
}

const Content = ({ type, content, ...props }) => (
	type==='markdown' ? (
		<Markdown markdown={content} {...props} />
	) : type==='markup' ? (
		<Markup markup={content} type="html" {...props} />
	) : null
);
