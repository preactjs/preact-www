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
import { ErrorBoundary, useLocation } from 'preact-iso';
import { TutorialContext, SolutionContext } from './contexts.jsx';
import { parseStackTrace } from '../repl/errors.js';
import cx from '../../../lib/cx.js';
import { CodeEditor, Runner, ErrorOverlay, Splitter } from '../../routes.jsx';
import { useFallbackLang, useTranslate } from '../../../lib/i18n.jsx';
import { MarkdownRegion } from '../markdown-region.jsx';
import { hasInputSinceNavigation } from '../../../lib/reader-input.js';
import LanguageSelect from '../../language-select/index.jsx';
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
 * @param {{ path: string, html: string, meta: TutorialMeta }} props
 */
export function Tutorial({ path, html, meta }) {
	const { route, url, path: routePath } = useLocation();
	const [editorCode, setEditorCode] = useState(meta.tutorial?.initial || '');
	const [runnerCode, setRunnerCode] = useState(editorCode);
	// Bumped (on Solve, or when the unedited starter code is translated) to make
	// the editor take `editorCode`, which it otherwise only does on a new chapter
	const [editorResets, resetEditor] = useReducer((n) => n + 1, 0);
	const [error, setError] = useState(null);
	const [showCodeOverride, toggleCode] = useReducer((s) => !s, true);
	const translate = useTranslate();
	const fallbackLang = useFallbackLang();

	const content = useRef(null);
	const runner = useRef(null);

	const solutionCtx = useContext(SolutionContext);

	const hasCode = meta.code !== false;
	const showCode = showCodeOverride && hasCode;

	// TODO: Needs some work for prerendering to not cause pop-in
	if (typeof window === 'undefined') return null;

	const starter = useRef({ path, code: meta.tutorial?.initial });
	useEffect(() => {
		const initial = meta.tutorial?.initial;
		const prev = starter.current;
		starter.current = { path, code: initial };
		if (!initial || editorCode === initial) return;
		const sameChapter = prev.path === path;
		// A translation of this chapter's starter code only replaces it unedited
		if (sameChapter && editorCode !== prev.code) return;
		setEditorCode(initial);
		setRunnerCode(initial);
		resetEditor();
		if (!sameChapter) solutionCtx.setSolved(false);
	}, [meta.tutorial?.initial]);

	// A new chapter starts at its top, also for keyboard focus if it was in the
	// lesson (e.g. on the reused Next Page link), unless the reader has done
	// anything while it loaded: focus they moved within the lesson stays in view
	const focusAtNavigation = useRef(/** @type {Element | null} */ (null));
	useEffect(() => {
		focusAtNavigation.current = document.activeElement;
	}, [routePath]);
	const shownPath = useRef(path);
	useEffect(() => {
		if (shownPath.current === path) return;
		shownPath.current = path;
		const pane = content.current;
		pane.scrollTo(0, 0);
		const active = document.activeElement;
		const inPane = active && active !== pane && pane.contains(active);
		if (active !== focusAtNavigation.current) {
			if (inPane) active.scrollIntoView({ block: 'nearest' });
			return;
		}
		if (hasInputSinceNavigation()) return;
		const heading = pane.querySelector('h1');
		if (heading && (!active || active === document.body || inPane)) {
			if (!heading.hasAttribute('tabindex')) {
				heading.setAttribute('tabindex', '-1');
				heading.addEventListener(
					'blur',
					() => heading.removeAttribute('tabindex'),
					{ once: true }
				);
			}
			heading.focus({ preventScroll: true });
		}
	}, [path]);

	useEffect(() => {
		const delay = setTimeout(() => {
			setRunnerCode(editorCode);
		}, 250);
		return () => clearTimeout(delay);
	}, [editorCode]);

	const useResult = (fn) => {
		useEffect(() => {
			resultHandlers.add(fn);
			return () => resultHandlers.delete(fn);
		}, [fn]);
	};
	const useRealm = (fn) => {
		useEffect(() => {
			realmHandlers.add(fn);
			let r = runner.current;
			if (r && r.realm && r.realm.globalThis._require) {
				onRealm(r.realm);
			}
			return () => realmHandlers.delete(fn);
		}, [fn]);
	};
	const useError = (fn) => {
		useEffect(() => {
			errorHandlers.add(fn);
			return () => errorHandlers.delete(fn);
		}, [fn]);
	};

	const onError = (error) => {
		errorHandlers.forEach((f) => f(error));
		setError(error);
	};

	const onSuccess = () => {
		if (resultCleanups) resultCleanups.forEach((f) => f());
		resultCleanups = [];
		resultHandlers.forEach((f) => {
			let cleanup = f(runner.current);
			if (cleanup) resultCleanups.push(cleanup);
		});
		setError(null);
	};

	const onRealm = (realm) => {
		if (realmCleanups) realmCleanups.forEach((f) => f());
		realmCleanups = [];
		// this.realmCleanups = Array.from(this.realmHandlers).map(f => f()).filter(Boolean);
		realmHandlers.forEach((f) => {
			let cleanup = f(realm);
			if (cleanup) realmCleanups.push(cleanup);
		});
	};

	const help = () => {
		if (meta.tutorial?.final) {
			const { pathname, search, hash } = location;
			if (!new URLSearchParams(search).has('solved')) {
				route(`${pathname}${search ? `${search}&` : '?'}solved${hash}`, true);
			}
			setEditorCode(meta.tutorial?.final);
			resetEditor();
		}
	};

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
				<ErrorBoundary>
					<Splitter
						orientation="horizontal"
						force={!showCode ? '100%' : undefined}
						other={
							<Splitter
								orientation="vertical"
								other={
									<>
										{/* Clipped away along with the editor */}
										<div
											id="tutorial-output"
											class={style.output}
											inert={!showCode}
										>
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
												code={runnerCode}
											/>
										</div>
										{hasCode && (
											<button
												class={style.toggleCode}
												aria-label={translate('i18n', 'codeEditor')}
												lang={fallbackLang('i18n', 'codeEditor')}
												title={translate('i18n', 'codeEditor')}
												aria-expanded={showCode}
												aria-controls="tutorial-code tutorial-output"
												onClick={toggleCode}
											/>
										)}
									</>
								}
							>
								<div
									id="tutorial-code"
									class={style.codeWindow}
									inert={!showCode}
								>
									<CodeEditor
										class={style.code}
										value={editorCode}
										error={error}
										slug={`${url}#${editorResets}`}
										onInput={setEditorCode}
									/>
								</div>
							</Splitter>
						}
					>
						<div class={style.tutorialWindow} ref={content}>
							<MarkdownRegion
								path={path}
								html={html}
								meta={meta}
								components={TUTORIAL_COMPONENTS}
							/>

							{meta.tutorial?.setup && (
								<TutorialSetupBlock
									code={meta.tutorial.setup}
									runner={runner}
									useResult={useResult}
									useRealm={useRealm}
									useError={useError}
								/>
							)}

							<ButtonContainer meta={meta} showCode={showCode} help={help} />
							{/* No footer here; on phones it's in the header's menu too */}
							<LanguageSelect class={style.language} />
						</div>
					</Splitter>
				</ErrorBoundary>
			</div>
		</TutorialContext.Provider>
	);
}

function ButtonContainer({ meta, showCode, help }) {
	const translate = useTranslate();
	const fallbackLang = useFallbackLang();
	const nextKey = meta.code == false ? 'beginTutorial' : 'nextPage';

	return (
		<div class={style.buttonContainer}>
			{meta.prev && (
				<a
					class={style.prevButton}
					href={meta.prev}
					lang={fallbackLang('i18n', 'previousPage')}
				>
					{translate('i18n', 'previousPage')}
				</a>
			)}
			{meta.solvable && (
				<button
					class={style.helpButton}
					onClick={help}
					disabled={!showCode}
					title="Show solution to this example"
					lang={fallbackLang('i18n', 'solve')}
				>
					{translate('i18n', 'solve')}
				</button>
			)}
			{meta.next && (
				<a
					class={style.nextButton}
					href={meta.next}
					lang={fallbackLang('i18n', nextKey)}
				>
					{translate('i18n', nextKey)}
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
		const require = (m) => runner.current.realm.globalThis._require(m);

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
	const ref = /** @type {import('preact').RefObject<HTMLDivElement | null>} */ (
		useRef(null)
	);

	useEffect(() => {
		if (solved) {
			requestAnimationFrame(() => {
				ref.current?.scrollIntoView({ behavior: 'smooth' });
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
