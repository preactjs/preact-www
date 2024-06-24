import { useState, useEffect } from 'preact/hooks';
import { Splitter } from '../../splitter';
import { EXAMPLES, getExample, loadExample } from './examples';
import { ErrorOverlay } from './error-overlay';
import { useStoredValue } from '../../../lib/localstorage';
import { useResource } from '../../../lib/use-resource';
import { parseStackTrace } from './errors';
import style from './style.module.css';
import REPL_CSS from './examples.css?raw';

/**
 * @param {Object} props
 * @param {string} props.code
 * @param {string} [props.slug]
 */
export function Repl({ code, slug }) {
	const [editorCode, setEditorCode] = useStoredValue('preact-www-repl-code', code);
	const [exampleSlug, setExampleSlug] = useState(slug || '');
	const [error, setError] = useState(null);
	const [copied, setCopied] = useState(false);

	// TODO: CodeMirror v5 cannot load in Node, and loading only the runner
	// causes some bad jumping/pop-in. For the moment, this is the best option
	if (typeof window === 'undefined') return null;

	const { Runner, CodeEditor } = useResource(() => Promise.all([
		import('../../code-editor'),
		import('./runner')
	]).then(([CodeEditor, Runner]) => ({ CodeEditor: CodeEditor.default, Runner: Runner.default })), ['repl']);

	const applyExample = (e) => {
		const slug = e.target.value;
		loadExample(getExample(slug).url)
			.then(code => {
				setEditorCode(code);
				setExampleSlug(slug);
				history.replaceState(
					null,
					null,
					`/repl?example=${encodeURIComponent(slug)}`
				);
		});
	};

	useEffect(() => {
		const example = getExample(exampleSlug);
		(async function () {
			if (example) {
				const code = await loadExample(example.url);
				if (location.search && code !== editorCode) {
					setExampleSlug('');
					history.replaceState(null, null, '/repl');
				}
			}
		})();
	}, [editorCode]);

	const share = () => {
		if (!exampleSlug) {
			history.replaceState(
				null,
				null,
				`/repl?code=${encodeURIComponent(btoa(editorCode))}`
			);
		}

		try {
			let input = document.createElement('input');
			input.style.cssText = 'position:absolute; left:0; top:-999px;';
			input.value = location.href;
			document.body.appendChild(input);
			input.select();
			document.execCommand('copy');
			input.blur();
			document.body.removeChild(input);
			setCopied(true);
			setTimeout(() => setCopied(false), 2500);
		} catch (err) {
			// eslint-disable-next-line no-console
			console.log(err);
		}
	};

	const onRealm = realm => {
		realm.globalThis.githubStars = window.githubStars;
	};

	return (
		<>
			<header class={style.toolbar}>
				<label>
					Examples:{' '}
					<select value={exampleSlug} onChange={applyExample}>
						<option value="" disabled>
							Select Example...
						</option>
						{EXAMPLES.map(function item(ex) {
							const selected =
								ex.slug !== undefined && ex.slug === exampleSlug;
							return ex.group ? (
								<optgroup label={ex.group}>{ex.items.map(item)}</optgroup>
							) : (
								<option selected={selected} value={ex.slug}>
									{ex.name}
								</option>
							);
						})}
					</select>
				</label>
				<button class={style.share} onClick={share}>
					{copied ? '🔗 Copied' : 'Share'}
				</button>
			</header>
			<div class={style.replWrapper}>
				<Splitter
					orientation="horizontal"
					other={
						<div class={style.output}>
							{error && (
								<ErrorOverlay
									name={error.name}
									message={error.message}
									stack={parseStackTrace(error)}
								/>
							)}
							<Runner
								onRealm={onRealm}
								onError={setError}
								onSuccess={() => setError(null)}
								css={REPL_CSS}
								code={editorCode}
							/>
						</div>
					}
				>
					<CodeEditor
						class={style.code}
						value={editorCode}
						error={error}
						onInput={setEditorCode}
					/>
				</Splitter>
			</div>
		</>
	);
}
