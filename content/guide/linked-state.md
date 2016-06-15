---
name: Linked State
permalink: '/guide/linked-state'
---

# Linked State


One area Preact takes a little further than React is in optimizing state changes. A common pattern in ES2015 React code is to use Arrow functions within a `render()` method in order to update state in response to events.  Creating functions enclosed in a scope on every render is inefficient and forces the garbage collector to do more work than is necessary.

## The Nicer Manual Way

One solution is to declare bound component methods using ES7 class properties ([class instance fields](https://github.com/jeffmo/es-class-fields-and-static-properties)):

```js
class Foo extends Component {
	updateText = e => {
		this.setState({ text: e.target.value });
	};
	render({ }, { text }) {
		return <input value={text} onInput={this.updateText} />;
	}
}
```

While this achieves much better runtime performance, it's still a lot of unnecessary code to wire up state to UI.

> Another solution is to bind component methods _declaratively_, using ES7 decorators, such as [decko's](http://git.io/decko) `@bind`:


## Linked State to the Rescue

Fortunately, there is a solution in the form of preact's `linkState()`, available as a method on the `Component` class.

Calling `.linkState('text')` returns a handler function that, when passed an Event, uses its associated value to update the named property in your component's state.  Multiple calls to `linkState(name)` with the same `name` are cached, so there is essentially no performance penalty.

Here is the previous example rewritten using **Linked State**:

```js
class Foo extends Component {
	render({ }, { text }) {
		return <input value={text} onInput={this.linkState('text')} />;
	}
}
```

This is concise, easy to comprehend, and effective. It handles linking state from any input type. An optional second argument `'path'` can be used to explicitly provide a dot-notated keypath to the new state value for more custom bindings (such as binding to a third party component's value).
