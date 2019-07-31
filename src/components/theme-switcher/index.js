import { h } from 'preact';
import { useStoredValue } from '../../lib/localstorage';
import { useEffect } from 'preact/hooks';
import style from './style.less';

const THEMES = ['light', 'dark', 'auto'];

export default function ThemeSwitcher() {
	const [theme, setTheme] = useStoredValue('theme', 'auto');

	function onClick() {
		// Cycle through available themes
		switch (theme) {
			case 'light':
				return setTheme('dark');
			case 'dark':
				return setTheme('auto');
			case 'auto':
				return setTheme('light');
			default:
				return;
		}
	}

	useEffect(() => {
		const html = document.documentElement;
		if (html && html.classList) {
			THEMES.forEach(n =>
				n === theme ? html.classList.add(n) : html.classList.remove(n)
			);
		}
	}, [theme]);

	return (
		<button onClick={onClick} class={style.root} title="Change color scheme">
			<img src={`/assets/theme-${theme}.svg`} alt="" />
		</button>
	);
}
