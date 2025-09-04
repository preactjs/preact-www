import s from './time.module.css';

export function Time({ value }) {
  if (!value || typeof value !== 'string') {
    console.warn('Time component received invalid "value" prop:', value);
    return null;
  }

  const trimmedValue = value.trim();
  if (trimmedValue === '') {
    console.warn('"value" prop of Time component becomes empty after trim');
    return null;
  }

  const dateStr = trimmedValue + 'T00:00';
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    console.warn('Time component failed to parse date string:', dateStr);
    return null;
  }

  const day = date.toLocaleDateString 
    ? date.toLocaleDateString() 
    : date.toDateString();

  return (
    <time class={s.time} dateTime={date.toISOString()}>
      {day}
    </time>
  );
}
