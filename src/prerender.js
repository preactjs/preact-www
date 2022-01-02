const fs = require('fs');
const path = require('path');
const marked = require('marked');
const yaml = require('yaml');
const flatMap = require('flatmap');
const config = require('./config.json');

// Titles for various content areas
const groups = {
	'/v8': 'Preact Version 8',
	'/tutorial': 'Preact Tutorial',
	'/guide': 'Preact Guide',
	'/cli': 'Preact CLI',
	'': 'Preact'
};

const FRONT_MATTER_REG = /^\s*---\n\s*([\s\S]*?)\s*\n---\n/i;

// https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/markup
const MAX_DESCRIPTION_LENGTH = 200;

if (process.env.PRERENDER_HOME) {
	module.exports = [
		{
			url: config.nav[0].path,
			title: config.nav[0].title
		}
	];
} else {
	const routes = flatMap(config.nav.concat(config.docs), arr =>
		arr.path ? { path: arr.path, name: arr.name } : arr.routes
	);

	module.exports = flatMap(routes, function map(route) {
		const url = route.path;
		// Expand `/:x?` fields in URLs to prerender all URLs
		const FIELD = /\/:([\w.-]+)([*+?]?)/i;
		const field = FIELD.exec(url);
		if (field) {
			let start = url.substring(1, field.index);
			let dir = path.resolve(__dirname, '../content/en', start);
			const paths = fs
				.readdirSync(dir)
				.filter(rep => rep[0] !== '.' && rep.match(/\.md$/i))
				.map(rep => rep.replace(/(^index)?\.md$/i, ''));
			return flatMap(paths, rep => {
				let path = url.replace(FIELD, '/' + rep).replace(/\/$/, '');
				return map(Object.assign({}, route, { path }));
			});
		}
		const content = fs.readFileSync(
			path.resolve(__dirname, `../content/en/${url == '/' ? 'index' : url}.md`),
			{ encoding: 'utf8' }
		);
		const name = (route.name && route.name.en) || route.name;
		const fm = (content.match(FRONT_MATTER_REG) || [])[1];
		const meta = (fm && yaml.parse(`---\n${fm.replace(/^/gm, '  ')}\n`)) || {};
		const contentBody = content.replace(FRONT_MATTER_REG, '');
		let suffix = '';
		for (let pattern in groups) {
			if (url.match(pattern)) {
				suffix = groups[pattern];
				break;
			}
		}
		let title = meta.title || meta.name || name || 'Preact';
		if (suffix !== title) title += ' – ' + suffix;
		let description;
		if (meta.description) {
			description = meta.description;
		} else if (title === 'Preact' || contentBody === undefined) {
			description = 'Fast 3kB alternative to React with the same modern API.';
		} else {
			const _contentBody = contentBody.replace(/#.*\n/, '');
			description = marked(_contentBody)
				.replace(/<[^>]*>?/gm, '')
				.trimStart()
				.replace(/\n/gm, ' ')
				.substring(0, MAX_DESCRIPTION_LENGTH);
		}
		return {
			url: route.path,
			title,
			description
		};
	});

	console.log(
		'Routes:\n ',
		module.exports
			.map(r => `\x1B[94m${r.url}\x1B[0m \x1B[2m\x1B[3m(${r.title})\x1B[0m`)
			.join('\n  ')
	);
}
