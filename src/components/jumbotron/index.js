import cx from '../../lib/cx';
import style from './style';

const Jumbotron = ({ children, class: c, ...props }) => (
	<header class={cx(style.jumbotron, 'full-width', c)} {...props}>
		<div class={style.stripes} />
		<div class={style.content}>{children}</div>
	</header>
);

export default Jumbotron;
