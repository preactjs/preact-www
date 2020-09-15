import styles from './style.less';

// Add your company to this array. The logo should be placed
// in `src/assets/we-are-using/my-logo.svg`.
const companies = [
	{
		name: 'Groupon',
		href: 'https://groupon.com/',
		logo: 'groupon.svg'
	},
	{
		name: 'Uber',
		href: 'https://uber.com/',
		logo: 'uber.png'
	},
	{
		name: 'Tencent QQ',
		href: 'https://im.qq.com/',
		logo: 'qq.png'
	},
	{
		name: 'Sogou wenwen',
		href: 'https://wenwen.sogou.com/',
		logo: 'sogou.png'
	},
	{
		name: 'Housing.com',
		href: 'https://housing.com/',
		logo: 'housing.png'
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
		name: 'Treebo',
		href: 'https://www.treebo.com/',
		logo: 'treebo.svg'
	},
	{
		name: 'Smashing Magazine',
		href: 'https://next.smashingmagazine.com/',
		logo: 'smashingmagazine.png'
	},
	{
		name: 'The New York Times',
		href: 'https://nytimes.com/',
		logo: 'nytimes.png'
	},
	{
		name: 'Bustle',
		href: 'https://bustle.com/',
		logo: 'bustle.svg'
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
		name: 'Financial Times',
		href: 'https://ft.com/',
		logo: 'financial-times.svg'
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
		name: 'Transformers',
		href: 'https://www.transformersmovie.com/',
		logo: 'transformers.png'
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
		name: 'ski school courchevel',
		href: 'https://skiscool.com/',
		logo: 'skiscool.svg'
	},
	{
		name: 'The Coral Project',
		href: 'https://coralproject.net/',
		logo: 'thecoralproject.png'
	},
	{
		name: 'Omroep West',
		href: 'https://m.omroepwest.nl/',
		logo: 'omroepwest.svg'
	},
	{
		name: 'NAMSHI',
		href: 'https://en-ae.namshi.com/',
		logo: 'namshi.png'
	},
	{
		name: 'Instant Domain Search',
		href: 'https://instantdomainsearch.com/',
		logo: 'instantdomainsearch.svg'
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
		name: 'slowtec',
		href: 'https://slowtec.de/',
		logo: 'slowtec.svg'
	},
	{
		name: 'Sierra Nevada',
		href: 'https://sierranevada.co/',
		logo: 'sierranevada.svg'
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
		name: 'dailymotion',
		href: 'https://dailymotion.com/',
		logo: 'dailymotion.svg'
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
						<img src={`/assets/we-are-using/${c.logo}`} alt={c.name} />
					</a>
				</li>
			))}
		</ul>
	);
}
