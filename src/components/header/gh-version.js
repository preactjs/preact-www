import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { fetchRelease } from '../../lib/github';
import config from '../../config.json';
import { useStore } from '../store-adapter';

const URL = 'https://github.com/' + config.repo;

export default function ReleaseLink(props) {
	const store = useStore(['preactVersion']);
	const { preactVersion } = store.state;
	const [url, setUrl] = useState(URL);
	useEffect(() => {
		fetchRelease(config.repo)
			.catch(() => ({
				version: preactVersion,
				url: URL
			}))
			.then(d => {
				const newVersion = d.version[0] === 'v' ? d.version : `v${d.version}`;
				store.update({ preactVersion: newVersion });
				setUrl(d.url);
			});
	}, []);

	return (
		<a href={url} {...props}>
			{preactVersion}
		</a>
	);
}
