import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { fetchRelease } from '../../lib/github';
import config from '../../config.json';

const VERSION = '10.0.4';
const URL = `https://github.com/preactjs/preact/releases/tag/${VERSION}`;

export default function ReleaseLink(props) {
	const [url, setUrl] = useState(URL);
	const [version, setVersion] = useState(VERSION);

	useEffect(() => {
		fetchRelease(config.repo)
			.catch(() => ({
				version: VERSION,
				url: URL
			}))
			.then(d => {
				setVersion(d.version);
				setUrl(d.url);
			});
	}, []);

	return (
		<a href={url} {...props}>
			v{version}
		</a>
	);
}
