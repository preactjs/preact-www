import { Fragment } from 'preact';

const RefsTutorial = () => (
	<Fragment>
		<h2>5. Refs</h2>
		<p>
			The DOM can do unique things that are a bit imperative, like calling
			"focus" on an input so our user doesn't have to explicitly click it. This
			can be done through for instance a dom-attribute when the input first
			renders (autofocus) but sometimes we want to do this at a given time or
			after a certain event.
		</p>
		<p>
			For this use-case Preact offers you refs, a ref is a mutable object that
			when changed does not trigger a rerender instead on the next render or in
			what closure you use it it will be the updated value. A ref looks like the
			following: "&#123; current: "your-value" &#125;" so how do we apply this
			to a dom-node?
			<br />
			Well Preact has a few special keywords that you can pass on a dom-node and
			"ref" is one of them.
		</p>
	</Fragment>
);

RefsTutorial.initialCode = ``;

RefsTutorial.finalCode = ``;

export default RefsTutorial;
