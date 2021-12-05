/* eslint-disable no-console  */
import { Fragment } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import CodeBlock from '../../code-block';
import style from './style.module.less';

const EventsTutorial = () => {
	const [called, setCalled] = useState(false);

	useEffect(() => {
		let prevConsoleLog = console.log;
		console.log = function(...args) {
			setCalled(true);
			prevConsoleLog.call(window, ...args);
		};

		return () => {
			console.log = prevConsoleLog;
		};
	}, []);

	return (
		<Fragment>
			<h2>2. Events</h2>
			<p>
				Next up we'll look at how events work in Preact, events are instrumental
				to us having an interactive application, this is part of the DOM and
				hence also part of our attributes (properties) model.
			</p>
			<p>
				We can assign events to our dom-nodes with the "on" prefix, so if we
				want to assign a click-handler to our button we can simply say "onClick"
				which will instrument it to call a certain function when an event
				occurs. Similar to doing the following yourself:
			</p>

			<CodeBlock repl="false" class={style.codeContainer}>
				<code class="language-js">
					{`const myButton = document.getElementById('my-button')
myButton.addEventListener('click', function() { console.log('clicked') })`}
				</code>
			</CodeBlock>

			<p>
				To complete this let's assign a click-handler through jsx on our Button
				and then click it, make the click-handler perform a "console.log" call.
			</p>

			{called && (
				<p>
					Congratulations! You just assigned your first event-handler through
					Preact!
				</p>
			)}
		</Fragment>
	);
};

EventsTutorial.initialCode = `import { createElement } from 'preact';

export default function App() {
	return (
		<div style={{ padding: 8 }}>
			<p style={{ color: 'red' }}>Count:</p>
			<button>Click me</button>
		</div>
	)
}
`;

EventsTutorial.finalCode = `import { createElement } from 'preact';

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

export default EventsTutorial;
