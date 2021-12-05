import { Fragment } from 'preact';
import CodeBlock from '../../code-block';
import style from './style.module.less';

const ErrorsTutorial = () => (
	<Fragment>
		<h2>7. Errors</h2>
		<p>
			As we are dealing with JavaScript here we could be causing errors with "undefined" variables, ...
			So we need a way to gracefully handle errors that could occur within our UI code.
			<br />
			In Preact we can leverage class-components to catch these, our class-components have two keywords to
			define them as an error-boundary: "componentDidCatch" and "getDerivedStateFromError". Let's look
			at how we can leverage these
		</p>
		<CodeBlock repl="false" class={style.codeContainer}>
			<code class="language-jsx">
				{`import { Component, createElement } from 'preact';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasErrored: false }
	}

	// getDerivedStateFromError is a static method on the class and will return the
	// next state, it's up to you to decide which one you like better.
	static getDerivedStateFromError(error) {
		return { hasErrored: true, error: error.message };
	}

	// CompoonentDidCatch allows you to react to an error and decide to set
	// state and do other stuff
	componentDidCatch(error) {
		console.error(error);
		this.setState({ hasErrored: true, error: error.message })
	}

	render() {
		if (this.state.hasErrored) {
			return <p>Oh no! {this.state.error}</p>
		}
		return this.props.children
	}
}
`}
			</code>
		</CodeBlock>
		<p>
			So for our exercise let's look at the example, we have a component that throws,
			let's catch this in "App" and not render the normal component but tell our user
			that we've ran into an unexpected error.
		</p>
	</Fragment>
);

ErrorsTutorial.initialCode = `import { createElement, Component} from "preact";

const Thrower = () => {
	throw new Error('I am erroring')
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { errored: false }
	}

	render() {
		return <Thrower />
	}
}
`;

ErrorsTutorial.finalCode = `import { createElement, Component} from "preact";

const Thrower = () => {
	throw new Error('I am erroring')
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { errored: false }
	}

	componentDidCatch() {
		this.setState({ errored: true })
	}

	render() {
		return this.state.errored ? <p>Oh no!</p> : <Thrower />
	}
}
`;

export default ErrorsTutorial;
