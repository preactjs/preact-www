import { h, Component } from 'preact';
import linkState from 'linkstate';
import { debounce } from 'decko';
import codeExample from './code-example.txt';
import todoExample from './todo-example.txt';
import style from './style.module.less';
import './examples.less';
import { ErrorOverlay } from './error-overlay';
import { localStorageGet, localStorageSet } from '../../../lib/localstorage';
import { parseStackTrace } from './errors';

const EXAMPLES = [
	{
		name: 'Github Repo List',
		code: codeExample
	},
	{
		name: 'Todo List',
		code: todoExample
	}
];

const REPL_CSS = `
.list-item {
	padding: 1rem;
	margin: 1rem;
	background: #ffc107;
}
.list-item a {
	color: black;
	font-weight: bold;
	text-decoration: underline;
}
`;

export default class Repl extends Component {
	state = {
		loading: 'Loading REPL...',
		code: localStorageGet('preact-www-repl-code') || codeExample
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
				if (this.props.code) {
					this.receiveCode(this.props.code);
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
		let example = EXAMPLES[e.target.value];
		e.target.value = '';
		if (example) {
			this.setState({ code: example.code });
		}
	};

	onSuccess = () => {
		this.setState({ error: null });
	};

	componentDidUpdate = debounce(500, () => {
		let { code } = this.state;
		if (code === codeExample) code = '';
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
							{EXAMPLES.map((example, index) => (
								<option value={index}>{example.name}</option>
							))}
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
