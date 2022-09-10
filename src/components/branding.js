import { h } from 'preact';
import config from '../config.json';

export default function Branding() {
	return (
		<section class="logos">
			{config.branding.map(asset => (
				<LogoVariation name={asset.name} alt={asset.alt} />
			))}
		</section>
	);
}

function LogoVariation({ name, alt }) {
	return (
		<div class="variation">
			<img
				src={`/assets/branding/${name}.svg`}
				alt={alt}
				loading="lazy"
				height="64"
			/>
			<div>
				<a href={`/assets/branding/${name}.svg`} native>
					SVG
				</a>
				<a href={`/assets/branding/${name}.png`} native>
					PNG
				</a>
			</div>
		</div>
	);
}
