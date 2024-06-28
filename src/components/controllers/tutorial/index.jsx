import { options } from 'preact';
import {
	useState,
	useReducer,
	useEffect,
	useContext,
	useRef,
	useMemo,
	useCallback
} from 'preact/hooks';
import { useRoute } from 'preact-iso';
import { TutorialContext, SolutionContext } from './contexts';
import { ErrorOverlay } from '../repl/error-overlay';
import { parseStackTrace } from '../repl/errors';
import cx from '../../../lib/cx';
import { InjectPrerenderData } from '../../../lib/prerender-data';
import { useResource } from '../../../lib/use-resource';
import { useLanguage } from '../../../lib/i18n';
import { Splitter } from '../../splitter';
import config from '../../../config.json';
import { MarkdownRegion } from '../markdown-region';
import style from './style.module.css';

const resultHandlers = new Set();
const realmHandlers = new Set();
const errorHandlers = new Set();

let resultCleanups, realmCleanups;

/**
 * @typedef TutorialCode
 * @property {string} setup
 * @property {string} initial
 * @property {string} final
 */

/**
 * @typedef TutorialMeta
 * @property {boolean} [code]
 * @property {boolean} [solvable]
 * @property {TutorialCode} [tutorial]
 */

/**
 * @param {{ html: string, meta: TutorialMeta }} props
 */
export function Tutorial({ html, meta }) {
	const { path } = useRoute();
	const [editorCode, setEditorCode] = useState(meta.tutorial?.initial || '');
	const [error, setError] = useState(null);
	const [showCodeOverride, toggleCode] = useReducer(s => !s, true);

	const content = useRef(null);
	const runner = useRef(null);

	const solutionCtx = useContext(SolutionContext);

	const hasCode = meta.code !== false;
	const showCode = showCodeOverride && hasCode;

	// TODO: CodeMirror v5 cannot load in Node, and loading only the runner
	// causes some bad jumping/pop-in. For the moment, this is the best option
	if (typeof window === 'undefined') return null;

	const { Runner, CodeEditor } = useResource(() => Promise.all([
		import('../../code-editor'),
		import('../repl/runner')
	]).then(([CodeEditor, Runner]) => ({ CodeEditor: CodeEditor.default, Runner: Runner.default })), ['repl']);

	useEffect(() => {
		if (meta.tutorial?.initial && editorCode !== meta.tutorial.initial) {
			setEditorCode(meta.tutorial.initial);
			solutionCtx.setSolved(false);
			content.current.scrollTo(0, 0);
		}
	}, [html]);


	const useResult = fn => {
		useEffect(() => {
			resultHandlers.add(fn);
			return () => resultHandlers.delete(fn);
		}, [fn]);
	};
	const useRealm = fn => {
		useEffect(() => {
			realmHandlers.add(fn);
			let r = runner.current;
			if (r && r.realm && r.realm.globalThis._require) {
				onRealm(r.realm);
			}
			return () => realmHandlers.delete(fn);
		}, [fn]);
	};
	const useError = fn => {
		useEffect(() => {
			errorHandlers.add(fn);
			return () => errorHandlers.delete(fn);
		}, [fn]);
	};

	const onError = error => {
		errorHandlers.forEach(f => f(error));
		setError(error);
	};

	const onSuccess = () => {
		if (resultCleanups) resultCleanups.forEach(f => f());
		resultCleanups = [];
		resultHandlers.forEach(f => {
			let cleanup = f(runner.current);
			if (cleanup) resultCleanups.push(cleanup);
		});
		setError(null);
	};

	const onRealm = realm => {
		if (realmCleanups) realmCleanups.forEach(f => f());
		realmCleanups = [];
		// this.realmCleanups = Array.from(this.realmHandlers).map(f => f()).filter(Boolean);
		realmHandlers.forEach(f => {
			let cleanup = f(realm);
			if (cleanup) realmCleanups.push(cleanup);
		});
	};

	const help = () => meta.tutorial?.final && setEditorCode(meta.tutorial?.final);

	return (
		<TutorialContext.Provider value={this}>
			<div
				class={cx(
					style.tutorialWrapper,
					meta.solvable && style.solvable,
					solutionCtx.solved && style.solved,
					showCode && style.showCode
				)}
			>
				<Splitter
					orientation="horizontal"
					force={!showCode ? '100%' : undefined}
					other={
						// TODO: CodeMirror v5 cannot load in Node, and loading only the runner
						// causes some bad jumping/pop-in. For the moment, this is the best option
						typeof window === 'undefined'
							? null
							: <Splitter
									orientation="vertical"
									other={
										<>
											<div class={style.output}>
												{error && (
													<ErrorOverlay
														name={error.name}
														message={error.message}
														stack={parseStackTrace(error)}
													/>
												)}
												<Runner
													ref={runner}
													onSuccess={onSuccess}
													onRealm={onRealm}
													onError={onError}
													code={editorCode}
												/>
											</div>
											{hasCode && (
												<button
													class={style.toggleCode}
													title="Toggle Code"
													onClick={toggleCode}
												>
													<span>Toggle Code</span>
												</button>
											)}
										</>
									}
							  >
								<div class={style.codeWindow}>
									<CodeEditor
										class={style.code}
										value={editorCode}
										error={error}
										onInput={setEditorCode}
									/>
								</div>
							</Splitter>
					}
				>
					<div class={style.tutorialWindow} ref={content}>
						<MarkdownRegion
							html={html}
							meta={meta}
							components={TUTORIAL_COMPONENTS}
						/>

						{meta.tutorial?.setup &&
							<TutorialSetupBlock
								code={meta.tutorial.setup}
								runner={runner}
								useResult={useResult}
								useRealm={useRealm}
								useError={useError}
							/>
						}

						<ButtonContainer meta={meta} showCode={showCode} help={help} />
					</div>
				</Splitter>

				<InjectPrerenderData
					name={path}
					data={{ html, meta }}
				/>
			</div>
		</TutorialContext.Provider>
	);
}

function ButtonContainer({ meta, showCode, help }) {
	const [lang] = useLanguage();

	return (
		<div class={style.buttonContainer}>
			{meta.prev && (
				<a class={style.prevButton} href={meta.prev}>
					{config.i18n.previous[lang] || config.i18n.previous.en}
				</a>
			)}
			{meta.solvable && (
				<button
					class={style.helpButton}
					onClick={help}
					disabled={!showCode}
					title="Show solution to this example"
				>
					{config.i18n.tutorial.solve[lang] ||
						config.i18n.tutorial.solve.en}
				</button>
			)}
			{meta.next && (
				<a class={style.nextButton} href={meta.next}>
					{meta.nextText || config.i18n.next[lang] || config.i18n.next.en}
				</a>
			)}
		</div>
	);
}

/** Handles running ```js:setup code blocks */
function TutorialSetupBlock({ code, runner, useResult, useRealm, useError }) {
	// Only run when we get new setup code.
	// Note: we run setup code as a component to allow hook usage:
	const Setup = useCallback(() => {
		if (typeof window === 'undefined') return null;

		const tutorial = useContext(TutorialContext);
		const solutionCtx = useContext(SolutionContext);
		const require = m => runner.current.realm.globalThis._require(m);

		const fn = new Function(
			'options',
			'state',
			'setState',
			'useState',
			'useEffect',
			'useRef',
			'useMemo',
			'useResult',
			'useRealm',
			'useError',
			'solutionCtx',
			'realm',
			'require',
			code
		);

		fn(
			options,
			tutorial.state,
			tutorial.setState.bind(tutorial),
			useState,
			useEffect,
			useRef,
			useMemo,
			useResult,
			useRealm,
			useError,
			solutionCtx,
			runner.current && runner.current.realm,
			require
		);

		return null;
	}, [code]);

	return <Setup />;
}

const TUTORIAL_COMPONENTS = {
	Solution
};

/** Shows a solution banner when the chapter is solved */
function Solution({ children }) {
	const { solved } = useContext(SolutionContext);
	const ref = useRef(null);

	useEffect(() => {
		if (solved) {
			requestAnimationFrame(() => {
				ref.current && ref.current.scrollIntoView({ behavior: 'smooth' });
			});
		}
	}, [solved]);

	if (!solved) return null;

	return (
		<div ref={ref} class={style.solution}>
			{children}
		</div>
	);
}
