import { useEffect, useState } from 'preact/hooks';
import { injectedPrerenderData, fetchRelease } from '../../lib/github';
import config from '../../config.json';

export default function ReleaseLink({ ...props }) {
	const [release, setRelease] = useState({
		url: globalThis.prerenderPreactReleaseUrl || injectedPrerenderData.preactReleaseUrl(),
		version: globalThis.prerenderPreactVersion || injectedPrerenderData.preactVersion()
	});

	useEffect(() => {
		fetchRelease(config.repo).then(d => {
			setRelease(d);
		});
	}, []);

	return (
		<a href={release.url} {...props}>
			v{release.version}
		</a>
	);
}
