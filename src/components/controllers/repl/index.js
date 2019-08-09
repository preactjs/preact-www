import { h, Component } from 'preact';
import linkState from 'linkstate';
import { debounce } from 'decko';
import codeExample from './code-example.txt';
import todoExample from './todo-example.txt';
import style from './style';
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

export default class Repl extends Component {
	state = {
		loading: 'Loading REPL...',
		code: localStorageGet('preact-www-repl-code') || codeExample
	};

	constructor(props, context) {
		super(props, context);
		if (props.code) this.receiveCode(props.code);
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
			});
		});
	}

	share = () => {
		let { code } = this.state;
		history.replaceState(null, null, `/repl?code=${encodeURIComponent(code)}`);

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

	loadExample = () => {
		let example = EXAMPLES[this.state.example];
		if (example && example.code !== this.state.code) {
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
		if (code && code !== this.state.code) {
			if (
				!document.referrer ||
				document.referrer.indexOf(location.origin) === 0
			) {
				this.setState({ code });
			} else {
				setTimeout(() => {
					// eslint-disable-next-line no-alert
					if (confirm('Run code from link?')) {
						this.setState({ code });
					}
				}, 20);
			}
		}
	}

	render(_, { loading, code, error, example, copied }) {
		if (loading)
			return (
				<ReplWrapper loading>
					<div class={style.loading}>
						<h4>{loading}</h4>
					</div>
				</ReplWrapper>
			);

		return (
			<ReplWrapper loading={!!loading}>
				<header class={style.toolbar}>
					<label>
						<select value={example} onChange={linkState(this, 'example')}>
							<option value="">Select Example...</option>
							{EXAMPLES.map(({ name }, index) => (
								<option value={index}>{name}</option>
							))}
						</select>
						<button
							class={style.reset}
							onClick={this.loadExample}
							disabled={!example}
						>
							Load
						</button>
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
