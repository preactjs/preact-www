import { h } from 'preact';

const VERSION = '10.0.4';
const URL = `https://github.com/preactjs/preact/releases/tag/${VERSION}`;

export default function ReleaseLink(props) {
	return (
		<a href={URL} {...props}>
			v{VERSION}
		</a>
	);
}
