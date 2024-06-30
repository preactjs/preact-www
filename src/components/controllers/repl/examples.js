import simpleCounterExample from './examples/simple-counter.txt?url';
import counterWithHtmExample from './examples/counter-with-htm.txt?url';
import todoExample from './examples/todo-list.txt?url';
import todoExampleSignal from './examples/todo-list-signal.txt?url';
import repoListExample from './examples/github-repo-list.txt?url';
import contextExample from './examples/context.txt?url';
import spiralExample from './examples/spiral.txt?url';

export const EXAMPLES = [
	{
		name: 'Simple Counter',
		slug: 'counter',
		url: simpleCounterExample
	},
	{
		name: 'Todo List',
		slug: 'todo',
		url: todoExample
	},
	{
		name: 'Todo List (Signals)',
		slug: 'todo-list-signals',
		url: todoExampleSignal
	},
	{
		name: 'Github Repo List',
		slug: 'github-repo-list',
		url: repoListExample
	},
	{
		group: 'Advanced',
		items: [
			{
				name: 'Counter using HTM',
				slug: 'counter-htm',
				url: counterWithHtmExample
			},
			{
				name: 'Context',
				slug: 'context',
				url: contextExample
			}
		]
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
