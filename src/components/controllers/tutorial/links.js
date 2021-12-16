import { Fragment } from 'preact';

const Links = () => (
	<Fragment>
		<h2>Congratulations!</h2>
		<p>Feel free to play around a bit more!</p>
		<a href="/guide/v10/components">Learn more about class components</a>
		<a href="/guide/v10/hooks">Learn more about hooks</a>
		<a href="https://vite.new/preact" target="blank" rel="nofollow">
			Create your own project
		</a>
	</Fragment>
);

Links.initialCode = `import { createElement } from 'preact';
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

export default Links;
