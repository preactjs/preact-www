import styles from './style.module.css';

// If you're adding your company to this list, add your logo to `src/assets/sponsor-icons.svg`
const sponsors = [
	{
		link: 'https://opencollective.com/2021-frameworks-fund',
		title: 'Chrome Frameworks Fund',
		width: '63',
		height: '63',
		id: 'chrome'
	},
	{
		link: 'https://tech.trivago.com/categories/open-source/',
		title: 'Trivago',
		width: '102',
		height: '32',
		id: 'trivago'
	},
	{
		link: 'https://deno.com',
		title: 'Deno',
		width: '330',
		height: '330',
		id: 'deno'
	},
	{
		link: 'https://songsterr.com',
		title: 'Songsterr',
		width: '26',
		height: '30',
		id: 'songsterr'
	},
	{
		link: 'https://tech.loveholidays.com',
		title: 'loveholidays',
		width: '160',
		height: '32',
		id: 'loveholidays'
	}
];

/**
 * Sponsors on the main page is a unique selling point of our
 * gold and platinum tier on opencollective. See:
 * https://opencollective.com/preact for an overview of
 * available tiers and their advantages.
 */
export default function Sponsors() {
	return (
		<ul class={styles.sponsorList}>
			{sponsors.map(sponsor => (
				<SponsorItem {...sponsor} />
			))}
		</ul>
	);
}

function SponsorItem({ link, title, width, height, id }) {
	return (
		<li class={styles.sponsorItem}>
			<a href={link} title={title} target="_blank" rel="noopener noreferrer nofollow sponsored">
				<svg aria-hidden viewBox={`0 0 ${width} ${height}`}>
					<use href={`/sponsor-icons.svg#${id}`} />
				</svg>
			</a>
		</li>
	);
}
