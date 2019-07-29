import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { fetchRelease } from '../../lib/github';
import config from '../../config.json';

let VERSION = 'v10';
const URL = 'https://github.com/' + config.repo;

if (PRERENDER) {
	VERSION = require('../../../package.json').dependencies.preact.replace('^','');
}

export default function ReleaseLink(props) {
	const [version, setVersion] = useState();
	const [url, setUrl] = useState(URL);
	useEffect(() => {
		fetchRelease(config.repo)
			.catch(() => ({
				version: VERSION,
				url: URL
			}))
			.then(d => {
				setVersion(d.version[0] === 'v' ? d.version : `v${d.version}`);
				setUrl(d.url);
			});
	}, []);

	return (
		<a href={url} {...props}>
			{version}
		</a>
	);
}
