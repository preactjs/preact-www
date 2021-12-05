import { Fragment } from 'preact';
import CodeBlock from '../../code-block';
import style from './style.module.less';

const StateTutorial = () => (
	<Fragment>
		<h2>4. State</h2>
		<p>
			We now know how to spawn a dom-node, we know how to pass properties, how
			to bind events and how to reuse components. However what we still need to
			learn is how do we make these components stateful.
		</p>
		<p>
			As we alluded to in the previous chapter there are two ways to make a
			component stateful in Preact, every time state changes Preact will
			recalculate the component with the new state, let's look at an example of
			each. Let's start with the way for class-components
		</p>
		<CodeBlock repl="false" class={style.codeContainer}>
			<code class="language-jsx">
				{`import { Component } from 'preact';

// The class component way
class MyButton extends Component {
	constructor(props) {
		super(props);
		// We initialize our state with "clicked" as false
		this.state = { clicked: false; };
		// We have to bind our function to this component instance
		// as it will be executed as part of the button.
		this.click = this.click.bind(this);
	}

	click() {
		this.setState({ clicked: true })
	}

	render() {
		// When we click the button this will say clicked rather than no clicks yet.
		return <button onClick={this.click}>{this.state.clicked ? 'Clicked' : 'No clicks yet'}</button>
	}
}
`}
			</code>
		</CodeBlock>
		<p>
			When we want to do this with functional components we'll leverage hooks
			which is imported from "preact/hooks" rather than just "preact".
		</p>
		<CodeBlock repl="false" class={style.codeContainer}>
			<code class="language-jsx">
				{`import { useState } from 'preact/hooks';

// The class component way
const MyButton = () => {
	const [clicked, setClicked] = useState(false);

	const click = () => {
		setClicked(true);
	}

	return <button onClick={click}>{this.state.clicked ? 'Clicked' : 'No clicks yet'}</button>
}
`}
			</code>
		</CodeBlock>
		<p>
			You can pick whichever approach you prefer, let's try and create a counter
			for this we'll need a state that represents the "count" and when we click
			our button we want to increase the count.
		</p>
	</Fragment>
);

StateTutorial.finalCode = `import { createElement } from 'preact';
import { useState } from 'preact/hooks';

const Button = (props) => {
	return (
		<button style={props.style} onClick={props.onClick}>
			{props.children}
		</button>
	);
}

export default function App() {
	const [count, setCount] = useState(0);

	const onClick = () => {
		setCount(count + 1)
		console.log('hi')
	}

	return (
		<div style={{ padding: 8 }}>
			<p style={{ color: 'red' }}>Count: {count}</p>
			<Button
				style={{ background: 'transparent' }}
				onClick={onClick}
			>Click me</Button>
		</div>
	)
}
`;

StateTutorial.initialCode = `import { createElement } from 'preact';

const Button = (props) => {
	return (
		<button style={props.style} onClick={props.onClick}>
			{props.children}
		</button>
	);
}

export default function App() {
	const onClick = () => {
		console.log('hi')
	}

	return (
		<div style={{ padding: 8 }}>
			<p style={{ color: 'red' }}>Count:</p>
			<Button
				style={{ background: 'transparent' }}
				onClick={onClick}
			>Click me</Button>
		</div>
	)
}
`;

export default StateTutorial;
