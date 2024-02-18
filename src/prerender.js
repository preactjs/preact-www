const fs = require('fs');
const path = require('path');
const marked = require('marked');
const yaml = require('yaml');
const {
	navRoutes,
	docRoutes,
	blogRoutes,
	tutorialRoutes
} = require('./lib/route-utils');
const { createTitle } = require('./lib/page-title');
const { fetchRelease } = require('./lambda/release');

const FRONT_MATTER_REG = /^\s*---\n\s*([\s\S]*?)\s*\n---\n/i;

// https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/markup
const MAX_DESCRIPTION_LENGTH = 200;

module.exports = async () => {
	const guideRoutes = [];
	for (const version of Object.keys(docRoutes)) {
		for (const route of Object.values(docRoutes[version])) {
			route.path = `/guide/${version}${route.path}`;
			guideRoutes.push(route);
		}
	}
	const routes = Object.values(navRoutes)
		.concat(Object.values(blogRoutes))
		.concat(Object.values(tutorialRoutes))
		.concat(guideRoutes)
		.filter(route => !/\/:/.test(route.path))
		.sort((a, b) => a.path.localeCompare(b.path));

	try {
		const preactRelease = await fetchRelease('preactjs/preact');
		globalThis.prerenderPreactVersion = preactRelease.version;
		globalThis.prerenderPreactReleaseUrl = preactRelease.url;
	} catch {}

	const pageData = routes.flatMap(route => {
		const url = route.path;
		const content = fs.readFileSync(
			path.resolve(__dirname, `../content/en/${url == '/' ? 'index' : url}.md`),
			{ encoding: 'utf8' }
		);
		const name = (route.name && route.name.en) || route.name;
		const fm = (content.match(FRONT_MATTER_REG) || [])[1];
		const meta = (fm && yaml.parse(`---\n${fm.replace(/^/gm, '  ')}\n`)) || {};
		const contentBody = content.replace(FRONT_MATTER_REG, '');
		const title = createTitle(meta.title || meta.name || name || 'Preact', url);
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

	// eslint-disable-next-line no-console
	console.log(
		'Routes:\n ',
		pageData
			.map(r => `\x1B[94m${r.url}\x1B[0m \x1B[2m\x1B[3m(${r.title})\x1B[0m`)
			.join('\n  ')
	);

	return pageData;
};
