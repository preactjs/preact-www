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
import repoListExample from '!!file-loader!./examples/github-repo-list.txt';
import contextExample from '!!file-loader!./examples/context.txt';
import spiralExample from '!!file-loader!./examples/spiral.txt';

const EXAMPLES = [
	{
		name: 'Simple Counter',
		url: simpleCounterExample
	},
	{
		name: 'Todo List',
		url: todoExample
	},
	{
		name: 'Github Repo List',
		url: repoListExample
	},
	{
		group: 'Advanced',
		items: [
			{
				name: 'Counter using HTM',
				url: counterWithHtmExample
			},
			{
				name: 'Context',
				url: contextExample
			}
		]
	},
	{
		group: 'Animation',
		items: [
			{
				name: 'Spiral',
				url: spiralExample
			}
		]
	}
];

function getExample(name, list = EXAMPLES) {
	for (let i = 0; i < list.length; i++) {
		let item = list[i];
		if (item.group) {
			let found = getExample(name, item.items);
			if (found) return found;
		} else if (item.name.toLowerCase() === name.toLowerCase()) {
			return item;
		}
	}
}

export default class Repl extends Component {
	state = {
		loading: 'Loading REPL...',
		code: localStorageGet('preact-www-repl-code')
	};

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
				let example = this.props.example && getExample(this.props.example);
				if (this.props.code) {
					this.receiveCode(this.props.code);
				} else if (example) {
					this.applyExample(example.name);
				} else if (!this.state.code) {
					this.applyExample(EXAMPLES[0].name);
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
		e.target.value = '';
	};

	async applyExample(name) {
		let example = getExample(name);
		if (!example) return;
		if (!example.code) {
			if (example.url) {
				example.code = await (await fetch(example.url)).text();
			} else if (example.load) {
				example.code = await example.load();
			}
		}
		this.setState({ code: example.code });
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

	render(_, { loading, code, error, example, copied }) {
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
						<select value="" onChange={this.loadExample}>
							<option value="" disabled>
								Select Example...
							</option>
							{EXAMPLES.map(function item(ex) {
								return ex.group ? (
									<optgroup label={ex.group}>{ex.items.map(item)}</optgroup>
								) : (
									<option value={ex.name}>{ex.name}</option>
								);
							})}
						</select>
					</label>
					<button class={style.share} onClick={this.share}>
						{copied ? '🔗 Copied' : 'Share'}
					</button>
				</header>

				<this.CodeEditor
					class={style.code}
					value={code}
					error={error}
					onInput={linkState(this, 'code', 'value')}
				/>
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
