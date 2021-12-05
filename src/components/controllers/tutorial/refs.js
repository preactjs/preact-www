import { Fragment } from 'preact';
import CodeBlock from '../../code-block';
import style from './style.module.less';

const RefsTutorial = () => (
	<Fragment>
		<h2>5. Refs</h2>
		<p>
			The DOM can do unique things that are a bit imperative, like calling
			"focus" on an input so our user doesn't have to explicitly click it. This
			can be done through for instance a dom-attribute when the input first
			renders (autofocus) but sometimes we want to do this at a given time or
			after a certain event.
		</p>
		<p>
			For this use-case Preact offers you refs, a ref is a mutable object that
			when changed does not trigger a rerender instead on the next render or in
			what closure you use it it will be the updated value. A ref looks like the
			following: "&#123; current: "your-value" &#125;" so how do we apply this
			to a dom-node?
			<br />
			Well Preact has a few special keywords that you can pass on a dom-node and
			"ref" is one of them. Let's look at an example
		</p>
		<CodeBlock repl="false" class={style.codeContainer}>
			<code class="language-jsx">
				{`import { createElement } from 'preact';
import { useRef } from 'preact/hooks';

export default function App() {
	const input = useRef();
	return <input ref={input} />
}`}
			</code>
		</CodeBlock>
		<p>
			now after this has rendered "input.current" will contain a reference to
			this dom-node which we can use to for instance call
			"input.current.focus()" when someone clicks a button.
			<br />
			Refs can be used for more than just storing dom-nodes as we can just
			assign values like "x.current = y" but we'll see this in another chapter.
			<br />
			Now let's put this to practice, when we click our button we want to focus
			the input!
		</p>
	</Fragment>
);

RefsTutorial.initialCode = `import { createElement } from 'preact';
import { useRef } from 'preact/hooks';

export default function App() {
	function onClick() {

	}

	return (
		<div>
			<input initialValue="hello-world" />
			<Button id="focus-input" onClick={onClick}>Focus input</Button>
		</div>
		);
}
`;

RefsTutorial.finalCode = `import { createElement } from 'preact';
import { useRef } from 'preact/hooks';

export default function App() {
	const input = useRef();
	function onClick() {
		input.current.focus();
	}

	return (
		<div>
			<input ref={input} initialValue="hello-world" />
			<Button id="focus-input" onClick={onClick}>Focus input</Button>
		</div>
		);
}
`;

export default RefsTutorial;
