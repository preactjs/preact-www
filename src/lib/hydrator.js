import { Component, hydrate, createRef } from 'preact';

function interopDefault(mod) {
	return (mod && mod.default) || mod;
}

export default PRERENDER ? ServerHydrator : Hydrator;

export function ServerHydrator({ load, ...props }) {
	const Child = interopDefault(load());
	return (
		<section>
			<Child {...props} />
		</section>
	);
}

export class Hydrator extends Component {
	root = createRef();

	boot = nextProps => {
		if (this.hasBooted) return;
		const { load, ...props } = nextProps || this.props;
		this.hasBooted = true;
		Promise.resolve()
			.then(load)
			.then(exports => {
				this.Child = interopDefault(exports);
				this.ready = true;
				this._render(props);
			});
	};

	_render(props) {
		const { Child } = this;
		hydrate(<Child {...props} />, this.root.current);
	}

	shouldComponentUpdate(nextProps) {
		if (this.ready) {
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

	render() {
		return (
			<section
				ref={this.root}
				dangerouslySetInnerHTML={{ __html: '' }}
				suppressHydrationWarning
			/>
		);
	}
}
