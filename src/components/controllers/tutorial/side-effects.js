import { Fragment } from 'preact';
import CodeBlock from '../../code-block';
import style from './style.module.less';

const SideEffectsTutorial = () => (
	<Fragment>
		<h2>8. Side-effects</h2>
		<p>
			In most applications we'll have some form of side-effects where the most
			prevalent one will be fetching data or dispatching data to a
			remote-endpoint. This can't really be part of our regular render cycle, we
			want to handle these so it's safely removed from our render cycles.
			<br />
			Here is where effects come into play for hooks and lifecycle-methods for
			class-components. We'll look at both here so you can pick your preference
			for the example and try it out yourself. In class-components these
			lifecycle are recognizable by the "componentDid" prefix, so let's look at
			how we'd go about fetching data
		</p>
		<CodeBlock repl="false" class={style.codeContainer}>
			<code class="language-jsx">
				{`import { createElement, Component } from 'preact';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		// This will get called after the component mounts
		// for the first time, we can use this to initialize
		// a fetch
		fetch('your-endpoint', { method: 'GET' }).then(function(result) {
			// Now when this finishes we'll trigger a re-render with our new result.
			setState({ result })
		})
	}

	render() {
		return <input />
	}
}`}
			</code>
		</CodeBlock>
		<p>
			If this depends on a prop that can change our Componenst instane can
			implement componentDidUpdate and fetch from there, this way our component
			can still react to updates and implement the side-effect when it
			completes.
			<br />
			Now for hooks, this one is a bit tricker as we can't really think in
			mounts, we can only think in updates. Let's look at a small example to see
			what we mean by updates.
		</p>
		<CodeBlock repl="false" class={style.codeContainer}>
			<code class="language-jsx">
				{`import { createElement } from 'preact';
import { useEffect, useState } from 'preact/hooks';

const App = () => {
	const [state, setState] = useState()
	useEffect(() => {
		// This will get called when the component first renders and will get called
		// again when the "dependencies" change (see second argument)
		fetch('your-endpoint', { method: 'GET' }).then(function(result) {
			// Now when this finishes we'll trigger a re-render with our new result.
			setState({ result })
		})
		// this [] are the dependencies, so let's say we have a props.counter, if we input
		// [props.counter] this function will get called again when this counter changes value.
		// Hence we can react to updates through effects.
	}, [])

	return <input />
}`}
			</code>
		</CodeBlock>
		<p>
			These are the two ways that can be used to define side-effects in our
			component.
			<br />
			One final thing we'll need to touch on before diving into the example is
			lists, when we for instance render a list of items in our virtual-dom it
			will be hard for the Preact reconciler to see which items have changed,
			for this we have a special keyword that you can pass into the virtual-dom
			(just like "ref") named "key".
		</p>
		<CodeBlock repl="false" class={style.codeContainer}>
			<code class="language-jsx">
				{`import { createElement } from 'preact';

const todos = [{ id: 1, text: 'hi' }, { id: 2, text: 'bye' }]

const App = () => {
	return (
		<div>
			{todos.map(todo => (
				<p key={todo.id}>
					{todo.text}
				</p>
			))}
		</div>
	)
}`}
			</code>
		</CodeBlock>
		<p>
			Because we use the unique "id" value here for the key we'll be able to
			efficiently rerender when a new todo replaces this one.
			<br />
			All right, enough with the examples, let's dive right in, we have an
			example here, a method that allows you to get some todos (side-effect) and
			a component that should render them.
		</p>
	</Fragment>
);

SideEffectsTutorial.initialCode = `import { createElement } from 'preact';

const wait = (ms) => new Promise(res => setTimeout(res, ms));
const getTodos = async () => {
	await wait(500);
	return [
		{ id: 1, text: 'learn Preact', complete: false },
		{ id: 2, text: 'make an awesome app', complete: false },
	]
};

const SideEffectsTutorial = () => {
	return (
		<div style={{ padding: 8 }}>
		</div>
	)
}

export default SideEffectsTutorial;`;

SideEffectsTutorial.finalCode = `import { createElement } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const wait = (ms) => new Promise(res => setTimeout(res, ms));
const getTodos = async () => {
	await wait(500);
	return [
		{ id: 1, text: 'learn Preact', complete: false },
		{ id: 2, text: 'make an awesome app', complete: false },
	]
};

const SideEffectsTutorial = () => {
	const [todos, setTodos] = useState([]);

	useEffect(() => {
		getTodos().then(function (todos) {
			setTodos(todos)
		})
	}, [])

	return (
		<div style={{ padding: 8 }}>
			{todos.map(todo => (
				<p key={todo.id}>
					{todo.text}
				</p>
			))}
		</div>
	)
}

export default SideEffectsTutorial;`;

export default SideEffectsTutorial;
