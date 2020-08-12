import styles from './style.less';
import AMPSvg from './amp.svg';
import WebflowSvg from './webflow.svg';

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
				<a href="https://amp.dev/" title="AMP" target="_blank" rel="noopener noreferrer">
					<img src={AMPSvg} alt="AMP" width="150" height="150" style="height: 4rem; width: auto;" />
				</a>
			</li>
			<li class={styles.sponsorItem}>
				<a href="https://webflow.com/" title="webflow" target="_blank" rel="noopener noreferrer">
					<img src={WebflowSvg} alt="webflow" width="300" height="75" style="height:3rem; width: auto;" />
				</a>
			</li>
		</ul>
	);
}
