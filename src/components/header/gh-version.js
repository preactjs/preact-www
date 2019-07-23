import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { fetchRelease } from '../../lib/github';
import config from '../../config.json';

export default function ReleaseLink(props) {
	const [version, setVersion] = useState('unknown');
	const [url, setUrl] = useState('#');
	useEffect(() => {
		fetchRelease(config.repo).then(d => {
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
