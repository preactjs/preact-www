import { h, Component, render } from 'preact';
import { bind, debounce } from 'decko';
import codeExample from './code-example.txt';
import style from './style';

export default class Repl extends Component {
	state = {
		loading: 'Initializing...',
		code: localStorage.getItem('preact-www-repl-code') || codeExample
	};

	constructor(props) {
		super();
		this.componentWillReceiveProps(props);
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

	@bind
	onSuccess() {
		this.setState({ error:null });
	}

	@debounce(500)
	componentDidUpdate() {
		let { code } = this.state;
		if (code!==codeExample) {
			localStorage.setItem('preact-www-repl-code', code || '');
		}
	}

	componentWillReceiveProps({ code }) {
		if (code && code!==this.props.code && code!==this.state.code) {
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

	render(_, { loading, code, error }) {
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
				<pre class={{ [style.error]:true, [style.showing]:!!error }}>{ String(error) }</pre>
				<this.CodeEditor class={style.code} value={code} error={error} onInput={this.linkState('code', 'value')} />
				<this.Runner class={style.output} onError={this.linkState('error', 'error')} onSuccess={this.onSuccess} code={code} />
			</div>
		);
	}
}
