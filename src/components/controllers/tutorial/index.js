import { h, Component, createRef, createContext, options } from 'preact';
import {
	useState,
	useReducer,
	useEffect,
	useContext,
	useRef,
	useMemo,
	useCallback
} from 'preact/hooks';
import linkState from 'linkstate';
import cx from '../../../lib/cx';
import style from './style.module.less';
import { ErrorOverlay } from '../repl/error-overlay';
import { parseStackTrace } from '../repl/errors';
import ContentRegion from '../../content-region';
import widgets from '../../widgets';
import { usePage } from '../page';
import { useStore, storeCtx } from '../../store-adapter';
import { InjectPrerenderData } from '../../../lib/prerender-data';
import { getContent } from '../../../lib/content';

const IS_PRERENDERING = typeof window === 'undefined';

const TutorialContext = createContext(null);

const TUTORIAL_COMPONENTS = {
	pre: TutorialCodeBlock,
	Solution
};

export default class Tutorial extends Component {
	state = {
		loading: true,
		code: '',
		error: null,
		'repl-initial': '',
		'repl-final': ''
	};

	content = createRef();
	runner = createRef();

	static contextType = storeCtx;

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

	componentWillReceiveProps({ step }) {
		if (step !== this.props.step) {
			this.setState({
				code: '',
				error: null,
				'repl-initial': '',
				'repl-final': ''
			});
			this.context.setState({ solved: false });
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

	render({ route, step }, { loading, code, error }) {
		const state = {
			route,
			step,
			loading,
			code,
			error,
			Runner: this.Runner,
			CodeEditor: this.CodeEditor
		};
		return (
			<TutorialContext.Provider value={this}>
				<TutorialView {...state} />
			</TutorialContext.Provider>
		);
	}
}

function TutorialView({
	step,
	route,
	loading,
	code,
	error,
	Runner,
	CodeEditor
}) {
	const content = useRef();

	const tutorial = useContext(TutorialContext);

	const [showCodeOverride, toggleCode] = useReducer(s => !s, true);

	const { lang, solved } = useStore(['lang', 'solved']).state;
	const fullPath = route.path.replace(':step?', step || route.first);
	const page = usePage({ path: fullPath }, lang);
	const title = (page && page.meta.title) || route.title;
	const solvable = page && page.meta.solvable === true;
	const hasCode = page && page.meta.code !== false && step && step !== 'index';
	const showCode = showCodeOverride && hasCode;
	loading =
		!page.html || (showCode && (!!page.loading || !Runner || !CodeEditor));
	const initialLoad = !page.html || !Runner || !CodeEditor;

	// Scroll to the top after loading
	useEffect(() => {
		if (!loading && !initialLoad) {
			content.current.scrollTo(0, 0);
		}
	}, [fullPath, loading, initialLoad]);

	// Preload the next chapter
	useEffect(() => {
		if (page.meta && page.meta.next) {
			getContent([lang, page.meta.next]);
		}
	}, [page.meta && page.meta.next, fullPath]);

	const reRun = useCallback(() => {
		let code = tutorial.state.code;
		tutorial.setState({ code: code + ' ' }, () => {
			tutorial.setState({ code });
		});
	}, []);

	const splitterPointerDown = useCallback(e => {
		let target = e.target;
		let root = target.parentNode;
		let x, perc, w, pid;
		function move(e) {
			if (x == null) {
				pid = e.pointerId;
				target.setPointerCapture(pid);
				x = e.pageX;
				perc = parseFloat(root.style.getPropertyValue('--x') || '50%');
				w = root.offsetWidth;
			} else {
				let p = Math.max(20, Math.min(80, perc + ((e.pageX - x) / w) * 100));
				root.style.setProperty('--x', `${p.toFixed(2)}%`);
			}
		}
		function up(e) {
			move(e);
			cancel(e);
		}
		function cancel(e) {
			target.releasePointerCapture(pid);
			removeEventListener('pointermove', move);
			removeEventListener('pointerup', up);
			removeEventListener('pointercancel', cancel);
		}
		addEventListener('pointermove', move);
		addEventListener('pointerup', up);
		addEventListener('pointercancel', cancel);
	}, []);

	return (
		<ReplWrapper
			loading={loading}
			subtleLoading={page.loading}
			initialLoad={initialLoad}
			solvable={solvable}
			solved={solved}
			showCode={showCode}
		>
			<div class={style.tutorialWindow} ref={content}>
				<h1 class={style.title}>{title}</h1>

				<ContentRegion
					name={page.current}
					content={page.html}
					components={TUTORIAL_COMPONENTS}
					lang={lang}
				/>

				<div class={style.buttonContainer}>
					{page.meta.prev && (
						<a class={style.prevButton} href={page.meta.prev}>
							Previous
						</a>
					)}
					{tutorial.state['repl-final'] && (
						<button
							class={style.helpButton}
							onClick={tutorial.help}
							disabled={!showCode}
							title="Get help with this example"
						>
							Help
						</button>
					)}
					{page.meta.next && (
						<a class={style.nextButton} href={page.meta.next}>
							{page.meta.nextText || 'Next'}
						</a>
					)}
				</div>
			</div>

			<div class={style.splitter} onPointerDown={splitterPointerDown} />

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
				<div class={style.output} key="output">
					{!initialLoad && (
						<Runner
							key={fullPath}
							ref={tutorial.runner}
							onSuccess={tutorial.onSuccess}
							onRealm={tutorial.onRealm}
							onError={tutorial.onError}
							code={code}
							clear
						/>
					)}
					{error && [
						<ErrorOverlay
							key={'e:' + fullPath}
							class={style.error}
							name={error.name}
							message={error.message}
							stack={parseStackTrace(error)}
						/>,
						<button class={style.rerun} onClick={reRun}>
							Re-run
						</button>
					]}
				</div>
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

			<InjectPrerenderData
				name={fullPath}
				data={{
					html: page.html,
					meta: { ...page.meta }
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
	subtleLoading,
	solvable,
	solved,
	initialLoad,
	showCode,
	children
}) {
	return (
		<div class={style.tutorial}>
			<progress-bar showing={!!(loading || subtleLoading)} />
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
					!IS_PRERENDERING && loading && style.loading
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
		tutorial.setState({ [repl[0]]: code });
		if (repl[0] === 'repl-initial') tutorial.setState({ code });
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
		if (IS_PRERENDERING) return null;

		const tutorial = useContext(TutorialContext);
		const store = useContext(storeCtx);
		const require = m => tutorial.runner.current.realm.globalThis._require(m);

		const fn = new Function(
			'options',
			'state',
			'setState',
			'useState',
			'useEffect',
			'useRef',
			'useMemo',
			'useStore',
			'useResult',
			'useRealm',
			'useError',
			'store',
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
			useStore,
			tutorial.useResult,
			tutorial.useRealm,
			tutorial.useError,
			store,
			tutorial.runner.current && tutorial.runner.current.realm,
			require
		);

		return null;
	}, [code]);

	return <Setup />;
}

/** Shows a solution banner when the chapter is solved */
function Solution({ children }) {
	const { solved } = useStore(['solved']).state;
	const ref = useRef();

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
