import s from './BlackLivesMatter.less';

export function BlackLivesMatterBanner() {
	return (
		<div class={s.root}>
			Support{' '}
			<a
				target="_blank"
				rel="noopener noreferrer"
				href="https://support.eji.org/give/153413/#!/donation/checkout"
				class={s.link}
			>
				#Black Lives Matter
			</a>{' '}
			and{' '}
			<a
				target="_blank"
				rel="noopener noreferrer"
				class={s.link}
				href="https://techcabal.com/2020/10/12/the-next-wave-vive-la-resistance/"
			>
				#EndSARS
			</a>
		</div>
	);
}
