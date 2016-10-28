import { h, Component, render } from 'preact';
import { debounce } from 'decko';
import codeExample from './code-example.txt';
import style from './style';

const EXAMPLES = [
	{
		name: 'Github Repo List',
		code: codeExample
	}
];

export default class Repl extends Component {
	state = {
		loading: 'Initializing...',
		code: localStorage.getItem('preact-www-repl-code') || codeExample
	};

	constructor(props, context) {
		super(props, context);
		if (props.code) this.receiveCode(props.code);
	}

	componentDidMount() {
		this.setState({ loading:'Loading REPL...' });

		// Load the code editor
		require.ensure([], require => {
			let r = obj => obj.default || obj;
			this.CodeEditor = r(require('../../code-editor'));
			this.Runner = r(require('./runner'));

			// Load transpiler
			this.setState({ loading:'Initializing Babel worker...' });
			this.Runner.worker.call('ping').then( () => {
				this.setState({ loading:false });
			});
		}, 'repl');

		// webpack 2:
		// Promise.all([
		// 	System.import('../../code-editor'),
		// 	System.import('./runner')
		// ]).then( (CodeEditor, Runner) => {
		// 	this.CodeEditor = CodeEditor;
		// 	this.Runner = Runner;
		// 	this.setState({ loading:false, loaded:true });
		// });
	}

	share = () => {
		let { code } = this.state;
		history.replaceState(null, null, `/repl?code=${encodeURIComponent(code)}`);

		try {
			let input = document.createElement('input');
			input.style.cssText = 'position:absolute; left:0; top:-999px;';
			input.value = location.href;
			document.body.appendChild(input);
			input.select();
			document.execCommand('copy');
			input.blur();
			document.body.removeChild(input);
			this.setState({ copied:true });
			setTimeout( () => this.setState({ copied:false }), 1000);
		} catch (err) {
			console.log(err);
		}
	};

	loadExample = () => {
		let example = EXAMPLES[this.state.example];
		if (example && example.code!==this.state.code) {
			this.setState({ code: example.code });
		}
	};

	onSuccess = () => {
		this.setState({ error:null });
	};

	componentDidUpdate = debounce(500, () => {
		let { code } = this.state;
		if (code===codeExample) code = '';
		localStorage.setItem('preact-www-repl-code', code || '');
	})

	componentWillReceiveProps({ code }) {
		if (code && code!==this.props.code) {
			this.receiveCode(code);
		}
	}

	receiveCode(code) {
		if (code && code!==this.state.code) {
			if (!document.referrer || document.referrer.indexOf(location.origin)===0) {
				this.setState({ code });
			}
			else {
				setTimeout( () => {
					if (confirm('Run code from link?')) {
						this.setState({ code });
					}
				}, 20);
			}
		}
	}

	render(_, { loading, code, error, example, copied }) {
		if (loading) return (
			<div class={style.repl}>
				<div class={style.loading}>
					<progress-spinner />
					<h4>{loading}</h4>
				</div>
			</div>
		);

		return (
			<div class={style.repl}>
				<header class={style.toolbar}>
					<label>
						<select value={example} onChange={this.linkState('example')}>
							<option value="">Select Example...</option>
							{ EXAMPLES.map( ({ name }, index) => (
								<option value={index}>{name}</option>
							)) }
						</select>
						<button class={style.reset} onClick={this.loadExample} disabled={!example}>Load</button>
					</label>
					<button class={style.share} onClick={this.share}>{copied ? '🔗 Copied' : 'Share'}</button>
				</header>
				<pre class={{ [style.error]:true, [style.showing]:!!error }}>{ String(error) }</pre>
				<this.CodeEditor class={style.code} value={code} error={error} onInput={this.linkState('code', 'value')} />
				<this.Runner class={style.output} onError={this.linkState('error', 'error')} onSuccess={this.onSuccess} code={code} />
			</div>
		);
	}
}
