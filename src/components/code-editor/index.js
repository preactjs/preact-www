import { h, Component, render } from 'preact';
import codemirror from 'codemirror';
import { debounce } from 'decko';
import js from 'codemirror/mode/jsx/jsx';
import 'codemirror/addon/comment/comment';
import 'codemirror/lib/codemirror.css';
import style from './style';

export default class CodeEditor extends Component {
	scratch = document.createElement('div');

	shouldComponentUpdate() {
		return false;
	}

	componentWillReceiveProps({ value, error }) {
		let current = this.hasOwnProperty('value') ? this.value : this.props.value;
		if (value!==current) {
			let e = this.events;
			this.events = false;
			this.value = value;
			this.editor.setValue(value);
			this.showError(null);
			setTimeout( () => this.editor.refresh(), 1);
			this.events = e;
		}

		if (error!==this.props.error) {
			this.showError(error);
		}
	}

	showError(error) {
		clearTimeout(this.showErrorTimer);
		if (this.errors) {
			this.editor.operation( () => {
				this.errors.forEach( e => e.clear() );
			});
			this.errors.length = 0;
		}

		if (!error || !error.loc) return;

		this.showErrorTimer = setTimeout( () => {
			this.editor.operation( () => {
				let { left } = this.editor.cursorCoords({ line:error.loc.line-1, ch:error.loc.column-1 }, 'local');
				this.errors = [
					this.editor.addLineWidget(error.loc.line-1, render(
						<div class={style.lintError}>
							<pre style={`padding-left:${left}px;`}>^</pre>
							<div>🔥 { error.message.split('\n')[0] }</div>
						</div>
					,this.scratch))
				];
			});
		}, 5000);
	}

	@debounce
	componentDidMount() {
		if (this.editor) return this.editor.refresh();

		let { spaces, value, tabSize } = this.props;

		this.editor = codemirror(this.base, {
			value: String(value || ''),
			mode: 'jsx',
			theme: 'one-dark',
			lineNumbers: true,
			indentWithTabs: !spaces,
			tabSize: tabSize || 2,
			indentUnit: spaces ? (Math.round(spaces) || 2) : false,
			showCursorWhenSelecting: true
		});

		this.editor.addKeyMap({
			'Cmd-/': 'toggleComment'
		});

		this.editor.on('change', () => {
			if (this.events===false) return;

			this.value = this.editor.getValue();
			let { onInput } = this.props;
			if (onInput) onInput({ value: this.value });
		});
	}

	render({ value, onInput, children, ...props }) {
		return <div {...props} class={{ [style.codeEditor]:true, [props.class]:props.class }} />;
	}
}
