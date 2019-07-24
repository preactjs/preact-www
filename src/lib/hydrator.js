import { Component, render, createRef } from 'preact';

function interopDefault(mod) {
	return (mod && mod.default) || mod;
}

function ServerHydrator({ load, component, wrapperProps, ...props }) {
	const Child = interopDefault(component || load());
	return (
		<section {...(wrapperProps || {})}>
			<Child {...props} />
		</section>
	);
}

class Hydrator extends Component {
	root = createRef();

	boot = nextProps => {
		// don't initialize booting twice:
		if (this.booted) return;
		this.booted = true;
		const { component, load, ...props } = nextProps || this.props;
		const ready = exports => {
			this.Child = interopDefault(exports);
			this.hydrated = true;
			this._render(props);
		};
		if (component) return ready(component);
		Promise.resolve()
			.then(load)
			.then(ready);
	};

	_render(props) {
		const { Child } = this;
		render(<Child {...props} />, this.root.current);
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
		if (this.hydrated && this.root.current) {
			render(null, this.root.current);
		}
	}

	componentDidMount() {
		if (this.props.lazy) {
			new IntersectionObserver(([entry], obs) => {
				if (!entry.isIntersecting) return;
				obs.unobserve(this.root);
				this.boot();
			}).observe(this.root);
		} else if (this.props.boot !== false) {
			this.boot();
		}
	}

	render({ wrapperProps }) {
		return (
			<section
				ref={this.root}
				dangerouslySetInnerHTML={{ __html: '' }}
				suppressHydrationWarning
				{...(wrapperProps || {})}
			/>
		);
	}
}

export default PRERENDER ? ServerHydrator : Hydrator;
