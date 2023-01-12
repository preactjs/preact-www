import styles from './style.module.less';
import TrivagoSvg from './trivago.svg';
import DenoSvg from './deno.svg';
import ChromeSvg from './chrome.svg';
import SongsterrSvg from './songsterr.svg';
import ScamsInfo from './scamsinfo.png';

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
					href="https://opencollective.com/2021-frameworks-fund"
					title="Chrome Frameworks Fund"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src={ChromeSvg}
						alt="Chrome Frameworks Fund"
						width="63"
						height="63"
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
					href="https://scams.info"
					title="scams.info"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src={ScamsInfo}
						alt="Scams.info"
						width="240"
						height="240"
						style="height: 3rem; width: auto;"
					/>
				</a>
			</li>
			<li class={styles.sponsorItem}>
				<a
					href="https://deno.land"
					title="Deno"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src={DenoSvg}
						alt="Deno"
						width="813"
						height="813"
						style="height: 3rem; width: auto;"
					/>
				</a>
			</li>
			<li class={styles.sponsorItem}>
				<a
					href="https://songsterr.com"
					title="Songsterr"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src={SongsterrSvg}
						alt="Songsterr"
						width="26"
						height="30"
						style="height: 3rem; width: auto;"
					/>
				</a>
			</li>
		</ul>
	);
}
