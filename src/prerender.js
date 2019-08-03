// const fs = require('fs');
// const { resolve } = require('path');
const config = require('./config.json');
// eslint-disable-next-line
const routes = config.nav.concat(config.docs).reduce((acc, arr) => {
	return acc.concat(arr.path ? { path: arr.path, name: arr.name } : arr.routes);
});

module.exports = routes.map(route => ({
	url: route.path,
	title: route.name
	// ,data: fs.readFileSync(resolve(__dirname, '../', `content${route.path == '/' ? '/index' : route.path}.md`), 'utf8')
}));
