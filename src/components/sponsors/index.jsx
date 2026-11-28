import style from './style.module.css';

// If you're adding your company to this list, add your logo to `src/assets/sponsor-icons.svg`
const SPONSORS = [
	{
		link: 'https://opencollective.com/2021-frameworks-fund',
		title: 'Chrome Frameworks Fund',
		viewBox: '0 0 63 63',
		id: 'chrome'
	},
	{
		link: 'https://deno.com',
		title: 'Deno',
		viewBox: '0 0 330 330',
		id: 'deno'
	},
	{
		link: 'https://tech.loveholidays.com',
		title: 'loveholidays',
		viewBox: '0 0 160 32',
		id: 'loveholidays'
	},
	{
		link: 'https://songsterr.com',
		title: 'Songsterr',
		viewBox: '0 0 26 30',
		id: 'songsterr'
	},
	{
		link: 'https://tech.trivago.com/categories/open-source/',
		title: 'Trivago',
		viewBox: '0 0 102 32',
		id: 'trivago'
	},
	{
		link: 'https://lynxjs.org/',
		title: 'Lynx',
		viewBox: '0 0 27 28',
		id: 'lynx'
	}
];

/**
 * Sponsors on the main page is a unique selling point of our
 * gold and platinum tier on opencollective. See:
 * https://opencollective.com/preact for an overview of
 * available tiers and their advantages.
 */
/**
 * @param {{ heading: import('preact').ComponentChildren }} props The
 *   (translated) heading, see `Home`
 */
export default function Sponsors({ heading }) {
	return (
		<section class={style.sponsors}>
			<h2>{heading}</h2>
			<ul>
				{SPONSORS.map(({ link, title, viewBox, id }) => (
					<li key={id}>
						<a
							href={link}
							title={title}
							aria-label={title}
							target="_blank"
							rel="noopener noreferrer nofollow sponsored"
						>
							<svg aria-hidden="true" viewBox={viewBox}>
								<use href={`/sponsor-icons.svg#${id}`} />
							</svg>
						</a>
					</li>
				))}
			</ul>
		</section>
	);
}
