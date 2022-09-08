---
name: Testing with Preact Testing Library
description: 'Testing Preact applications made easy with testing-library'
---

# Testing with Preact Testing Library

The [Preact Testing Library](https://github.com/testing-library/preact-testing-library) is a lightweight wrapper around `preact/test-utils`. It provides a set of query methods for accessing the rendered DOM in a way similar to how a user finds elements on a page. This approach allows you to write tests that do not rely on implementation details. Consequently, this makes tests easier to maintain and more resilient when the component being tested is refactored.

Unlike [Enzyme](/guide/v10/unit-testing-with-enzyme), Preact Testing Library must be called inside a DOM environment.

---

<div><toc></toc></div>

---

## Installation

Install the testing-library Preact adapter via the following command:

```sh
npm install --save-dev @testing-library/preact
```

> Note: This library relies on a DOM environment being present. If you're using [Jest](https://github.com/facebook/jest) it's already included and enabled by default. If you're using another test runner like [Mocha](https://github.com/mochajs/mocha) or [Jasmine](https://github.com/jasmine/jasmine) you can add a DOM environment to node by installing [jsdom](https://github.com/jsdom/jsdom).

## Usage

Suppose we have a `Counter` component which displays an initial value, with a button to update it:

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

export function Counter({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  const increment = () => setCount(count + 1);

  return (
    <div>
      Current value: {count}
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

We want to verify that our Counter displays the initial count and that clicking the button will increment it. Using the test runner of your choice, like [Jest](https://github.com/facebook/jest) or [Mocha](https://github.com/mochajs/mocha), we can write these two scenarios down:

```jsx
import { expect } from 'expect';
import { h } from 'preact';
import { render, fireEvent, screen } from '@testing-library/preact';

import Counter from '../src/Counter';

describe('Counter', () => {
  test('should display initial count', () => {
    const { container } = render(<Counter initialCount={5}/>);
    expect(container.textContent).toMatch('Current value: 5');
  });

  test('should increment after "Increment" button is clicked', async () => {
    render(<Counter initialCount={5}/>);

    fireEvent.click(screen.getByText('Increment'));
    await waitFor(() => {
      // .toBeInTheDocument() is an assertion that comes from jest-dom.
      // Otherwise you could use .toBeDefined().
      expect(screen.getByText("Current value: 6")).toBeInTheDocument();
    });
  });
});
```

You may have noticed the `waitFor()` call there. We need this to ensure that Preact had enough time to render to the DOM and flush all pending effects.

```jsx
test('should increment counter", async () => {
  render(<Counter initialCount={5}/>);

  fireEvent.click(screen.getByText('Increment'));
  // WRONG: Preact likely won't have finished rendering here
  expect(screen.getByText("Current value: 6")).toBeInTheDocument();
});
```

Under the hood, `waitFor` repeatedly calls the passed callback function until it doesn't throw an error anymore or a timeout runs out (default: 1000ms). In the above example we know that the update is completed, when the counter is incremented and the new value is rendered into the DOM.

We can also write tests in an async-first way by using the "findBy" version of the queries instead of "getBy". Async queries retry using `waitFor` under the hood, and return Promises, so you need to await them.

```jsx
test('should increment counter", async () => {
  render(<Counter initialCount={5}/>);

  fireEvent.click(screen.getByText('Increment'));

  await screen.findByText('Current value: 6'); // waits for changed element
  
  expect(screen.getByText("Current value: 6")).toBeInTheDocument(); // passes
});
```

## Finding Elements

With a full DOM environment in place, we can verify our DOM nodes directly. Commonly tests check for attributes being present like an input value or that an element appeared/disappeared. To do this, we need to be able to locate elements in the DOM.

### Using Content

The Testing Library philosophy is that the "the more your tests resemble the way your software is used, the more confidence they can give you".

The recommended way to interact with a page is by finding elements the way a user does, through the text content.

You can find a guide to picking the right query on the ['Which query should I use'](https://testing-library.com/docs/guide-which-query) page of the Testing Library docs. The simplest query is `getByText`, which looks at elements' `textContent`. There are also queries for label text, placeholder, title attributes, etc. The `getByRole` query is the most powerful in that it abstracts over the DOM and allows you to find elements in the accessibility tree, which is how your page is read by a screen reader. Combining [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques) and [`accessible name`](https://www.w3.org/TR/accname-1.1/#mapping_additional_nd_name) covers many common DOM traversals in a single query.

```jsx
import { render, fireEvent, screen } from '@testing-library/preact';

test('should be able to sign in', async () => {
  render(<MyLoginForm />);
  
  // Locate the input using textbox role and the accessible name,
  // which is stable no matter if you use a label element, aria-label, or
  // aria-labelledby relationship
  const field = await screen.findByRole('textbox', { name: 'Sign In' });
  
  // type in the field
  fireEvent.change(field, { value: 'user123' });
})
```

Sometimes using text content directly creates friction when the content changes a lot, or if you use an internationalization framework that translates text into different languages. You can work around this by treating text as data that you snapshot, making it easy to update but keeping the source of truth outside the test.

```jsx
test('should be able to sign in', async () => {
  render(<MyLoginForm />);
  
  // What if we render the app in another language, or change the text? Test fails.
  const field = await screen.findByRole('textbox', { name: 'Sign In' });
  fireEvent.change(field, { value: 'user123' });
})
```

Even if you don't use a translation framework, you can keep your strings in a separate file and use the same strategy as in the example below:

```jsx
test('should be able to sign in', async () => {
  render(<MyLoginForm />);

  // We can use our translation function directly in the test
  const label = translate('signinpage.label', 'en-US');
  // Snapshot the result so we know what's going on
  expect(label).toMatchInlineSnapshot(`Sign In`);

  const field = await screen.findByRole('textbox', { name: label });
  fireEvent.change(field, { value: 'user123' });
})
```

### Using Test IDs

Test IDs are data attributes added to DOM elements to help in cases where selecting content is ambiguous or unpredictable, or to decouple from implementation
details like DOM structure. They can be used when none of the other methods of finding elements make sense.

```jsx
function Foo({ onClick }) {
  return (
    <button onClick={onClick} data-testid="foo">
      click here
    </button>
  );
}

// Only works if the text stays the same
fireEvent.click(screen.getByText('click here'));

// Works if we change the text
fireEvent.click(screen.getByTestId('foo'));
```

## Debugging Tests

To debug the current DOM state you can use the `debug()` function to print out a prettified version of the DOM.

```jsx
const { debug } = render(<App />);

// Prints out a prettified version of the DOM
debug();
```

## Supplying custom Context Providers

Quite often you'll end up with a component which depends on shared context state. Common Providers typically range from Routers, State, to sometimes Themes and other ones that are global for your specific app. This can become tedious to set up for each test case repeatedly, so we recommend creating a custom `render` function by wrapping the one from `@testing-library/preact`.

```jsx
// helpers.js
import { render as originalRender } from '@testing-library/preact';
import { createMemoryHistory } from 'history';
import { FooContext } from './foo';

const history = createMemoryHistory();

export function render(vnode) {
  return originalRender(
    <FooContext.Provider value="foo">
      <Router history={history}>
        {vnode}
      </Router>
    </FooContext.Provider>
  );
}

// Usage like usual. Look ma, no providers!
render(<MyComponent />)
```

## Testing Preact Hooks

The testing-library project hosts another module that can be used to test [hooks](/guide/v10/hooks) in isolation. It's called [@testing-library/preact-hooks](https://github.com/testing-library/preact-hooks-testing-library) and it needs to be installed separately.

```bash
npm install --save-dev @testing-library/preact-hooks
```

Imagine that we want to re-use the counter functionality for multiple components (I know we love counters!) and have extracted it to a hook. And we now want to test it.

```jsx
import { useState, useCallback } from 'preact/hooks';

const useCounter = () => {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount(c => c + 1), []);
  return { count, increment };
}
```

Like before, the approach behind it is similar: We want to verify that we can increment our counter. So we need to somehow call our hook. This can be done with the `renderHook()`-function, which automatically creates a surrounding component internally. The function returns the current hook return value under `result.current`, which we can use to do our verifications:

```jsx
import { renderHook, act } from '@testing-library/preact-hooks';
import useCounter from './useCounter';

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter());

  // Initially the counter should be 0
  expect(result.current.count).toBe(0);

  // Let's update the counter by calling a hook callback
  act(() => {
    result.current.increment();
  });

  // Check that the hook return value reflects the new state.
  expect(result.current.count).toBe(1);
});
```

For more information about `@testing-library/preact-hooks` check out https://github.com/testing-library/preact-hooks-testing-library .
