import fetch from 'node-fetch';

exports.handler = async function(event, context, callback) {
	const result = await repoInfo(
		event.queryStringParameters.repo || 'preactjs/preact'
	);
	return {
		statusCode: 200,
		body: JSON.stringify(result)
	};
};

function checkStatus(r) {
	if (!r.ok) {
		throw new Error(`${r.status}: Request failed for '${r.url}'`);
	}
	return r;
}

function memoize(fn) {
	const CACHE = {};
	return key => CACHE[key] || (CACHE[key] = fn(key));
}

// TODO: use GraphQL to avoid fetching so much data
const repoInfo = memoize(repo =>
	fetch(`https://api.github.com/repos/${repo}`)
		.then(checkStatus)
		.then(r => r.json())
		.catch(() => ({
			stargazers_count: 9999,
			watchers_count: 9999
		}))
);
