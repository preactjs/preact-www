import { useEffect, useState } from 'preact/hooks';
import { fetchRelease } from '../../lib/github.js';
import { usePrerenderData } from '../../lib/prerender-data.jsx';
import config from '../../config.json' with { type: 'json' };

export default function ReleaseLink({ ...props }) {
	const { preactReleaseURL, preactVersion } = usePrerenderData();
	const [release, setRelease] = useState({
		url: preactReleaseURL,
		version: preactVersion
	});

	useEffect(() => {
		fetchRelease(config.repo).then((d) => {
			setRelease(d);
		});
	}, []);

	return (
		<a href={release.url} {...props}>
			v{release.version}
		</a>
	);
}
