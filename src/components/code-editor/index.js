import { h } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import 'codemirror/lib/codemirror.css';
import style from './style.module.less';
// import { keymap } from '@codemirror/view';
// import { basicSetup, EditorView, EditorState } from '@codemirror/basic-setup';
// import { history, historyKeymap } from '@codemirror/history';
// import { defaultKeymap } from '@codemirror/commands';
// import { javascript } from '@codemirror/lang-javascript';
// import { html } from '@codemirror/lang-html';
// import { css } from '@codemirror/lang-css';
// import { json } from '@codemirror/lang-json';
// import { gutter } from '@codemirror/gutter';
// import { defaultHighlightStyle } from '@codemirror/highlight';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

self.MonacoEnvironment = {
	getWorker(_, label) {
		if (label === 'json') {
			return new jsonWorker();
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return new cssWorker();
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return new htmlWorker();
		}
		if (label === 'typescript' || label === 'javascript') {
			return new tsWorker();
		}
		return new editorWorker();
	}
};

export default function CodeEditorNext({ value }) {
	const ref = useRef(null);
	const [editor, setEditor] = useState(null);

	useEffect(() => {
		monaco.editor.create(ref.current, {
			value,
			language: 'javascript'
		});
		setEditor(200);
		// const state = EditorState.create({
		// 	doc: value,
		// 	extensions: [
		// 		basicSetup,
		// 		history(),
		// 		javascript(),
		// 		html(),
		// 		css(),
		// 		json(),
		// 		gutter(),
		// 		defaultHighlightStyle,
		// 		keymap.of([...defaultKeymap, ...historyKeymap])
		// 	]
		// });

		// const view = new EditorView({
		// 	state,
		// 	parent: ref.current
		// });

		// setEditor(view);

		return () => {
			// view.destroy();
		};
	}, []);

	return <div ref={ref} class={style.codeEditor} />;
}
