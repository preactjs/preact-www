---
name: Testing
permalink: '/guide/testing'
---

# Testing

In this part we'll go over a few different methods to testing preact components and hooks.

## Test-utils

This is the barebones method provided from the `preact/test-utils` package.

This package exports four methods:

- setupScratch: this method setups a minimal testing environment to render our components in.
- setupRerender: this method will return a function when called, when calling this method it alters a few
  preact internals so component updates won't be queued but executed instantly.
- teardown: resets the internals altered by setupRerender, removes all children and flushes all pending updates.
  This way we always have a clean testing-environment.
- act: this is a function that accepts a function as its one and only argument. Before executing the
  provided function it will alter some preact internals to make hook updates synchronous. After executing
  the callback it flushes all pending effects so that you can assert after act.

Let's look at an example:

```javascript
const { render } = require('preact');
const { useState } = require('preact/hooks');
const { act, setupRerender, setupScratch, teardown } = require('preact/test-utils');

describe('test-suite', () => {
    let rerender, scratch;

    beforeEach(() => {
        rerender = setupRerender();
        scratch = setupScratch();
    });

    afterEach(() => {
        teardown();
    })

    it('should render the textNode inside scratch', () => {
        render('Good', scratch);
        expect(scratch.innerHTML).to.eql('Good');
    });

    it('should render the textNode inside scratch', () => {
		const StateContainer = () => {
			const [count, setCount] = useState(0);
			return (
                <div>
				    <p>Count: {count}</p>
				    <button onClick={() => setCount(c => c + 1)} />
                </div>
            );
		}

		render(<StateContainer />, scratch);
		expect(scratch.textContent).to.include('Count: 0');
		act(() => {
			const button = scratch.querySelector('button');
			button.click();
		});
		expect(scratch.textContent).to.include('Count: 1');
    });
});
```
