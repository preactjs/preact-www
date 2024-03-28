import styles from './style.module.css';

// Add your company to this array. The logo should be placed
// in `src/assets/we-are-using/my-logo.svg`.
const companies = [
	{
		name: 'Babbel',
		href: 'https://www.babbel.com/',
		logo: 'babbel.svg'
	},
	{
		name: 'Groupon',
		href: 'https://groupon.com/',
		logo: 'groupon.svg'
	},
	{
		name: 'Tencent QQ',
		href: 'https://im.qq.com/',
		logo: 'qq.png'
	},
	{
		name: 'Etsy',
		href: 'https://etsy.com',
		logo: 'etsy.svg'
	},
	{
		name: 'Housing.com',
		href: 'https://housing.com/',
		logo: 'housing.png'
	},
	{
		name: 'Deno',
		href: 'https://deno.land/',
		logo: 'deno.svg'
	},
	{
		name: 'The New York Times',
		href: 'https://nytimes.com/',
		logo: 'nytimes.png'
	},
	{
		name: 'Lyft',
		href: 'https://lyft.com/',
		logo: 'lyft.svg'
	},
	{
		name: 'Pepsi',
		href: 'https://pepsi.com/',
		logo: 'pepsi.png'
	},
	{
		name: 'Huayang Live',
		href: 'https://huayang.qq.com/',
		logo: 'huayang.png'
	},
	{
		name: 'Uber',
		href: 'https://uber.com/',
		logo: 'uber.png'
	},
	{
		name: 'Treebo',
		href: 'https://www.treebo.com/',
		logo: 'treebo.svg'
	},
	{
		name: 'dailymotion',
		href: 'https://dailymotion.com/',
		logo: 'dailymotion.svg'
	},
	{
		name: 'Smashing Magazine',
		href: 'https://next.smashingmagazine.com/',
		logo: 'smashingmagazine.png'
	},
	{
		name: 'Bustle',
		href: 'https://bustle.com/',
		logo: 'bustle.svg'
	},
	{
		name: 'Financial Times',
		href: 'https://ft.com/',
		logo: 'financial-times.svg'
	},
	{
		name: 'IRCTC Ecatering',
		href: 'https://www.ecatering.irctc.co.in/',
		logo: 'irctc-ecatering.svg'
	},
	{
		name: 'HashiCorp',
		href: 'https://hashicorp.com/',
		logo: 'hashicorp.svg'
	},
	{
		name: 'Broadway.com',
		href: 'https://broadway.com/',
		logo: 'broadway.png'
	},
	{
		name: 'Sogou wenwen',
		href: 'https://wenwen.sogou.com/',
		logo: 'sogou.png'
	},
	{
		name: 'Algolia Instantsearch.js',
		href: 'https://community.algolia.com/instantsearch.js/v2/',
		logo: 'algolia.png'
	},
	{
		name: 'Songwhip',
		href: 'https://songwhip.com/',
		logo: 'songwhip.svg'
	},
	{
		name: 'Native Instruments',
		href: 'https://native-instruments.com/',
		logo: 'native-instruments.png'
	},
	{
		name: 'The DEV Community',
		href: 'https://dev.to/',
		logo: 'thepracticaldev.png'
	},
	{
		name: 'inSided',
		href: 'https://insided.com/',
		logo: 'insided.svg'
	},
	{
		name: "Domino's",
		href: 'https://www.dominos.com/',
		logo: 'dominos.svg'
	},
	{
		name: 'Neo4j',
		href: 'https://neo4j.com/',
		logo: 'neo4j.png'
	},
	{
		name: 'Westwing',
		href: 'https://westwing.de/',
		logo: 'westwing.png'
	},
	{
		name: 'Synacor',
		href: 'https://www.synacor.com/',
		logo: 'synacor.png'
	},
	{
		name: 'The Coral Project',
		href: 'https://coralproject.net/',
		logo: 'thecoralproject.png'
	},
	{
		name: 'NAMSHI',
		href: 'https://en-ae.namshi.com/',
		logo: 'namshi.png'
	},
	{
		name: 'WELL Messenger',
		href: 'https://wellapp.com/',
		logo: 'wellapp.png'
	},
	{
		name: 'andcards',
		href: 'https://andcards.com/',
		logo: 'andcards.png'
	},
	{
		name: 'Selly',
		href: 'https://selly.gg/',
		logo: 'selly.png'
	},
	{
		name: 'Tradeshift',
		href: 'https://tradeshift.com/',
		logo: 'tradeshift.png'
	},
	{
		name: 'Bakken & Baeck',
		href: 'https://bakkenbaeck.no/',
		logo: 'bakkenbaeck.svg'
	},
	{
		name: 'Leesa Sleep',
		href: 'https://leesa.com/',
		logo: 'leesa.svg'
	},
	{
		name: 'ANWB',
		href: 'https://anwb.nl/',
		logo: 'anwb.svg'
	},
	{
		name: 'Mopinion',
		href: 'https://mopinion.com/',
		logo: 'mopinion.svg'
	},
	{
		name: 'Narcity Media',
		href: 'https://www.narcity.com/',
		logo: 'narcitymedia.png'
	},
	{
		name: 'Lilium CMS',
		href: 'https://liliumcms.com/',
		logo: 'lmllogo.png'
	},
	{
		name: 'Rocket.Chat',
		href: 'https://rocket.chat/',
		logo: 'rocketchat.svg'
	},
	{
		name: 'BlueHive',
		href: 'https://www.bluehive.com/',
		logo: 'bluehive.svg'
	},
	{
		name: 'Bodybuilding.com',
		href: 'https://bodybuilding.com/',
		logo: 'bodybuildingcom.svg'
	},
	{
		name: 'Doxford Pet Software',
		href: 'https://doxford.net',
		logo: 'doxford.png'
	},
	{
		name: 'SmartRate',
		href: 'https://www.smartrate.se',
		logo: 'smartrate.png'
	},
	{
		name: 'Hugo Insurance',
		href: 'https://withhugo.com/',
		logo: 'hugo.svg'
	},
	{
		name: 'Datapedia',
		href: 'https://datapedia.info/',
		logo: 'datapedia.png'
	},
	{
		name: 'Glance',
		href: 'https://glance.com/',
		logo: 'glance.png'
	},
	{
		name: 'Snapp!',
		href: 'https://snapp.ir/',
		logo: 'snapp.png'
	},
	{
		name: 'Adyen',
		href: 'https://www.adyen.com/',
		logo: 'adyen.svg'
	},
	{
		name: 'SQL Frames',
		href: 'https://sqlframes.com/',
		logo: 'sqlframes.svg'
	},
	{
		name: 'Refract',
		href: 'https://refractbot.com/',
		logo: 'refract.svg'
	},
	{
		name: 'Zeplin',
		href: 'https://zeplin.io',
		logo: 'zeplin.svg'
	},
	{
		name: 'Loveholidays',
		href: 'https://loveholidays.com',
		logo: 'loveholidays.svg'
	}
];

// Grid of companies using Preact
export default function WeAreUsing() {
	return (
		<ul class={styles.root}>
			{companies.map(c => (
				<li key={c.name} class={styles.item}>
					<a
						href={c.href}
						title={c.name}
						target="_blank"
						rel="noopener noreferrer"
					>
						<img src={`/we-are-using/${c.logo}`} alt={c.name} />
					</a>
				</li>
			))}
		</ul>
	);
}
