import { render, options, Component } from 'preact';

const COUNT = 500;
const LOOPS = 6;

// Configure Preact to prioritize smooth animation over input handling:
options.debounceRendering = requestAnimationFrame;

class Spiral extends Component {
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

render(<Spiral />, document.getElementById('app'));


// Add some styles!!
const style = document.createElement('style');
document.body.append(style);
style.textContent = `
html, body {
	height: 100%;
	background: #222;
	font: 100%/1.21 'Helvetica Neue',helvetica,sans-serif;
	text-rendering: optimizeSpeed;
	color: #888;
	//pointer-events: none;
	//user-select: none;
	overflow: hidden;
}

#main {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.cursor {
	position: absolute;
	left: 0;
	top: 0;
	width: 8px;
	height: 8px;
	margin: -5px 0 0 -5px;
	border: 2px solid #F00;
	border-radius: 50%;
	transform-origin: 50% 50%;
	// transition: transform 150ms ease;
	transition: all 250ms ease;
	transition-property: width, height, margin;
	pointer-events: none;
	overflow: hidden;
	font-size: 9px;
	line-height: 25px;
	text-indent: 15px;
	white-space: nowrap;
	// transform: translateZ(0);

	&.label {
		overflow: visible;
	}

	&.big {
		// transform: scale(2);
		width: 24px;
		height: 24px;
		margin: -13px 0 0 -13px;
	}

	.label {
		position: absolute;
		left: 0;
		top: 0;
		//transform: translateZ(0);
		z-index: 10;
	}
}


.animation-picker {
	position: fixed;
	display: inline-block;
	right: 0;
	top: 0;
	padding: 10px;
	background: #000;
	color: #BBB;
	z-index: 1000;

	select {
		font-size: 100%;
		margin-left: 5px;
	}
}
`;
