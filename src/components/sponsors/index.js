import styles from './style.less';
import AMPSvg from './amp.svg';
import TrivagoSvg from './trivago.svg';
import WebflowSvg from './webflow.svg';
import SubstackSvg from './substack.svg';

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
			<li class={styles.sponsorItem}>
				<a
					href="https://substack.com/"
					title="Substack"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src={SubstackSvg}
						alt="Substack"
						width="192"
						height="33"
						style="height: 3rem; width: auto;"
					/>
				</a>
			</li>
			<li class={styles.sponsorItem}>
				<a
					href="https://webflow.com/"
					title="Webflow"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src={WebflowSvg}
						alt="Webflow"
						width="100"
						height="25"
						style="height: 3rem; width: auto;"
					/>
				</a>
			</li>
		</ul>
	);
}
