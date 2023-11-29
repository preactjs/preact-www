import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { fetchRelease } from '../../lib/github';
import config from '../../config.json';

const releaseURL = version =>
	`https://github.com/preactjs/preact/releases/tag/${version}`;

export default function ReleaseLink({ preactVersion, ...props }) {
	const [url, setUrl] = useState(releaseURL(preactVersion));
	const [version, setVersion] = useState(preactVersion);

	useEffect(() => {
		fetchRelease(config.repo).then(d => {
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
