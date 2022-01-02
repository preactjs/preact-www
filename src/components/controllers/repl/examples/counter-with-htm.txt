import { html } from 'htm/preact';

export function Counter() {
	const [count, add] = useReducer((a, b) => a + b, 0);

	return html`
		<button onClick=${() => add(-1)}>Decrement</button>
		<input readonly size="4" value=${count} />
		<button onClick=${() => add(1)}>Increment</button>
		<style>
			input,
			button {
				margin: 0.5em;
				text-align: center;
				font: inherit;
			}
		</style>
	`;
}
