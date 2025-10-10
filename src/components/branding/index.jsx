import style from './style.module.css';

const LOGOS = [
	{
		name: 'logo-text',
		alt: 'Full Logo'
	},
	{
		name: 'logo-text-inverted',
		alt: 'Full Logo with Inverted Colors'
	},
	{
		name: 'symbol',
		alt: 'Preact Symbol'
	},
	{
		name: 'symbol-inverted',
		alt: 'Preact Symbol with Inverted Colors'
	}
];

export default function Branding() {
	return (
		<div class={style.logos}>
			{LOGOS.map(asset => (
				<LogoVariation name={asset.name} alt={asset.alt} />
			))}
		</div>
	);
}

function LogoVariation({ name, alt }) {
	return (
		<div class={style.variation}>
			<img src={`/branding/${name}.svg`} alt={alt} loading="lazy" height="64" />
			<div class={style.links}>
				<a href={`/branding/${name}.svg`} target="_blank" rel="noreferrer">
					SVG
				</a>
				<a href={`/branding/${name}.png`} target="_blank" rel="noreferrer">
					PNG
				</a>
			</div>
		</div>
	);
}
