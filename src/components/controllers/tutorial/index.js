import { h, Component } from 'preact';
import linkState from 'linkstate';
import style from './style.module.less';
import { ErrorOverlay } from '../repl/error-overlay';
import { parseStackTrace } from '../repl/errors';

// Steps
import VDomTutorial from './vdom';
import EventsTutorial from './events';
import ComponentsTutorial from './components';

export default class Tutorial extends Component {
	state = {
		loading: 'Loading Tutorial...',
		step: 1
	};

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
				this.setState({
					loading: false,
					code: VDomTutorial.initialCode
				});
			});
		});
	}

	onSuccess = () => {
		this.setState({ error: null });
	};

	nextStep = () => {
		switch (this.state.step) {
			case 1: {
				this.setState({
					step: 2,
					code: EventsTutorial.initialCode
				});
				break;
			}
			case 2: {
				this.setState({
					step: 3,
					code: ComponentsTutorial.initialCode
				});
				break;
			}
		}
	};

	help = () => {
		switch (this.state.step) {
			case 1: {
				this.setState({
					step: 1,
					code: VDomTutorial.finalCode
				});
				break;
			}
			case 2: {
				this.setState({
					step: 2,
					code: EventsTutorial.finalCode
				});
				break;
			}
		}
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

		let step;

		switch (this.state.step) {
			case 1:
				step = <VDomTutorial />;
				break;
			case 2:
				step = <EventsTutorial />;
				break;
			case 3:
				step = <ComponentsTutorial />;
				break;
		}

		return (
			<ReplWrapper loading={!!loading}>
				<div class={style.tutorialWrapper}>
					<div class={style.tutorialWindow}>
						{step}

						<div class={style.buttonContainer}>
							<button class={style.helpButton} onClick={this.help}>
								Help
							</button>
							<button class={style.nextButton} onClick={this.nextStep}>
								Next
							</button>
						</div>
					</div>

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
