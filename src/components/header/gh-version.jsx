import { useEffect, useState } from 'preact/hooks';
import { fetchRelease } from '../../lib/github';
import { usePrerenderData } from '../../lib/prerender-data.jsx';
import { repo } from '../../app-config.js';

export default function ReleaseLink({ ...props }) {
	const { preactReleaseURL, preactVersion } = usePrerenderData();
	const [release, setRelease] = useState({
		url: preactReleaseURL,
		version: preactVersion
	});

	useEffect(() => {
		fetchRelease(repo).then(d => {
			setRelease(d);
		});
	}, []);

	return (
		<a href={release.url} {...props}>
			v{release.version}
		</a>
	);
}
