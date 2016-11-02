---
name: Types of Components
permalink: '/guide/types-of-components'
---

# Types of Components


There two types of components in Preact:

- Classical Components, with [lifecycle methods] and state
- Stateless Functional Components, which are functions that accept `props` and return [JSX].

Within these two types, there are also a few different ways to implement components.


## Example

Let's use an example: a simple `<Link>` component that creates an HTML `<a>` element:

```js
class Link extends Component {
	render(props, state) {
		return <a href={props.href}>{ props.children }</a>;
	}
}
```

We can instantiate/render this component as follows:

```xml
<Link href="http://example.com">Some Text</Link>
```


### Destructure Props & State

Since this is ES6 / ES2015, we can further simplify our `<Link>` component by mapping keys from `props` (the first argument to `render()`) to local variables using [destructuring](https://github.com/lukehoban/es6features#destructuring):

```js
class Link extends Component {
	render({ href, children }) {
		return <a {...{ href, children }} />;
	}
}
```

If we wanted to copy _all_ of the `props` passed to our `<Link>` component onto the `<a>` element, we can use the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator):

```js
class Link extends Component {
	render(props) {
		return <a {...props} />;
	}
}
```


### Stateless Functional Components

Lastly, we can see that this component does not hold state - we can render the component with the same props and get the same result each time.  When this is the case, it's often best to use a Stateless Functional Component. These are just functions that accept `props` as an argument, and return JSX.

```js
const Link = ({ children, ...props }) => (
	<a {...props}>{ children }</a>
);
```

> *ES2015 Note:* the above is an Arrow Function, and because we've used parens instead of braces for the function body, the value within the parens is automatically returned. You can read more about this [here](https://github.com/lukehoban/es6features#arrows).
