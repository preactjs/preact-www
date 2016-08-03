import { h, Component } from 'preact';
import Svg from 'preact-svg';

export default class Logo extends Component {
	state = { i:0 };

	frame = () => {
		this.timer = null;
		if (!this.mounted) return;
		this.setState({ i: this.state.i+1 }, this.next);
	};

	next = () => {
		if (!this.mounted || this.props.paused || this.timer) return;
		this.timer = (requestAnimationFrame || setTimeout)(this.frame, 15);
	};

	componentDidMount() {
		this.mounted = true;
		this.next();
	}

	componentWillUnmount() {
		(cancelAnimationFrame || clearTimeout)(this.timer);
		this.mounted = this.timer = false;
	}

	componentDidUpdate() {
		this.next();
	}

	renderEllipse(fg, deg, offset) {
		return (
			<ellipse cx="0" cy="0" stroke-dasharray={`400 ${Math.sin(offset/500*Math.PI)*30+60}`} stroke-dashoffset={offset*10 + Math.sin(offset/100*Math.PI)*200} stroke-width="16px" rx="75px" ry="196px" fill="none" stroke={fg} transform={`rotate(${deg})`} />
		);
	}

	render({ inverted=false, fg='white', bg='#673ab8', component, ...props }, { i }) {
		let Root = component || 'div';
		if (inverted) [bg, fg] = [fg, bg];

		return (
			<Svg width="34px" height="34px" viewBox="-256 -256 512 512" style="display:inline-block; margin:-.25em 0 0; vertical-align:middle;" {...props}>
				<path style={`transition:all 1s ease; transform:rotate(${Math.floor(i/60/10)*60}deg);`} d="M0,-256 221.7025033688164,-128 221.7025033688164,128 0,256 -221.7025033688164,128 -221.7025033688164,-128z" fill={bg} />
				{ this.renderEllipse(fg, 52, i) }
				{ this.renderEllipse(fg, -52, -0.7*i) }
				<circle cx="0" cy="0" r="34" fill={fg} />
			</Svg>
		);
	}
}

export const InvertedLogo = (props) => {
	return (
		<Logo inverted {...props}/>
	);
}
