const COUNT = 500;
const LOOPS = 6;

// Configure Preact to prioritize smooth animation over input handling:
options.debounceRendering = requestAnimationFrame;

export class Spiral extends Component {
	state = { x: 0, y: 0, big: false, count: 0 };

	handleMouseMove = e => {
		this.setState({ x: e.pageX, y: e.pageY });
	};

	handleMouseDownUp = e => {
		this.setState({ big: e.type === 'mousedown' });
	};

	increment = () => {
		this.setState({ count: this.state.count + 1 });
		this.raf = requestAnimationFrame(this.increment);
	};

	componentDidMount() {
		// start animating
		this.increment();
	}

	componentWillUnmount() {
		cancelAnimationFrame(this.raf);
	}

	render(props, { x, y, big, count }) {
		let max = (COUNT + Math.sin((count / 90) * 2 * Math.PI) * COUNT * 0.5) | 0,
			dots = [];

		for (let i = max; i--; ) {
			let f = (i / max) * LOOPS,
				angle = f * 2 * Math.PI,
				dx = x + Math.sin(angle) * (20 + i * 2),
				dy = y + Math.cos(angle) * (20 + i * 2),
				color = `hsl(${(f * 255 + count * 10) % 255}, 100%, 50%)`;
			dots[i] = <Dot x={dx | 0} y={dy | 0} big={big} color={color} />;
		}

		return (
			<div
				id="spiral"
				onMouseMove={this.handleMouseMove}
				onMouseDown={this.handleMouseDownUp}
				onMouseUp={this.handleMouseDownUp}
			>
				<Dot x={x} y={y} big={big} label />
				{dots}
			</div>
		);
	}
}

class Dot extends Component {
	shouldComponentUpdate({ x, y, big, label, color }) {
		// only re-render when props change
		return (
			x !== this.props.x ||
			y !== this.props.y ||
			big !== this.props.big ||
			label !== this.props.label ||
			color !== this.props.color
		);
	}

	render({ x = 0, y = 0, label, color, big }) {
		let style = {
			transform: `translate(${x}px, ${y}px) scale(${big ? 2 : 1})`,
			borderColor: color
		};
		let className = `dot ${big ? ' big' : ''} ${label ? ' label' : ''}`;
		return (
			<div class={className} style={style}>
				{label && (
					<span class="label">
						{x},{y}
					</span>
				)}
			</div>
		);
	}
}
