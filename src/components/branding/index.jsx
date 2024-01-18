import style from './style.module.css';
import config from '../../config.json';

export default function Branding() {
	return (
		<section class={style.logos}>
			{config.branding.map(asset => (
				<LogoVariation name={asset.name} alt={asset.alt} />
			))}
		</section>
	);
}

function LogoVariation({ name, alt }) {
	return (
		<div class={style.variation}>
			<img
				src={`/branding/${name}.svg`}
				alt={alt}
				loading="lazy"
				height="64"
			/>
			<div class={style.links}>
				<a
					href={`/branding/${name}.svg`}
					target="_blank"
					rel="noreferrer"
				>
					SVG
				</a>
				<a
					href={`/branding/${name}.png`}
					target="_blank"
					rel="noreferrer"
				>
					PNG
				</a>
			</div>
		</div>
	);
}
