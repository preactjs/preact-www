---
name: preact-testing
version: 1.0.0
description: Set up or improve tests for a Preact app using @testing-library/preact and Vitest, including hooks and async components. Use when asked to "add tests to my Preact app", "set up testing library", or "test this component".
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

# Testing Preact

Reference:

```sh
curl https://preactjs.com/guide/v10/preact-testing-library.md
```

## Setup

```sh
npm install --save-dev vitest jsdom @testing-library/preact @testing-library/jest-dom
```

```js
// vite.config.js
import preact from '@preact/preset-vite';

export default {
	plugins: [preact()],
	test: { environment: 'jsdom', setupFiles: ['./test/setup.js'], globals: true }
};
```

```js
// test/setup.js
import '@testing-library/jest-dom';
```

If the project aliases `react` to `preact/compat`, make sure the test config
inherits the same aliases — a test suite resolving real React tests a different
app than the one you ship.

## Writing tests

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';

test('increments', async () => {
	render(<Counter />);
	fireEvent.click(screen.getByRole('button', { name: /increment/i }));
	await waitFor(() => expect(screen.getByText('1')).toBeInTheDocument());
});
```

Two Preact-specific points:

- **Rendering is asynchronous.** Preact batches updates, so assert through
  `findBy*` or `waitFor`, not immediately after `fireEvent`.
- **Query by role and accessible name**, not by class or test id. It tests what
  the user can reach, and it catches accessibility regressions for free.

## Testing hooks

```jsx
import { renderHook, act } from '@testing-library/preact';

test('useCounter', () => {
	const { result } = renderHook(() => useCounter());
	act(() => result.current.increment());
	expect(result.current.count).toBe(1);
});
```

## What to test

Behaviour a user or a caller depends on: what renders for given props, what
happens on interaction, what happens when data fails to load. Do not write tests
that assert implementation details — internal state names, call counts on
private functions, or snapshot blobs nobody reads.

## Verify and report

```sh
npx vitest run
```

Report the tests you added, what each covers, and — honestly — which behaviours
are still untested.
