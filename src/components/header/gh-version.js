import { h } from 'preact';
import { memoize } from 'decko';
import { useEffect, useState } from 'preact/hooks';
import { checkStatus } from '../../lib/request';

const fetchRelease = memoize(() =>
	fetch('https://api.github.com/repos/preactjs/preact/releases/latest')
		.then(checkStatus)
		.then(r => r.json())
		.then(d => ({
			version: d.tag_name || 'unknown',
			url: d.html_url || '#'
		}))
		.catch(() => ({
			url: '#',
			version: 'unknown'
		}))
);

export default function ReleaseLink(props) {
	const [version, setVersion] = useState('unknown');
	const [url, setUrl] = useState('#');
	useEffect(() => {
		fetchRelease().then(d => {
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
