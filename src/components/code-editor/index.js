import { h } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import 'codemirror/lib/codemirror.css';
import style from './style.module.less';
import { keymap } from '@codemirror/view';
import { basicSetup, EditorView, EditorState } from '@codemirror/basic-setup';
import { history, historyKeymap } from '@codemirror/history';
import { defaultKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { gutter } from '@codemirror/gutter';
import { defaultHighlightStyle } from '@codemirror/highlight';

export default function CodeEditorNext({ value }) {
	const ref = useRef(null);
	const [editor, setEditor] = useState(null);

	useEffect(() => {
		const state = EditorState.create({
			doc: value,
			extensions: [
				basicSetup,
				history(),
				javascript(),
				html(),
				css(),
				json(),
				gutter(),
				defaultHighlightStyle,
				keymap.of([...defaultKeymap, ...historyKeymap])
			]
		});

		const view = new EditorView({
			state,
			parent: ref.current
		});

		setEditor(view);

		return () => {
			view.destroy();
		};
	}, [value]);

	return <div ref={ref} class={style.codeEditor} />;
}
