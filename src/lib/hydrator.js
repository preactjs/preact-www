import { Component, render, hydrate, createRef } from 'preact';

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
		// don't boot twice:
		if (this.hasBooted) return;
		this.hasBooted = true;
		const { component, load, ...props } = nextProps || this.props;
		const ready = exports => {
			this.Child = interopDefault(exports);
			this._render(props);
		};
		if (component) return ready(component);
		Promise.resolve()
			.then(load)
			.then(ready);
	};

	_render(props) {
		const { hydrated, Child } = this;
		this.hydrated = true;
		// on re-renders, don't hydrate:
		const fn = hydrated ? render : hydrate;
		fn(<Child {...props} />, this.root.current);
	}

	shouldComponentUpdate(nextProps) {
		if (this.hydrated) {
			this._render(nextProps);
		} else if (nextProps.boot && !this.props.boot) {
			this.boot(nextProps);
		}
		return false;
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
