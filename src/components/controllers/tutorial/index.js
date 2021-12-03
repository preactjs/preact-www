import { h, Component } from 'preact';
import linkState from 'linkstate';
import style from './style.module.less';
import { ErrorOverlay } from '../repl/error-overlay';
import { parseStackTrace } from '../repl/errors';

export default class Tutorial extends Component {
	state = {
		loading: 'Loading Tutorial...'
	};

	componentWillMount() {
		if (this.props.code) {
			this.receiveCode(this.props.code);
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

	onSuccess = () => {
		this.setState({ error: null });
	};

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
				<div class={style.tutorialWrapper}>
					<div class={style.tutorialWindow}>hi</div>

					<div class={style.codeWindow}>
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
					</div>
				</div>
			</ReplWrapper>
		);
	}
}

const ReplWrapper = ({ loading, children }) => (
	<div class={style.tutorial}>
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
