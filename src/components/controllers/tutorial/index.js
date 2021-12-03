import { h, Component } from 'preact';
import linkState from 'linkstate';
import style from './style.module.less';
import { ErrorOverlay } from '../repl/error-overlay';
import { parseStackTrace } from '../repl/errors';

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
					code: `import { createElement } from 'preact';

export default function App() {
	return (
		<div style={{ padding: 8 }}>
			<p>Hello world</p>
		</div>
	)
}
`
				});
			});
		});
	}

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
					<div class={style.tutorialWindow}>
						<h2>1. Virtual DOM</h2>
						<p>
							You might've heard a lot of people talk about Virtual DOM
							libraries, which might be confusing as how does it differ from our
							real DOM? Well in a Virtual DOM library we'll keep a virtual
							representation of your DOM-tree in-memory so we can "diff" them.
							This means that when an update comes in we can see what the
							differences between the previous and current Virtual DOM tree are
							and then apply them to the actual DOM.
						</p>
						<p>
							In this chapter we'll learn how we actually create one of those
							Virtual DOM trees and make it translate to DOM for us. There are a
							few ways of creating one of these trees:
						</p>
						<ul>
							<li>
								Leverage the <code>createElement</code> function exported from
								preact
							</li>
							<li>
								Write JSX, which is an HTML-like syntax that get transpiled by
								Babel/ESBuild/... to <code>createElement</code>
							</li>
							<li>
								Use the{' '}
								<a href="https://github.com/developit/htm">htm library</a>
							</li>
						</ul>

						<p>An example:</p>

						<code>
							import &#123; createElement &#125; from 'preact'; export default
							function App() &#123; return createElement('p', &#123; class:
							'my-paragraph' &#125;, 'hello world') &#125;
						</code>

						<p>
							So what does the above code snipper do? Well we tell Preact to
							render a paragraph element with the text hello-world. As the
							first-prop is the type of element we want, the second are the
							attributes we want to assign to it, in this case we are assigning
							it a class named "my-paragraph" and the last attribute is the
							child for this paragraph which is the text "hello world" in this
							case. If we'd translate this to JSX we'd see:
						</p>

						<code>
							import &#123; createElement &#125; from 'preact'; export default
							function App() &#123; return &lt;p class="my-paragraph"&gt;Hello
							world&lt;/p&gt; &#125;
						</code>

						<p>
							On the right-hand side you'll see the code at the top and the
							rendered result at the bottom, you'll see our hello-world
							rendered. Now we want to give this some more... Power, let's wrap
							our paragraph with a div and use the "style" attribute to give it
							a padding of 8, we can use the style attribute like this:
							style=&#123;&#123; property: value, &#125;&#125;. You can give it
							some color as well if you like, play around with it, have fun!
							Next up, let's add a "button" element as well and change text of
							"hello world" to "count:"
						</p>

						<button>Help!</button>
						<button>Next</button>
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
