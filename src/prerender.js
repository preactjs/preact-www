// const fs = require('fs');
// const { resolve } = require('path');
const flatMap = require('flatmap');
const config = require('./config.json');

if (process.env.PRERENDER_HOME) {
	module.exports = [{
		url: config.nav[0].path,
		title: config.nav[0].title
	}];
}
else {
	const routes = flatMap(config.nav.concat(config.docs), arr =>
		arr.path ? { path: arr.path, name: arr.name } : arr.routes
	);

	module.exports = routes.map(route => ({
		url: route.path,
		title: route.name && route.name.en || route.name
		// ,data: fs.readFileSync(resolve(__dirname, '../', `content${route.path == '/' ? '/index' : route.path}.md`), 'utf8')
	}));
}
