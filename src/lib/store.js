import { h, Component } from 'preact';
import { shouldComponentUpdate } from './pure-component';


export default (state={}) => {
	let listeners = [];

	return {
		setState(update) {
			state = { ...state, ...update };
			listeners.forEach( f => f(state) );
		},
		subscribe(f) {
			listeners.push(f);
		},
		unsubscribe(f) {
			let i = listeners.indexOf(f);
			listeners.splice(i, !!~i);
		},
		getState() {
			return state;
		}
	};
};


export class Provider extends Component {
	getChildContext() {
		let { children, ...context } = this.props;
		return context;
	}
	render({ children }) {
		return children[0];
	}
}


export const connect = mapToProps => Child => class Wrapper extends Component {
	update = state => this.setState(mapToProps(state));
	shouldComponentUpdate = shouldComponentUpdate;
	componentWillMount() {
		this.context.store.subscribe(this.update);
	}
	componentWillUnmount() {
		this.context.store.unsubscribe(this.update);
	}
	render(props, state, context) {
		return <Child store={context.store} {...props} {...state} />;
	}
};
