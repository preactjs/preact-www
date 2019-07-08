// const fs = require('fs');
// const { resolve } = require('path');
const flatMap = require('flatmap');
const config = require('./config.json');

const routes = flatMap(config.nav, arr => arr.path ? { path: arr.path , name: arr.name } : arr.routes);

module.exports = routes.map( route => ({
	url: route.path,
	title: route.name
	// ,data: fs.readFileSync(resolve(__dirname, '../', `content${route.path == '/' ? '/index' : route.path}.md`), 'utf8')
}));
