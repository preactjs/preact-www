import { Fragment } from 'preact';
import CodeBlock from '../../code-block';
import style from './style.module.less';

const VDomTutorial = () => (
	<Fragment>
		<h2>1. Virtual DOM</h2>
		<p>
			You might've heard a lot of people talk about Virtual DOM libraries, which
			might be confusing as how does it differ from our real DOM? Well in a
			Virtual DOM library we'll keep a virtual representation of your DOM-tree
			in-memory so we can "diff" them. This means that when an update comes in
			we can see what the differences between the previous and current Virtual
			DOM tree are and then apply them to the actual DOM.
		</p>
		<p>
			In this chapter we'll learn how we actually create one of those Virtual
			DOM trees and make it translate to DOM for us. There are a few ways of
			creating one of these trees:
		</p>
		<ul>
			<li>
				Leverage the <code>createElement</code> function exported from preact
			</li>
			<li>
				Write JSX, which is an HTML-like syntax that get transpiled by
				Babel/ESBuild/... to <code>createElement</code>
			</li>
			<li>
				Use the <a href="https://github.com/developit/htm">htm library</a>
			</li>
		</ul>

		<p>An example:</p>

		<CodeBlock repl="false" class={style.codeContainer}>
			<code class="language-jsx">
				{`import { createElemnt } from 'preact';

export default function App() {
	return createElement('p', { class: 'my-paragraph' }, 'hello world')
}`}
			</code>
		</CodeBlock>

		<p>
			So what does the above code snipper do? Well we tell Preact to render a
			paragraph element with the text hello-world. As the first-prop is the type
			of element we want, the second are the attributes we want to assign to it,
			in this case we are assigning it a class named "my-paragraph" and the last
			attribute is the child for this paragraph which is the text "hello world"
			in this case. If we'd translate this to JSX we'd see:
		</p>

		<CodeBlock repl="false" class={style.codeContainer}>
			<code class="language-jsx">
				{`import { createElemnt } from 'preact';

export default function App() {
	return <p class="my-paragraph">Hello world</p>
}`}
			</code>
		</CodeBlock>

		<p>
			On the right-hand side you'll see the code at the top and the rendered
			result at the bottom, you'll see our hello-world rendered. Now we want to
			give this some more... Power, let's wrap our paragraph with a div and use
			the "style" attribute to give it a padding of 8, we can use the style
			attribute like this: style=&#123;&#123; property: value, &#125;&#125;. You
			can give it some color as well if you like, play around with it, have fun!
			Next up, let's add a "button" element with the text "increment" and change
			text of "hello world" to "Count:"
		</p>
	</Fragment>
);

VDomTutorial.initialCode = `import { createElement } from 'preact';

export default function App() {
	return (
		<div style={{ padding: 8 }}>
			<p>Hello world</p>
		</div>
	)
}
`;

VDomTutorial.finalCode = `import { createElement } from 'preact';

export default function App() {
	return (
		<div style={{ padding: 8 }}>
			<p style={{ color: 'red' }}>Count:</p>
			<button>Click me</button>
		</div>
	)
}
`;

export default VDomTutorial;
