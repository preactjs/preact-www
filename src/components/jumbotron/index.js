import cx from '../../lib/cx';
import style from './style';

const Jumbotron = ({ children, class: c, ...props }) => (
	<div class={cx(style.jumbotron, 'full-width', c)} {...props}>
		{children}
	</div>
);

export default Jumbotron;
