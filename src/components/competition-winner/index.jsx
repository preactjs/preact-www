import style from './style.module.css';

/**
 * @param {Object} props
 * @param {boolean} props.vertical
 * @param {string} props.author
 * @param {string} props.authorhref
 * @param {string} props.submissionhref
 * @param {import('preact').ComponentChildren} props.children
 */
export function CompetitionWinner({
	vertical,
	author,
	authorhref,
	submissionhref,
	children
}) {
	return (
		<div class={style.winner} data-vertical={vertical != null ? '' : undefined}>
			<header>
				<span>
					Designed by{' '}
					<a href={authorhref} target="_blank" rel="noopener noreferrer">
						{author}
					</a>
				</span>
				<a href={submissionhref} target="_blank" rel="noopener noreferrer">
					View submission
				</a>
			</header>
			<div>{children}</div>
		</div>
	);
}

/**
 * @param {Object} props
 * @param {string} props.href
 * @param {string} props.src
 * @param {string} props.alt
 */
export function WinnerImage({ href, src, alt }) {
	return (
		<a href={href} target="_blank" rel="noopener noreferrer">
			<img src={src} alt={alt} loading="lazy" decoding="async" />
		</a>
	);
}
