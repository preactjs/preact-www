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
			<div>
				<form onSubmit={this.addItem} action="javascript:">
					<input value={text} onInput={this.updateText} />
					<button type="submit">Add</button>
				</form>
				<ul>
					{ todos.map( todo => (
						<li>{todo.text}</li>
					)) }
				</ul>
			</div>
		);
	}
}
