const fs = require('fs');
const path = require('path');
const marked = require('marked');
const flatMap = require('flatmap');
const config = require('./config.json');

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

	module.exports = routes.map(route => {
		const content = fs.readFileSync(
			path.resolve(
				__dirname,
				'../',
				`content/en/${route.path == '/' ? 'index' : route.path}.md`
			),
			{ encoding: 'utf8' }
		);
		const name = (route.name && route.name.en) || route.name;
		const packageName = route.path.substring(0, 4) === '/cli' ? 'Preact CLI' : 'Preact';
		const title = !name || name === 'Preact' ? 'Preact' : `${name} – ${packageName}`;
		const contentBody = content.split('---')[2];
		let description;
		if (title === 'Preact' || contentBody === undefined) {
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
}
