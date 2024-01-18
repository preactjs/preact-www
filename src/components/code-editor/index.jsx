import { Component, render } from 'preact';
import codemirror from 'codemirror';
import cx from '../../lib/cx';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/addon/comment/comment';
import 'codemirror/lib/codemirror.css';
import style from './style.module.css';
// TODO: Fix me, Vite doesn't seem to like :global in CSS Modules
import './temp.css';

export default class CodeEditor extends Component {
	scratch = document.createElement('div');

	showError(error) {
		clearTimeout(this.showErrorTimer);
		if (this.errors) {
			this.editor.operation(() => {
				this.errors.forEach(e => e.clear());
			});
			this.errors.length = 0;
		}

		if (!error || !error.loc) return;

		this.showErrorTimer = setTimeout(() => {
			this.editor.operation(() => {
				let { left } = this.editor.cursorCoords(
					{ line: error.loc.line - 1, ch: error.loc.column - 1 },
					'local'
				);
				let ref;
				const errorLine = (
					<div ref={r => (ref = r)} class={style.lintError}>
						<pre style={`padding-left:${left}px;`}>▲</pre>
						<div>🔥 {error.message.split('\n')[0]}</div>
					</div>
				);
				render(errorLine, this.scratch);
				this.errors = [this.editor.addLineWidget(error.loc.line - 1, ref)];
			});
		}, 1000);
	}

	componentDidMount() {
		let { spaces, value, tabSize } = this.props;

		this.editor = codemirror(this.base, {
			value: String(value || ''),
			mode: 'jsx',
			theme: 'one-dark',
			lineNumbers: true,
			indentWithTabs: !spaces,
			tabSize: tabSize || 2,
			indentUnit: spaces ? Math.round(spaces) || 2 : false,
			showCursorWhenSelecting: true,
			extraKeys: {
				'Cmd-/': 'toggleComment'
			}
		});

		this.editor.on('change', () => {
			if (this.events === false) return;

			this.value = this.editor.getValue();
			let { onInput } = this.props;
			if (onInput) onInput({ value: this.value });
		});
	}

	componentWillReceiveProps({ value, error }) {
		let current = this.hasOwnProperty('value') ? this.value : this.props.value;
		if (value !== current) {
			let e = this.events;
			this.events = false;
			this.value = value;
			this.editor.setValue(value);
			this.showError(null);
			setTimeout(() => this.editor.refresh(), 1);
			this.events = e;
		}

		if (error !== this.props.error) {
			this.showError(error);
		}
	}

	shouldComponentUpdate() {
		return false;
	}

	componentWillUnmount() {
		let wrapper = this.editor && this.editor.getWrapperElement();
		if (wrapper) this.base.removeChild(wrapper);
		this.editor = null;
	}

	render({ value, onInput, children, ...props }) {
		return <div {...props} class={cx(style.codeEditor, props.class)} />;
	}
}
