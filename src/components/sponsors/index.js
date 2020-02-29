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
				<a href="https://amp.dev/">
					<img src={AMPSvg} alt="AMP" style="height: 4rem;" />
				</a>
			</li>
			<li class={styles.sponsorItem}>
				<a href="https://webflow.com/" title="webflow">
					<img src={WebflowSvg} alt="webflow" style="height:3rem" />
				</a>
			</li>
		</ul>
	);
}
