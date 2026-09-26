// Counters
import simpleCounterExample from './counters/counter.txt?url';
import simpleCounterHooksExample from './counters/counter-hooks.txt?url';
import simpleCounterSignalsExample from './counters/counter-signals.txt?url';
import simpleCounterHTMExample from './counters/counter-htm.txt?url';

// Todo Lists
import todoExample from './todo-lists/todo-list.txt?url';
import todoSignalExample from './todo-lists/todo-list-signals.txt?url';

import repoListExample from './github-repo-list.txt?url';
import contextExample from './context.txt?url';
import spiralExample from './spiral.txt?url';

export const EXAMPLES = [
	{
		group: 'Simple Counters',
		items: [
			{
				name: 'Simple Counter',
				slug: 'counter',
				url: simpleCounterExample
			},
			{
				name: 'Simple Counter (Hooks)',
				slug: 'counter-hooks',
				url: simpleCounterHooksExample
			},
			{
				name: 'Simple Counter (Signals)',
				slug: 'counter-signals',
				url: simpleCounterSignalsExample
			},
			{
				name: 'Simple Counter (HTM)',
				slug: 'counter-htm',
				url: simpleCounterHTMExample
			}
		]
	},
	{
		group: 'Todo Lists',
		items: [
			{
				name: 'Todo List',
				slug: 'todo',
				url: todoExample
			},
			{
				name: 'Todo List (Signals)',
				slug: 'todo-signals',
				url: todoSignalExample
			}
		]
	},
	{
		name: 'Github Repo List',
		slug: 'github-repo-list',
		url: repoListExample
	},
	{
		name: 'Context',
		slug: 'context',
		url: contextExample
	},
	{
		group: 'Animation',
		items: [
			{
				name: 'Spiral',
				slug: 'spiral',
				url: spiralExample
			}
		]
	}
];

export function getExample(slug, list = EXAMPLES) {
	for (let i = 0; i < list.length; i++) {
		let item = list[i];
		if (item.group) {
			let found = getExample(slug, item.items);
			if (found) return found;
		} else if (item.slug.toLowerCase() === slug.toLowerCase()) {
			return item;
		}
	}
}

/**
 * @param {string} slug
 */
export async function fetchExample(slug) {
	const example = getExample(slug);
	if (!example) return;
	return await fetch(example.url).then(r => r.text());
}
