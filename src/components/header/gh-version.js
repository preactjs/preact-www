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
				store.update({ preactVersion: d.version });
				setUrl(d.url);
			});
	}, []);

	return (
		<a href={url} {...props}>
			v{preactVersion}
		</a>
	);
}
