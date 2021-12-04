/* eslint-disable no-console  */
import { Fragment } from 'preact';
import CodeBlock from '../../code-block';

const ComponentsTutorial = () => (
	<Fragment>
		<h2>3. Components</h2>
		<p>
			All of this Virtual DOM talk is nice and all but how do we get benefit
			from this over just writing an HTML file? Well as everything here is just
			JavaScript we can reuse functions to generate Virtual DOM elements, this
			can be used for reusable components which gives us consistency, think
			about title, buttons, ...
		</p>
		<p>
			There are two ways of creating a component, we can create a "class
			component" or a "function component" they come down to the same thing, the
			difference is how they handle state, but we'll look at that in a later
			chapter. Here you'll find an example of each component:
		</p>
		<CodeBlock>
			<code class="language-js">
				{`import { Component } from 'preact';

// The class component way
class MyButton extends Component {
	render(props) {
		// You'll see "props.children" here, this is the children that a parent
		// can pass here by doing "<MyButton>Click me</MyButton>" here the string "Click me"
		// will be passed as props.children.
		return <button>{props.children}</button>
	}
}

// The functional component way
const MyButton = (props) => {
	return <button>{props.children}</button>
}`}
			</code>
			<p>
				What you use is your own preference, a lot will depend on what paradigm
				of state management clicks best with you. So now to put this to
				practice, let's create a "Button" abstraction that we can pass a
				"style", "onClick" and "children" property into and that will apply this
				to the underlying button dom-element.
			</p>
		</CodeBlock>
	</Fragment>
);

ComponentsTutorial.initialCode = `import { createElement } from 'preact';

export default function App() {
	const onClick = () => {
		console.log('hi')
	}

	return (
		<div style={{ padding: 8 }}>
			<p style={{ color: 'red' }}>Count:</p>
			<button onClick={onClick}>Click me</button>
		</div>
	)
}
`;

ComponentsTutorial.finalCode = `import { createElement } from 'preact';

const MyButton = (props) => {
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

export default ComponentsTutorial;
