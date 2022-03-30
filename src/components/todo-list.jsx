import { h, Component } from 'preact';

export default class TodoList extends Component {
	state = {
		todos: [],
		text: ''
	};

	updateText = e => {
		this.setState({ text: e.target.value });
	};

	addItem = () => {
		let { todos, text } = this.state;
		todos = todos.concat({ text });
		this.setState({ todos, text: '' });
	};

	render(props, { todos, text }) {
		return (
			<form onSubmit={this.addItem} action="javascript:">
				<label>
					<span>Add Todo</span>
					<input value={text} onInput={this.updateText} />
				</label>
				<button type="submit">Add</button>
				<ul>
					{todos.map(todo => (
						<li>{todo.text}</li>
					))}
				</ul>
			</form>
		);
	}
}
