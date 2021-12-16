import { h, Component } from 'preact';
import linkState from 'linkstate';
import style from './style.module.less';
import { ErrorOverlay } from '../repl/error-overlay';
import { parseStackTrace } from '../repl/errors';

// Steps
import VDomTutorial from './vdom';
import EventsTutorial from './events';
import ComponentsTutorial from './components';
import StateTutorial from './state';
import RefsTutorial from './refs';
import ContextTutorial from './context';
import SideEffectsTutorial from './side-effects';
import ErrorsTutorial from './errors';
import Links from './links';

export default class Tutorial extends Component {
	state = {
		loading: 'Loading Tutorial...',
		step: 9
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

	previousStep = () => {
		switch (this.state.step) {
			case 2: {
				this.setState({
					step: 1,
					code: VDomTutorial.initialCode
				});
				break;
			}
			case 3: {
				this.setState({
					step: 2,
					code: EventsTutorial.initialCode
				});
				break;
			}
			case 4: {
				this.setState({
					step: 3,
					code: ComponentsTutorial.initialCode
				});
				break;
			}
			case 5: {
				this.setState({
					step: 4,
					code: StateTutorial.initialCode
				});
				break;
			}
			case 6: {
				this.setState({
					step: 5,
					code: RefsTutorial.initialCode
				});
				break;
			}
			case 7: {
				this.setState({
					step: 6,
					code: ContextTutorial.initialCode
				});
				break;
			}
			case 8: {
				this.setState({
					step: 7,
					code: ErrorsTutorial.initialCode
				});
				break;
			}
			case 9: {
				this.setState({
					step: 8,
					code: SideEffectsTutorial.initialCode
				});
				break;
			}
		}
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
			case 3: {
				this.setState({
					step: 4,
					code: StateTutorial.initialCode
				});
				break;
			}
			case 4: {
				this.setState({
					step: 5,
					code: RefsTutorial.initialCode
				});
				break;
			}
			case 5: {
				this.setState({
					step: 6,
					code: ContextTutorial.initialCode
				});
				break;
			}
			case 6: {
				this.setState({
					step: 7,
					code: ErrorsTutorial.initialCode
				});
				break;
			}
			case 7: {
				this.setState({
					step: 8,
					code: SideEffectsTutorial.initialCode
				});
				break;
			}
			case 8: {
				this.setState({
					step: 9,
					code: Links.initialCode
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
			case 3: {
				this.setState({
					step: 3,
					code: ComponentsTutorial.finalCode
				});
				break;
			}
			case 4: {
				this.setState({
					step: 4,
					code: StateTutorial.finalCode
				});
				break;
			}
			case 5: {
				this.setState({
					step: 5,
					code: RefsTutorial.finalCode
				});
				break;
			}
			case 6: {
				this.setState({
					step: 6,
					code: ContextTutorial.finalCode
				});
				break;
			}
			case 7: {
				this.setState({
					step: 7,
					code: ErrorsTutorial.finalCode
				});
				break;
			}
			case 8: {
				this.setState({
					step: 8,
					code: SideEffectsTutorial.finalCode
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
			case 4:
				step = <StateTutorial />;
				break;
			case 5:
				step = <RefsTutorial />;
				break;
			case 6:
				step = <ContextTutorial />;
				break;
			case 7:
				step = <ErrorsTutorial />;
				break;
			case 8:
				step = <SideEffectsTutorial />;
				break;
			case 9:
				step = <Links />;
				break;
		}

		return (
			<ReplWrapper loading={!!loading}>
				<div class={style.tutorialWrapper}>
					<div class={style.tutorialWindow}>
						{step}

						<div class={style.buttonContainer}>
							{this.state.step > 1 ? (
								<button class={style.nextButton} onClick={this.previousStep}>
									previous
								</button>
							) : null}
							<button class={style.helpButton} onClick={this.help}>
								Help
							</button>
							{this.state.step < 9 ? (
								<button class={style.nextButton} onClick={this.nextStep}>
									Next
								</button>
							) : null}
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
									key={this.state.step}
									name={error.name}
									message={error.message}
									stack={parseStackTrace(error)}
								/>
							)}
							<this.Runner
								key={this.state.step}
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
