---
name: Unit Testing with Enzyme
permalink: '/guide/unit-testing-with-enzyme'
description: 'Testing Preact applications made easy with enzyme'
---

# Unit Testing with Enzyme

Airbnb's [Enzyme](https://airbnb.io/enzyme/) is a library for writing
tests for React components. It supports different versions of React and
React-like libraries using "adapters". There is an adapter for Preact,
maintained by the Preact team.

Enzyme supports tests that run in a normal or headless browser using a tool
such as [Karma](http://karma-runner.github.io/latest/index.html) or tests that
run in Node using [jsdom](https://github.com/jsdom/jsdom) as a fake
implementation of browser APIs.

For a detailed introduction to using Enzyme and an API reference, see the
[Enzyme documentation](https://airbnb.io/enzyme/). The remainder of this guide
explains how to set Enzyme up with Preact, as well as ways in which Enzyme with
Preact differs from Enzyme with React.

---

<div><toc></toc></div>

---

## Installation

Install Enzyme and the Preact adapter using:

```sh
npm install --save-dev enzyme enzyme-adapter-preact-pure
```

## Configuration

In your test setup code, you'll need to configure Enzyme to use the Preact
adapter:

```js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-preact-pure';

configure({ adapter: new Adapter() });
```

For guidance on using Enzyme with different test runners, see the
[Guides](https://airbnb.io/enzyme/docs/guides.html) section of the Enzyme
documentation.

## Example

Suppose we have a simple `Counter` component which displays an initial value,
with a button to update it:

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

export default function Counter({ initialCount }) {
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

Using a test runner such as mocha or Jest, you can write a test to check that
it works as expected:

```jsx
import { expect } from 'chai';
import { h } from 'preact';
import { mount } from 'enzyme';

import Counter from '../src/Counter';

describe('Counter', () => {
  it('should display initial count', () => {
    const wrapper = mount(<Counter initialCount={5}/>);
    expect(wrapper.text()).to.include('Current value: 5');
  });

  it('should increment after "Increment" button is clicked', () => {
    const wrapper = mount(<Counter initialCount={5}/>);

    wrapper.find('button').simulate('click');

    expect(wrapper.text()).to.include('Current value: 6');
  });
});
```

For a runnable version of this project and other examples, see the
[examples/](https://github.com/preactjs/enzyme-adapter-preact-pure/blob/master/README.md#example-projects)
directory in the Preact adapter's repository.

## How Enzyme works

Enzyme uses the adapter library it has been configured with to render a
component and its children. The adapter then converts the output to a
standardized internal representation (a "React Standard Tree"). Enzyme then wraps
this with an object that has methods to query the output and trigger updates.
The wrapper object's API uses CSS-like
[selectors](https://airbnb.io/enzyme/docs/api/selector.html) to locate parts of
the output.

## Full, shallow and string rendering

Enzyme has three rendering "modes":

```jsx
import { mount, shallow, render } from 'enzyme';

// Render the full component tree:
const wrapper = mount(<MyComponent prop="value"/>);

// Render only `MyComponent`'s direct output (ie. "mock" child components
// to render only as placeholders):
const wrapper = shallow(<MyComponent prop="value"/>);

// Render the full component tree to an HTML string, and parse the result:
const wrapper = render(<MyComponent prop="value"/>);
```

 - The `mount` function renders the component and all of its descendants in the
   same way they would be rendered in the browser.

 - The `shallow` function renders only the DOM nodes that are directly output
   by the component. Any child components are replaced with placeholders that
   output just their children.

   The advantage of this mode is that you can write tests for components without
   depending on the details of child components and needing to construct all
   of their dependencies.

   The `shallow` rendering mode works differently internally with the Preact
   adapter compared to React. See the Differences section below for details.

 - The `render` function (not to be confused with Preact's `render` function!)
   renders a component to an HTML string. This is useful for testing the output
   of rendering on the server, or rendering a component without triggering any
   of its effects.

## Triggering state updates and effects with `act`

In the previous example, `.simulate('click')` was used to click on a button.

Enzyme knows that calls to `simulate` are likely to change the state of a
component or trigger effects, so it will apply any state updates or effects
immediately before `simulate` returns. Enzyme does the same when the component
is rendered initially using `mount` or `shallow` and when a component is updated
using `setProps`.

If however an event happens outside of an Enzyme method call, such as directly
calling an event handler (eg. the button's `onClick` prop), then Enzyme will not
be aware of the change. In this case, your test will need to trigger execution
of state updates and effects and then ask Enzyme to refresh its view of the
output.

- To execute state updates and effects synchronously, use the `act` function
  from `preact/test-utils` to wrap the code that triggers the updates
- To update Enzyme's view of rendered output use the wrapper's `.update()`
  method

For example, here is a different version of the test for incrementing the
counter, modified to call the button's `onClick` prop directly, instead of going
through the `simulate` method:

```js
import { act } from 'preact/test-utils';
```

```jsx
it('should increment after "Increment" button is clicked', () => {
    const wrapper = mount(<Counter initialCount={5}/>);
    const onClick = wrapper.find('button').props().onClick;

    act(() => {
      // Invoke the button's click handler, but this time directly, instead of
      // via an Enzyme API
      onClick();
    });
    // Refresh Enzyme's view of the output
    wrapper.update();

    expect(wrapper.text()).to.include('Current value: 6');
});
```

## Differences from Enzyme with React

The general intent is that tests written using Enzyme + React can be easily made
to work with Enzyme + Preact or vice-versa. This avoids the need to rewrite all
of your tests if you need to switch a component initially written for Preact
to work with React or vice-versa.

However there are some differences in behavior between this adapter and Enzyme's
React adapters to be aware of:

- The "shallow" rendering mode works differently under the hood. It is
  consistent with React in only rendering a component "one level deep" but,
  unlike React, it creates real DOM nodes. It also runs all of the normal
  lifecycle hooks and effects.
- The `simulate` method dispatches actual DOM events, whereas in the React
  adapters, `simulate` just calls the `on<EventName>` prop
- In Preact, state updates (eg. after a call to `setState`) are batched together
  and applied asynchronously. In React state updates can be applied immediately
  or batched depending on the context. To make writing tests easier, the
  Preact adapter flushes state updates and effects after initial renders and
  updates triggered via `setProps` or `simulate` calls on an adapter. When state updates or
  effects are triggered by other means, your test code may need to manually
  trigger flushing of effects and state updates using `act` from
  the `preact/test-utils` package.

For further details, see [the Preact adapter's
README](https://github.com/preactjs/enzyme-adapter-preact-pure#differences-compared-to-enzyme--react).
