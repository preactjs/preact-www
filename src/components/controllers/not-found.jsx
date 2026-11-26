import { useContent } from '../../lib/use-content.js';
import { useLanguageContext } from '../../lib/i18n.jsx';
import ContentRegion from '../content-region/index.jsx';
import { Hexagon, HexBackground } from '../hex/index.jsx';
import Footer from '../footer/index.jsx';
import style from './not-found.module.css';

// "404" drawn on a 3x5 grid per digit
const DIGITS = [
	['#.#', '#.#', '###', '..#', '..#'],
	['###', '#.#', '#.#', '#.#', '###'],
	['#.#', '#.#', '###', '..#', '..#']
];
const CELL_X = 30;
const CELL_Y = 30;

export function NotFound() {
	// The copy comes from the (translated) `content/*/404.md`
	const { html } = useContent('/404');
	const { lang, translations, fallback } = useLanguageContext();
	const notFound = translations.i18n?.notFound || fallback.i18n.notFound;

	return (
		<div class={style.page}>
			<HexBackground />
			<div class={style.content}>
				<svg
					class={style.digits}
					viewBox="0 0 412 168"
					role="img"
					aria-label={notFound}
					lang={translations.i18n?.notFound ? lang : 'en'}
				>
					{DIGITS.flatMap((rows, digit) =>
						rows.flatMap((row, y) =>
							[...row].flatMap((cell, x) =>
								cell === '#' ? (
									<Hexagon
										key={`${digit}-${x}-${y}`}
										x={(digit * 5 + x) * CELL_X}
										y={y * CELL_Y}
										size={48}
										hexagonProps={{ fill: 'var(--accent-bg)' }}
									/>
								) : (
									[]
								)
							)
						)
					)}
				</svg>
				<ContentRegion current="/404" content={html} />
			</div>
			<Footer />
		</div>
	);
}
