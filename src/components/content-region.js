import { h, Component } from 'preact';
import { Link } from 'preact-router';
import { memoize } from 'decko';
import yaml from 'yaml';
import Markdown from 'markdown';
import Markup from 'preact-markup';
import widgets from './widgets';

const COMPONENTS = {
	...widgets,
	pre: widgets.CodeBlock,
	a({ children, ...props }) {
		let Type = props.target || props.href.match(/\:\/\//) ? 'a' : Link;
		return <Type {...props}>{ children }</Type>;
	}
};

const TYPES = {
	md: 'markdown',
	html: 'markup'
};

const FETCH_OPTS = {
	cache: 'force-cache'
};

const EMPTY = {};

// Find YAML FrontMatter preceeding a markdown document
const FRONT_MATTER_REG = /^\s*\-\-\-\n\s*([\s\S]*?)\s*\n\-\-\-\n/i;

// Find a leading title in a markdown document
const TITLE_REG = /^\s*#\s+(.+)\n+/;

// only memoize in prod
const memoizeProd = process.env.NODE_ENV==='production' ? memoize : f=>f;

// fetch and parse a markdown document
const getContent = memoizeProd( name => {
	let url = `/content/${name.replace(/^\//,'')}`,
		[,ext] = url.match(/\.([a-z]+)$/i) || [];
	if (!ext) url += '.md';
	// attempt to use prefetched request
	let fetchPromise = process.env.NODE_ENV==='production' && window['_boostrap_'+url] || fetch(url, FETCH_OPTS);
	return fetchPromise
		.then( r => {
			if (!r.ok) {
				ext = 'md';
				r = fetch(`/content/${r.status}.md`, FETCH_OPTS);
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


const EXTERNAL_LINKS = {
	jsx: 'http://www.jasonformat.com/wtf-is-jsx/'
};

const postProcessMarkdown = content => (
	content.replace(/\[([a-z0-9 _&-]+)\]/gi, (s, link) => {
		let normalize = str => str.toLowerCase().replace(/[^\w\/]+/g,''),
			external = EXTERNAL_LINKS[normalize(link)],
			match = external || getAllPaths().filter( path => path && ~normalize(path).indexOf(normalize(link)) )[0];
		return match ? `<a href="${match}"${external?' target="_blank"':''}>${link}</a>` : s;
	})
);


export default class ContentRegion extends Component {
	fetch() {
		let n = 'load '+this.props.name;
		getContent(this.props.name).then( s => {
			this.setState(s);
			this.applyEmoji();
			let { onLoad } = this.props;
			if (onLoad) onLoad(s);
		});
	}

	applyEmoji() {
		let { content } = this.state;
		if (!content.match(/([^\\]):[a-z0-9_]+:/gi)) return;

		if (!this.emoji) {
			require(['../lib/gh-emoji'], ({ replace }) => {
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

	componentDidUpdate({ name }, { content }) {
		if (name!==this.props.name) this.fetch();
		if (content!==this.state.content) this.updateToc();
	}

	render({ name, children, ...props }, { type, content }) {
		// if (content) {
		// 	content = content.replace(/(\b|\s)\:[a-z0-9_]+\:(\b|\s)/gi, '$1🕑$2');
		// }
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
		<Markdown markdown={content} postProcess={postProcessMarkdown} {...props} />
	) : type==='markup' ? (
		<Markup markup={content} type="html" {...props} />
	) : null
);
