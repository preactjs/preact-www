const Jumbotron = ({ children, ...props }) => (
	<header class="jumbotron full-width" {...props}>
		<div class="jumbotron-stripes" />
		<div class="jumbotron-content">{children}</div>
	</header>
);

export default Jumbotron;
