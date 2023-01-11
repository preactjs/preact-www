import styles from './style.module.less';
import AMPSvg from './amp.svg';
import TrivagoSvg from './trivago.svg';

// TODO: Add
// - Airbnb
// - Chrome
// - Etsy
// - Scams.info
// - Deno
// - Songsterr

/**
 * Sponsors on the main page is a unique selling point of our
 * gold and platinum tier on opencollective. See:
 * https://opencollective.com/preact for an overview of
 * available tiers and their advantages.
 */
export default function Sponsors() {
	return (
		<ul class={styles.sponsorList}>
			<li class={styles.sponsorItem}>
				<a
					href="https://amp.dev/"
					title="AMP"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src={AMPSvg}
						alt="AMP"
						width="150"
						height="100"
						style="height: 3rem; width: auto;"
					/>
				</a>
			</li>
			<li class={styles.sponsorItem}>
				<a
					href="https://tech.trivago.com/opensource/"
					title="Trivago"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src={TrivagoSvg}
						alt="Trivago"
						width="102"
						height="32"
						style="height: 3rem; width: auto;"
					/>
				</a>
			</li>
		</ul>
	);
}
