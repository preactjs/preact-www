import s from './time.less';

export function Time({ value }) {
	const date = new Date(value + 'T00:00');
	const day = date.toLocaleDateString ? date.toLocaleDateString() : date.toDateString();
	return <time class={s.time} dateTime={date}>{day}</time>;
}
