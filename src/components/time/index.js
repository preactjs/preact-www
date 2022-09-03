import s from './time.less';

const formatter = new Intl.DateTimeFormat();

export function Time({ value }) {
	const date = new Date(value);
	return (
		<time class={s.time} dateTime={date}>
			{formatter.format(date)}
		</time>
	);
}
