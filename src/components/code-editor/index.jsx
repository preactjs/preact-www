import { useState, useRef, useEffect } from 'preact/hooks';
import { EditorView } from 'codemirror';
import { lineNumbers, keymap, highlightActiveLineGutter, highlightActiveLine } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { syntaxHighlighting, HighlightStyle, indentUnit, bracketMatching } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { closeBrackets, autocompletion } from '@codemirror/autocomplete';
import cx from '../../lib/cx';

import style from './style.module.css';
import './code-mirror.css';

// Custom theme that better matches our Prism config, though
// the lexer is somewhat limited so it still deviates
const highlightStyle = HighlightStyle.define([
	{ tag: tags.keyword, class: 'cm-keyword' },
	{ tag: [tags.definition(tags.function(tags.name)), tags.function(tags.name), tags.propertyName], class: 'cm-function' },
	{ tag: tags.literal, class: 'cm-literal' },
	{ tag: tags.tagName, class: 'cm-tag' },
	{ tag: tags.attributeName, class: 'cm-attribute' },
	{ tag: tags.string, class: 'cm-string' },
	{ tag: [tags.operator], class: 'cm-operator' },
	{ tag: tags.comment, class: 'cm-comment' },
	{ tag: tags.invalid, class: 'cm-invalid' }
]);

export default function CodeEditor(props) {
	const editorParent = useRef(null);
	const editor = useRef(null);
	// eslint-disable-next-line no-unused-vars
	const [_, setEditor] = useState(null);

	useEffect(() => {
		if (editor.current && !props.baseExampleSlug) return;
		if (editor.current) editor.current.destroy();

		const theme = EditorView.theme({}, { dark: true });

		const state = EditorState.create({
			doc: props.value,
			extensions: [
				lineNumbers(),
				highlightActiveLine(),
				highlightActiveLineGutter(),
				history(),
				indentUnit.of('\t'),
				closeBrackets(),
				bracketMatching(),
				autocompletion(),
				javascript({ jsx: true }),
				keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
				[theme, syntaxHighlighting(highlightStyle, { fallback: true })],
				EditorView.updateListener.of(update => {
					if (update.docChanged) {
						if (props.onInput) props.onInput({ value: update.state.doc.toString() });
					}
				})
			]
		});

		editor.current = new EditorView({
			state,
			parent: editorParent.current
		});

		setEditor(editor.current);
	}, [props.baseExampleSlug]);

	useEffect(() => (
		() => {
			editor.current.destroy();
			setEditor(null);
		}
	), []);

	return <div ref={editorParent} class={cx(style.codeEditor, props.class)} />;
}
