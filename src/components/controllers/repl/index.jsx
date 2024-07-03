import { useEffect, useState } from 'preact/hooks';
import { useLocation, useRoute } from 'preact-iso';
import { Splitter } from '../../splitter';
import { textToBase64 } from './query-encode.js';
import { EXAMPLES, fetchExample } from './examples';
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
export function Repl({ code }) {
	const { route } = useLocation();
	const { query } = useRoute();
	const [editorCode, setEditorCode] = useStoredValue('preact-www-repl-code', code);
	const [runnerCode, setRunnerCode] = useState(editorCode);
	const [error, setError] = useState(null);
	const [copied, setCopied] = useState(false);

	// TODO: CodeMirror v5 cannot load in Node, and loading only the runner
	// causes some bad jumping/pop-in. For the moment, this is the best option
	if (typeof window === 'undefined') return null;

	/**
	 * @type {{ Runner: import('../repl/runner').default, CodeEditor: import('../../code-editor').default }}
	 */
	const { Runner, CodeEditor } = useResource(() => Promise.all([
		import('../../code-editor'),
		import('./runner')
	]).then(([CodeEditor, Runner]) => ({ CodeEditor: CodeEditor.default, Runner: Runner.default })), ['repl']);

	const applyExample = (e) => {
		const slug = e.target.value;
		fetchExample(slug)
			.then(code => {
				setEditorCode(code);
				setRunnerCode(code);
				route(`/repl?example=${encodeURIComponent(slug)}`, true);
		});
	};

	const onEditorInput = (code) => {
		setEditorCode(code);

		// Clears the (now outdated) example & code query params
		// when a user begins to modify the code
		if (location.search) {
			route('/repl', true);
		}
	};

	useEffect(() => {
		const delay = setTimeout(() => {
			setRunnerCode(editorCode);
		}, 250);
		return () => clearTimeout(delay);
	}, [editorCode]);

	const share = () => {
		// No reason to share semi-sketchy btoa'd code if there's
		// a perfectly good example we can use instead
		if (!query.example) {
			// We use `history.replaceState` here as the code is only relevant on mount.
			// There's no need to notify the router of the change.
			history.replaceState(null, null, `/repl?code=${encodeURIComponent(textToBase64(editorCode))}`);
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
					<select value={query.example || ''} onChange={applyExample}>
						<option value="" disabled>
							Select Example...
						</option>
						{EXAMPLES.map(function item(ex) {
							const selected =
								ex.slug !== undefined && ex.slug === query.example;
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
								code={runnerCode}
							/>
						</div>
					}
				>
					<CodeEditor
						class={style.code}
						value={editorCode}
						error={error}
						onInput={onEditorInput}
					/>
				</Splitter>
			</div>
		</>
	);
}
