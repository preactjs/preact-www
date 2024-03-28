import { Component, createRef, options } from 'preact';
import {
	useState,
	useReducer,
	useEffect,
	useContext,
	useRef,
	useMemo,
	useCallback
} from 'preact/hooks';
import { useLocation } from 'preact-iso';
import linkState from 'linkstate';
import { TutorialContext, SolutionContext } from './contexts';
import cx from '../../../lib/cx';
import style from './style.module.css';
import { ErrorOverlay } from '../repl/error-overlay';
import { parseStackTrace } from '../repl/errors';
import widgets from '../../widgets';
import { InjectPrerenderData } from '../../../lib/prerender-data';
import { useLanguage } from '../../../lib/i18n';
import { Splitter } from '../../splitter';
import config from '../../../config.json';
import { MarkdownRegion } from '../markdown-region';

const TUTORIAL_COMPONENTS = {
	pre: TutorialCodeBlock,
	Solution
};

export class Tutorial extends Component {
	state = {
		loading: true,
		code: '',
		error: null,
		'repl-initial': '',
		'repl-final': ''
	};

	content = createRef();
	runner = createRef();

	static contextType = SolutionContext;

	resultHandlers = new Set();
	realmHandlers = new Set();
	errorHandlers = new Set();
	useResult = fn => {
		useEffect(() => {
			this.resultHandlers.add(fn);
			return () => this.resultHandlers.delete(fn);
		}, [fn]);
	};
	useRealm = fn => {
		useEffect(() => {
			this.realmHandlers.add(fn);
			let runner = this.runner.current;
			if (runner && runner.realm && runner.realm.globalThis._require) {
				this.onRealm(runner.realm);
			}
			return () => this.realmHandlers.delete(fn);
		}, [fn]);
	};
	useError = fn => {
		useEffect(() => {
			this.errorHandlers.add(fn);
			return () => this.errorHandlers.delete(fn);
		}, [fn]);
	};

	componentWillReceiveProps({ html }) {
		if (html !== this.props.html) {
			this.setState({
				code: '',
				error: null,
				'repl-initial': '',
				'repl-final': ''
			});
			this.context.setSolved(false);
		}
	}

	componentDidMount() {
		Promise.all([
			import(/* webpackChunkName: "editor" */ '../../code-editor'),
			import(/* webpackChunkName: "runner" */ '../repl/runner')
		]).then(([CodeEditor, Runner]) => {
			this.CodeEditor = CodeEditor.default;
			this.Runner = Runner.default;

			// Load transpiler
			this.Runner.worker.ping().then(() => {
				this.setState({
					loading: false
				});
			});
		});
	}

	onError = ({ error }) => {
		this.errorHandlers.forEach(f => f(error));
		if (this.state.error !== error) {
			this.setState({ error });
		}
	};

	onSuccess = () => {
		if (this.resultCleanups) this.resultCleanups.forEach(f => f());
		this.resultCleanups = [];
		this.resultHandlers.forEach(f => {
			let cleanup = f(this.runner.current);
			if (cleanup) this.resultCleanups.push(cleanup);
		});
		if (this.state.error != null) {
			this.setState({ error: null });
		}
	};

	onRealm = realm => {
		if (this.realmCleanups) this.realmCleanups.forEach(f => f());
		this.realmCleanups = [];
		// this.realmCleanups = Array.from(this.realmHandlers).map(f => f()).filter(Boolean);
		this.realmHandlers.forEach(f => {
			let cleanup = f(realm);
			if (cleanup) this.realmCleanups.push(cleanup);
		});
	};

	help = () => {
		const solution = this.state['repl-final'];
		this.setState({ code: solution });
	};

	clearError = () => {
		this.setState({ error: null });
	};

	render({ html, meta }, { loading, code, error }) {
		const state = {
			html,
			meta,
			loading,
			code,
			error,
			Runner: this.Runner,
			CodeEditor: this.CodeEditor
		};
		return (
			<TutorialContext.Provider value={this}>
				<TutorialView {...state} clearError={this.clearError} />
			</TutorialContext.Provider>
		);
	}
}

function TutorialView({
	html,
	meta,
	loading,
	code,
	error,
	Runner,
	CodeEditor,
	clearError
}) {
	const content = useRef(null);

	const tutorial = useContext(TutorialContext);

	const [showCodeOverride, toggleCode] = useReducer(s => !s, true);

	const { url } = useLocation();
	const [lang] = useLanguage();
	const { solved } = useContext(SolutionContext);

	const solvable = meta.solvable === true;
	const hasCode = meta.code !== false;
	const showCode = showCodeOverride && hasCode;
	loading = !html || (showCode && (!Runner || !CodeEditor));
	const initialLoad = !html || !Runner || !CodeEditor;

	// Scroll to the top after loading
	useEffect(() => {
		if (!loading && !initialLoad) {
			content.current.scrollTo(0, 0);
		}
	}, [url, loading, initialLoad]);

	const reRun = useCallback(() => {
		let code = tutorial.state.code;
		tutorial.setState({ code: code + ' ' }, () => {
			tutorial.setState({ code });
		});
	}, []);

	return (
		<ReplWrapper
			loading={loading}
			initialLoad={initialLoad}
			solvable={solvable}
			solved={solved}
			showCode={showCode}
		>
			<Splitter
				orientation="horizontal"
				force={!showCode ? '100%' : undefined}
				other={
					<Splitter
						orientation="vertical"
						other={
							<>
								<div class={style.output} key="output">
									{!initialLoad && (
										<Runner
											key={url}
											ref={tutorial.runner}
											onSuccess={tutorial.onSuccess}
											onRealm={tutorial.onRealm}
											onError={tutorial.onError}
											code={code}
											clear
										/>
									)}
									{error && (
										<div class={style.errorOverlayWrapper}>
											<button class={style.close} onClick={clearError}>
												close
											</button>
											<ErrorOverlay
												key={'e:' + url}
												class={style.error}
												name={error.name}
												message={error.message}
												stack={parseStackTrace(error)}
											/>
											<button class={style.rerun} onClick={reRun}>
												Re-run
											</button>
										</div>
									)}
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
							{!initialLoad && (
								<CodeEditor
									key="editor"
									class={style.code}
									value={code}
									error={error}
									onInput={linkState(tutorial, 'code', 'value')}
								/>
							)}
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

					<div class={style.buttonContainer}>
						{meta.prev && (
							<a class={style.prevButton} href={meta.prev}>
								{config.i18n.previous[lang] || config.i18n.previous.en}
							</a>
						)}
						{tutorial.state['repl-final'] && (
							<button
								class={style.helpButton}
								onClick={tutorial.help}
								disabled={!showCode}
								title="Get help with this example"
							>
								{config.i18n.tutorial.help[lang] ||
									config.i18n.tutorial.help.en}
							</button>
						)}
						{meta.next && (
							<a class={style.nextButton} href={meta.next}>
								{meta.nextText || config.i18n.next[lang] || config.i18n.next.en}
							</a>
						)}
					</div>
				</div>
			</Splitter>

			<InjectPrerenderData
				name={url}
				data={{
					html,
					meta
				}}
			/>
		</ReplWrapper>
	);
}

const REPL_CSS = `
	main {
		height: 100% !important;
		overflow: hidden !important;
	}
	footer {
		display: none !important;
	}
`;

function ReplWrapper({
	loading,
	solvable,
	solved,
	initialLoad,
	showCode,
	children
}) {
	return (
		<div class={style.tutorial}>
			<progress-bar showing={!!loading} />
			<style>{REPL_CSS}</style>
			<div
				class={cx(
					style.tutorialWrapper,
					solvable && style.solvable,
					solved && style.solved,
					initialLoad && style.loading,
					showCode && style.showCode
				)}
			>
				{children}
			</div>
			<div
				class={cx(
					style.loadingOverlay,
					typeof window !== 'undefined' && loading && style.loading
				)}
			>
				<h4>Loading...</h4>
			</div>
		</div>
	);
}

/** Handles all code blocks (and <pre>'s) in tutorial markup */
function TutorialCodeBlock(props) {
	const tutorial = useContext(TutorialContext);
	const child = [].concat(props.children)[0];

	// not a code block
	if (!child || child.type !== 'code') {
		return <pre {...props} />;
	}

	const text = [].concat(child.props.children).join('');
	const code = text.replace(/(^\s+|\s+$)/g, '');
	const cl = child.props.class || '';

	// Block Type: ```js:setup
	if (/setup/.test(cl)) {
		return <TutorialSetupBlock code={code} />;
	}

	// Block Type: ```jsx:repl-initial  /  ```jsx:repl-final
	const repl = cl.match(/repl-(initial|final)/g);
	if (repl) {
		tutorial.setState({ [repl[0]]: code + '\n' });
		if (repl[0] === 'repl-initial') tutorial.setState({ code: code + '\n' });
		return null;
	}

	props.repl = props.repl === true || props.repl === 'true';
	return <widgets.CodeBlock {...props} />;
}

/** Handles running ```js:setup code blocks */
function TutorialSetupBlock({ code }) {
	// Only run when we get new setup code.
	// Note: we run setup code as a component to allow hook usage:
	const Setup = useCallback(() => {
		if (typeof window === 'undefined') return null;

		const tutorial = useContext(TutorialContext);
		const solutionCtx = useContext(SolutionContext);
		const require = m => tutorial.runner.current.realm.globalThis._require(m);

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
			tutorial.useResult,
			tutorial.useRealm,
			tutorial.useError,
			solutionCtx,
			tutorial.runner.current && tutorial.runner.current.realm,
			require
		);

		return null;
	}, [code]);

	return <Setup />;
}

/** Shows a solution banner when the chapter is solved */
function Solution({ children }) {
	const { solved } = useContext(SolutionContext);
	const ref = useRef(null);

	useEffect(() => {
		if (solved) {
			requestAnimationFrame(() => {
				ref.current.scrollIntoView({ behavior: 'smooth' });
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
