import { Repl } from './repl';
import { useContent } from '../../lib/use-resource';
import { useTitle, useDescription } from './utils';
import { useLanguage } from '../../lib/i18n';

export default function ReplPage() {
	const { query } = useRoute();
	const [lang] = useLanguage();

	const { meta } = useContent([lang, 'repl']);
	useTitle(meta.title);
	useDescription(meta.description);

	return <Repl query={query} />;
}
