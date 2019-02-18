const fs = require('fs');

const content = fs.readFileSync(__dirname + '/../content/index.md');

console.log('prerender config loaded');

module.exports = [
	{
		url: '/',
		data: content
	}
];
