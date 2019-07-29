import { Component, render, hydrate, createRef } from 'preact';
import { lazily, cancelLazily } from './lazily';

function interopDefault(mod) {
	return (mod && mod.default) || mod;
}

const EMPTY_OBJ = {};

function ServerHydrator({ load, component, wrapperProps, ...props }) {
	const Child = interopDefault(component || load());
	return (
		<section {...(wrapperProps || {})}>
			<Child {...props} />
		</section>
	);
}

class ContextProvider extends Component {
	getChildContext() {
		return this.props.context;
	}
	render(props) {
		return props.children;
	}
}

class Hydrator extends Component {
	root = createRef();

	boot = nextProps => {
		// don't initialize booting twice:
		if (this.booted) return;
		this.booted = true;
		const { component, load, ...props } = nextProps || this.props;
		const ready = exports => {
			this.timer = lazily(() => {
				this.timer = null;
				this.Child = interopDefault(exports);
				this._render(props);
				this.hydrated = true;
			});
		};
		if (component) return ready(component);
		Promise.resolve()
			.then(load)
			.then(ready);
	};

	_render(props) {
		const { Child } = this;
		// hydrate on first run, then normal renders thereafter
		const doRender = this.hydrated ? render : hydrate;
		doRender(
			<ContextProvider context={this.context}>
				<Child {...props} />
			</ContextProvider>,
			this.root.current
		);
	}

	shouldComponentUpdate(nextProps) {
		if (this.hydrated) {
			this._render(nextProps);
		} else if (nextProps.boot && !this.props.boot) {
			this.boot(nextProps);
		}
		return false;
	}

	componentWillUnmount() {
		if (this.timer) {
			cancelLazily(this.timer);
		}
		if (this.hydrated && this.root.current) {
			render(null, this.root.current);
		}
	}

	componentDidMount() {
		if (this.props.lazy && typeof IntersectionObserver === 'function') {
			const root = this.root.current;
			new IntersectionObserver(([entry], obs) => {
				if (!entry.isIntersecting) return;
				obs.unobserve(root);
				this.boot();
			}).observe(root);
		} else if (this.props.boot !== false) {
			this.boot();
		}
	}

	render({ wrapperProps, wrapperType }) {
		const Type = wrapperType || 'section';
		return (
			<Type
				ref={this.root}
				dangerouslySetInnerHTML={EMPTY_OBJ}
				// suppressHydrationWarning
				{...(wrapperProps || {})}
			/>
		);
	}
}

export default PRERENDER ? ServerHydrator : Hydrator;
