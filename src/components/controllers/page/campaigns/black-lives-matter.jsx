import s from './BlackLivesMatter.less';

export function BlackLivesMatterBanner() {
	return (
		<div class={s.root}>
			<a
				target="_blank"
				rel="noopener noreferrer"
				href="https://blacklivesmatter.com/"
				class={s.link}
			>
				Black Lives Matter
			</a>
			. Support{' '}
			<a
				target="_blank"
				rel="noopener noreferrer"
				href="https://www.joincampaignzero.org/"
				class={s.link}
			>
				Campaign Zero
			</a>
			, the{' '}
			<a
				target="_blank"
				rel="noopener noreferrer"
				href="https://support.eji.org/give/153413/#!/donation/checkout"
				class={s.link}
			>
				Equal&nbsp;Justice&nbsp;Initiative
			</a>
			, and{' '}
			<a
				target="_blank"
				rel="noopener noreferrer"
				href="https://bailfunds.github.io/"
				class={s.link}
			>
				local bail funds
			</a>
			.
		</div>
	);
}
