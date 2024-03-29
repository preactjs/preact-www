import { useEffect, useState } from 'preact/hooks';
import { fallbackData, fetchRelease } from '../../lib/github';
import config from '../../config.json';

export default function ReleaseLink({ ...props }) {
	const [release, setRelease] = useState({
		url: globalThis.prerenderPreactReleaseUrl || fallbackData.preactReleaseUrl,
		version: globalThis.prerenderPreactVersion || fallbackData.preactVersion
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
