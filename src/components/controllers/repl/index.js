import { h, Component } from 'preact';
import linkState from 'linkstate';
import { debounce } from 'decko';
import { ErrorOverlay } from './error-overlay';
import { localStorageGet, localStorageSet } from '../../../lib/localstorage';
import { parseStackTrace } from './errors';
import style from './style.module.less';
import REPL_CSS from '!!raw-loader!./examples.css';

import simpleCounterExample from '!!file-loader!./examples/simple-counter.txt';
import counterWithHtmExample from '!!file-loader!./examples/counter-with-htm.txt';
import todoExample from '!!file-loader!./examples/todo-list.txt';
import todoExampleSignal from '!!file-loader!./examples/todo-list-signal.txt';
import repoListExample from '!!file-loader!./examples/github-repo-list.txt';
import contextExample from '!!file-loader!./examples/context.txt';
import spiralExample from '!!file-loader!./examples/spiral.txt';
import { Splitter } from '../../splitter';

const EXAMPLES = [
	{
		name: 'Simple Counter',
		slug: 'counter',
		url: simpleCounterExample
	},
	{
		name: 'Todo List',
		slug: 'todo',
		url: todoExample
	},
	{
		name: 'Todo List (Signals)',
		slug: 'todo-list-signals',
		url: todoExampleSignal
	},
	{
		name: 'Github Repo List',
		slug: 'github-repo-list',
		url: repoListExample
	},
	{
		group: 'Advanced',
		items: [
			{
				name: 'Counter using HTM',
				slug: 'counter-htm',
				url: counterWithHtmExample
			},
			{
				name: 'Context',
				slug: 'context',
				url: contextExample
			}
		]
	},
	{
		group: 'Animation',
		items: [
			{
				name: 'Spiral',
				slug: 'spiral',
				url: spiralExample
			}
		]
	}
];

function getExample(slug, list) {
	for (let i = 0; i < list.length; i++) {
		let item = list[i];
		if (item.group) {
			let found = getExample(slug, item.items);
			if (found) return found;
		} else if (item.slug.toLowerCase() === slug.toLowerCase()) {
			return item;
		}
	}
}

export default class Repl extends Component {
	state = {
		loading: 'Loading REPL...',
		code: '',
		exampleSlug: ''
	};

	constructor(props) {
		super(props);

		// Only load from local storage if no url param is set
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			const exampleParam = params.get('example');
			let example = exampleParam ? getExample(exampleParam, EXAMPLES) : null;

			if (example) {
				this.state.exampleSlug = example.slug;
			} else if (!example) {
				// Remove ?example param
				history.replaceState(null, null, '/repl');

				// No example param was present, try to load from localStorage
				const code = localStorageGet('preact-www-repl-code');
				if (code) {
					this.state.code = code;
				} else {
					// Nothing found in localStorage either, pick first example
					this.state.exampleSlug = EXAMPLES[0].slug;
				}
			}
		}
	}

	componentDidMount() {
		Promise.all([
			import(/* webpackChunkName: "editor" */ '../../code-editor'),
			import(/* webpackChunkName: "runner" */ './runner')
		]).then(([CodeEditor, Runner]) => {
			this.CodeEditor = CodeEditor.default;
			this.Runner = Runner.default;

			// Load transpiler
			this.setState({ loading: 'Initializing REPL...' });
			this.Runner.worker.ping().then(() => {
				this.setState({ loading: false });
				let example = this.state.exampleSlug;
				if (this.props.code) {
					this.receiveCode(this.props.code);
				} else if (example) {
					this.applyExample(example);
				} else if (!this.state.code) {
					this.applyExample(EXAMPLES[0].slug);
				}
			});
		});
	}

	share = () => {
		let { code } = this.state;
		const url = `/repl?code=${encodeURIComponent(btoa(code))}`;
		history.replaceState(null, null, url);

		try {
			let input = document.createElement('input');
			input.style.cssText = 'position:absolute; left:0; top:-999px;';
			input.value = location.href;
			document.body.appendChild(input);
			input.select();
			document.execCommand('copy');
			input.blur();
			document.body.removeChild(input);
			this.setState({ copied: true });
			setTimeout(() => this.setState({ copied: false }), 1000);
		} catch (err) {
			// eslint-disable-next-line no-console
			console.log(err);
		}
	};

	loadExample = e => {
		this.applyExample(e.target.value);
	};

	async applyExample(name) {
		let example = getExample(name, EXAMPLES);
		if (!example) return;
		if (!example.code) {
			if (example.url) {
				example.code = await (await fetch(example.url)).text();
			} else if (example.load) {
				example.code = await example.load();
			}
		}

		history.replaceState(
			null,
			null,
			`/repl?example=${encodeURIComponent(example.slug)}`
		);
		this.setState({ code: example.code, exampleSlug: example.slug });
	}

	onRealm = realm => {
		realm.globalThis.githubStars = window.githubStars;
	};

	onSuccess = () => {
		this.setState({ error: null });
	};

	componentDidUpdate = debounce(500, () => {
		let { code } = this.state;
		if (code === repoListExample) code = '';
		// Reset select when code is changed from example
		if (this.state.exampleSlug) {
			const example = getExample(this.state.exampleSlug, EXAMPLES);
			if (code !== example.code && this.state.exampleSlug !== '') {
				// eslint-disable-next-line react/no-did-update-set-state
				this.setState({ exampleSlug: '' });
				history.replaceState(null, null, '/repl');
			}
		}
		localStorageSet('preact-www-repl-code', code || '');
	});

	componentWillReceiveProps({ code }) {
		if (code && code !== this.props.code) {
			this.receiveCode(code);
		}
	}

	receiveCode(code) {
		try {
			code = atob(code);
		} catch (e) {}
		if (code && code !== this.state.code) {
			if (
				!document.referrer ||
				document.referrer.indexOf(location.origin) === 0
			) {
				this.setState({ code });
			} else {
				setTimeout(() => {
					if (
						// eslint-disable-next-line no-alert
						confirm(
							'Are you sure you want to run the code contained in this link?'
						)
					) {
						this.setState({ code });
					}
				}, 20);
			}
		}
	}

	render(_, { loading, code, error, exampleSlug, copied }) {
		if (loading) {
			return (
				<ReplWrapper loading>
					<div class={style.loading}>
						<h4>{loading}</h4>
					</div>
				</ReplWrapper>
			);
		}

		return (
			<ReplWrapper loading={!!loading}>
				<header class={style.toolbar}>
					<label>
						<select value={exampleSlug} onChange={this.loadExample}>
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
					<button class={style.share} onClick={this.share}>
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
								<this.Runner
									onRealm={this.onRealm}
									onError={linkState(this, 'error', 'error')}
									onSuccess={this.onSuccess}
									css={REPL_CSS}
									code={code}
								/>
							</div>
						}
					>
						<this.CodeEditor
							class={style.code}
							value={code}
							error={error}
							onInput={linkState(this, 'code', 'value')}
						/>
					</Splitter>
				</div>
			</ReplWrapper>
		);
	}
}

const ReplWrapper = ({ loading, children }) => (
	<div class={style.repl}>
		<progress-bar showing={!!loading} />
		<style>{`
			main {
				height: 100% !important;
				overflow: hidden !important;
			}
			footer {
				display: none !important;
			}
		`}</style>
		{children}
	</div>
);
