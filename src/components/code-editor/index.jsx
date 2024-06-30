import { useRef, useEffect } from 'preact/hooks';
import { EditorView } from 'codemirror';
import { lineNumbers, keymap, highlightActiveLineGutter, highlightActiveLine } from '@codemirror/view';
import { EditorState, Transaction } from '@codemirror/state';
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

/**
 * @param {object} props
 * @param {string} props.value
 * @param {(value: string) => void} props.onInput
 * @param {string} props.slug
 * @param {string} [props.class]
 */
export default function CodeEditor(props) {
	const editorParent = useRef(null);
	/** @type {{ current: EditorView | null }} */
	const editor = useRef(null);

	const routeHasChanged = useRef(false);

	useEffect(() => {
		if (props.slug || !editor.current) routeHasChanged.current = true;
	}, [props.slug]);

	useEffect(() => {
		if (routeHasChanged.current === false) return;
		routeHasChanged.current = false;

		if (editor.current) {
			editor.current.dispatch({
				changes: { from: 0, to: editor.current.state.doc.length, insert: props.value }
			});
			return;
		}

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
					// Ignores changes from swapping out the editor code programmatically
					if (isViewUpdateFromUserInput(update)) {
						props.onInput(update.state.doc.toString());
					}
				})
			]
		});

		editor.current = new EditorView({
			state,
			parent: editorParent.current
		});
	}, [props.value]);

	useEffect(() => (
		() => {
			if (editor.current) editor.current.destroy();
		}
	), []);

	return <div ref={editorParent} class={cx(style.codeEditor, props.class)} />;
}

/** @param {import('@codemirror/view').ViewUpdate} viewUpdate */
function isViewUpdateFromUserInput(viewUpdate) {
	if (viewUpdate.docChanged) {
		for (const transaction of viewUpdate.transactions) {
			if (transaction.annotation(Transaction.userEvent)) return true;
		}
	}
	return false;
}
