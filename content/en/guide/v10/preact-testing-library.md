---
name: Unit Testing with Preact Testing Library
description: 'Testing Preact applications made easy with testing-library'
---

# Testing with Preact Testing Library

The [Preact Testing Library](https://github.com/testing-library/preact-testing-library) is a lightweight wrapper around `preact/test-utils` to verify the rendered DOM. This helps in avoiding including internal implementation details in your tests, thus making them easier to maintain and more resilient against refactorings of your components.

Compared to [Enzyme](/guide/v10/unit-testing-with-enzyme) it requires DOM environment, making it a little bit harder to set up. That quickly pays of in the end though as test suites written with Preact Testing Library tend to be more resilient against internal changes of components.

Whereas with Enzyme you handle state updates yourself, you don't do that with testing library. Instead you fire events on the DOM directly and verify the resulting DOM render.

---

<div><toc></toc></div>

---

## Installation

Install the testing library Preact adapter via the following command:

```sh
npm install --save-dev @testing-library/preact
```

> Note: This library relies on a DOM environment being present. If you're using [Jest](https://github.com/facebook/jest) it's already included and enabled by default. If you're using another test runner like [mocha](https://github.com/mochajs/mocha) or [jasmine](https://github.com/jasmine/jasmine) you can add a DOM environment to node yourself by installing [jsdom](https://github.com/jsdom/jsdom).

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

For this component we want to verify that it displays the initial count and that clicking the button will increment the counter. Using the test runner of your choice like [Jest](https://github.com/facebook/jest) or [mocha](https://github.com/mochajs/mocha), we can write these two scenarios down:

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
      expect(screen.textContent).toMatch('Current value: 6');
    });
  });
});
```

You may have noticed the `waitFor()` call there. We need this to ensure that Preact had enough time to render to the DOM and flush all pending effects. Rendering is never synchronously and doing the assertion without the `waitFor()` would lead to unstable test results. Whenever you render or trigger a state update you basically need to wait for a condition to pass. This condition signals that the render is completed.

In the above example whe know that the update is completed, when the counter is incremented and the new value is rendered into the DOM.

## Using native CSS selectors

With a full DOM environment in place we are not limited to the matching functions supplied by `@testing-library/preact` and can use the full power of CSS selectors.

```jsx
const { container } = render(<MyLoginForm />);
const email = container.querySelector('input[type="email"]');

expect(email.placeholder).toEqual('hello@example.com');
```

## Use test IDs as much as possible

Whilst doing assertions based on text may work just fine for smaller apps, it will quickly become unmaintainable as soon as your app grows. Text may change as more languages are added to your app. This is illustrated in the next code snippet.

```jsx
function Foo({ onClick }) {
  return <button onClick={onClick}>click me</button>
}

// Test, all good so far
fireEvent.click(screen.getByText('click me'));
```

Sometime later the text of the button is changed to better reflect the new marketing strategy:

```jsx
function Foo({ onClick }) {
  return <button onClick={onClick}>click here</button>
}

// ERROR: There is no element with the text "click me" anymore :(
fireEvent.click(screen.getByText('click me'));
```

What's more is that the DOM hierarchy often changes dramatically during development, so don't rely on that too much either!

Instead a more robust approach is to rely on `data-testid`-attributes, making a node easy to target, even if its parents or its position in the DOM changes.

```jsx
function Foo({ onClick }) {
  return (
    <button onClick={onClick} data-testid="foo">
      click here
    </button>
  );
}

// Always works
fireEvent.click(screen.getByTestId('foo'));
```

In the above example, we've guarded our test case against any changes. We can change the text of our button, we can add additional DOM nodes and a lot more, without having to update our test to make it pass. That way you can cut down a lot of maintenance overhead.

## Debugging Tests

To debug the current DOM state you can use the `debug()` function to print out a prettified version of the DOM.

```jsx
const { debug } = render(<App />);

// Prints out a prettified version of the DOM
debug();
```

## Supplying custom Context Providers

Quite often you'll end up with a component which depends on shared context state. This can become tedious to set up for each test case, so we recommend creating a custom `render` function by wrapping the one from `@testing-library/preact`. Common Providers typically range from Routers, State, to sometimes Themes and other ones that are global for your specific app.

```jsx
// helpers.js
import { render as originalRender } from '@testing-library/preact';
import { createMemoryHistory } from 'history';
import { FooContext } from './foo';

const history = createMemoryHistory();

export function render(vnode) {
  return render(
    <FooContext.Provider value="foo">
      <Router history={memoryHistory}>
        {vnode}
      </Router>
    </FooContext.Provider>
  );
}

// Usage like usual. Look ma, no providers!
render(<MyComponent />)
```

## Testing Preact Hooks

The testing library project hosts another module that can be used to test [hooks](/guide/v10/hooks) in isolation. It's called [@testing-library/preact-hooks](https://github.com/testing-library/preact-hooks-testing-library). It needs to be installed separately.

```bash
npm install --save-dev @testing-library/preact-hooks
```

Imagine a `useCounter` hook (I know we love counters!), that we want to test:

```jsx
import { useState, useCallback } from 'preact/hooks';

const useCounter = () => {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount(c => c + 1), []);
  return { count, increment };
}
```

Like before we want to verify that we can increment our counter. It would be pretty useless otherwise!. So a corresponding test case will "render" the hook directly and make the return value accessible under the `result.current` property:

```jsx
import { renderHook, act } from '@testing-library/preact-hooks';
import useCounter from './useCounter';

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

For more information about `@testing-library/preact-hooks` check out https://github.com/testing-library/preact-hooks-testing-library .
