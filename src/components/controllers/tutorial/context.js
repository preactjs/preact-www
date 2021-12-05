import { Fragment } from 'preact';
import style from './style.module.less';
import CodeBlock from '../../code-block';

const ContextTutorial = () => (
	<Fragment>
		<h2>6. Context</h2>
		<p>
			You can imagine in real world applications these virtual-dom trees can get
			quite nested and data is needed in various parts of this tree, think about
			authenticated information, what user are we dealing with, what is their
			name, ...
			<br />
			This is where context comes into play, conceptually you can think of this
			as contextualizing a part of your tree, a high-up parent has some
			information that gives meaning or context to the rest of its children,
			their children, ...
		</p>
		<p>
			In Preact we have an export named "createContext" which will give you back
			an object containing two components "Provider" and "Consumer". A parent
			will use the "Provider" to provide information to its subtree, the subtree
			in turn can consume (or use) this information by leveraging the "Consumer"
			component.
		</p>
		<CodeBlock repl="false" class={style.codeContainer}>
			<code class="language-jsx">
				{`import { createContext, createElement } from 'preact';
import { useState } from 'preact/hooks';

const AuthContext = createContext()

const Login = () => {
	return (
		<AuthContext.Consumer>
			{context => context.auth ? (
				<button style={props.style} onClick={() => context.setAuth({ name: 'Preact user' })}>
					Log out
				</button>
			) : (
				<button style={props.style} onClick={() => context.setAuth(null)}>
					Log in
				</button>
			)}
		<AuthContext.Consumer>
	);
}

export default function App() {
	const [auth, setAuth] = useState(null)

	return (
		<AuthContext.Provider value={{ auth, setAUth }}>
			<div style={{ padding: 8 }}>
				{auth && <p>Welcome {auth.name}</p>
				<Login />
			</div>
		</AuthContext.Provider>
	)
}
`}
			</code>
		</CodeBlock>
		<p>
			When no parent is providing a context being consumed it will fall back to
			the default value, which is the argument you can pass to "createContext".
			An alternative way to consume context is to leverage the "useContext"
			export from "preact/hooks", in this case it would look like
			"useContext(AuthContext)" which would give us the same result as
			leveraging the "Consumer" component.
			<br />
			So for our exercise let's create some synchronized counters, the app will
			have the value for the counter and when we click any of our counters we
			want all of their values to remain the same.
		</p>
	</Fragment>
);

ContextTutorial.initialCode = `import { createElement, createContext } from 'preact';
import { useState, useContext } from 'preact/hooks';

const CounterContext = createContext(null);

const Counter = () => {
	return (
		<div style={{ padding: 8 }}>
			<p style={{ color: 'red' }}>Count: {'MISSING'}</p>
			<button
				style={{ background: 'transparent' }}
				onClick={onClick}
			>Click me</button>
		</div>
	);
}

export default function App() {
	const [count, setCount] = useState(0);

	return (
		<div style={{ padding: 8 }}>
			<Counter />
			<Counter />
			<Counter />
		</div>
	)
}
`;

ContextTutorial.finalCode = `import { createElement, createContext } from 'preact';
import { useState, useContext } from 'preact/hooks';

const CounterContext = createContext(null);

const Counter = () => {
	const { count, increment } = useContext(CounterContext)
	return (
		<div style={{ padding: 8 }}>
			<p style={{ color: 'red' }}>Count: {count}</p>
			<button
				style={{ background: 'transparent' }}
				onClick={increment}
			>Click me</button>
		</div>
	);
}

export default function App() {
	const [count, setCount] = useState(0);

	return (
		<CounterContext.Provider value={{ count, increment: () => setCount(count +  1) }}>
			<Counter />
			<Counter />
			<Counter />
		</CounterContext>
	)
}`;

export default ContextTutorial;
