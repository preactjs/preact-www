import { h } from 'preact';
import config from '../../config';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { useStore } from '../store-adapter';
import style from './style';
import { useLanguage } from '../../lib/i18n';

/*
 * To update this list, on https://github.com/preactjs/preact/graphs/contributors run:
 * $$('.contrib-person [data-hovercard-type="user"]:nth-of-type(2)').map(p=>p.textContent).filter(x => !/-bot$/.test(x)).join(' ')
 */
const CONTRIBS = 'developit marvinhagemeister andrewiggins JoviDeCroock cristianbote ForsakenHarmony prateekbh jviide AlexGalays rpetrich pmkroeker sventschui k1r0s 38elements NekR mochiya98 mkxml valotas AimWhy braddunbar KevinDoughty reznord kristoferbaxter gpoitch natevw tanhauhau jmrog Rafi993 egdbear mhmdanas harish2704 Download vkentta yaodingyd zouhir vutran billneff79 calebeby Almo7aya aralroca btm6084 btk5h gcraftyg guybedford hbroer jakearchibald johakr jridgewell LukasBombach lukeed mxstbr ngyikp JiLiZART kitten sangupta staeke yuqianma paranoidjk ouzhenkun Connormiha ivantm amilajack andybons 4cm4k1 bmeurer vaneenige impronunciable btd feross jackmoore scurker jeremy-coleman jdanford jmfirth matthewp kruczy namankheterpal mitranim siddharthkp niedzielski futantan teodragovic utkarshkukreti intrnl juicelink mseddon polemius rmacklin wojtczal asolove danielbayerlein jamesb3ll jrf0110 ansballard xorgy awaw00 armujahid afzalsayed96 aalises andrejsm antonk52 amelekhin talentedandrew hwclass just-boris bouk calvinf carlosqsilva sheepsteak Craga89 crisward cromefire dmail plusCubed fuzetsu DanielRuf darrenscerri itsdarrylnorris davidbailey00 davidje13 tsaiDavid crispgm ProLoser kwoon ovr dkumagai ericperez theZieger ezekielchentnik queckezz fahad19 FezVrasta xiel gerardo-rodriguez Gerrit0 hassanbazzi HenningM hiddedejong Hydrophobefireman UnwrittenFun aeosynth jxodwyer friebe arqex jpodwys JonathanBristow jsoref jpsc KrofDrakula chinchang le0nik leonid-bauxy levrik Litee lfamorim luisvinicius167 c2h5oh mnkhouri markselby9 KnisterPeter bz2 defx i-like-robots mhink max-voronov michael-klein MicheleBertoli Pomax mikekasprzak mike-north gnarf MylesBorins nathancahill SolarLiner nhunzaker toraora wyze nickytonline ngasull nojvek OrKoN dharFr pl12133 peterswallow piamancini rococtz ReadmeCritic remcohaszing digitalica robbiewxyz slaskis reyronald rubenmoya RyanCavanaugh rschristian sgrowe Brawaru seveves shidhincr stephenmathieson styfle continuata zubhav SomethingSexy timgates42 timurista tbekolay tusharmath Vincent-Carrier jokester wayou wuweiweiwu choumx xdamman dzhykaiev leader22 lowaa boiawang carlhopf typoerr decadef20 afeiship goodrone hrldcpr ivanjonas jessicabyrne jmarsh999 reviewher slmgc sskoopa steelbrain tatchi thesmartwon viko16 windyGex perseveringman MrErHu wildlyinaccurate mikestead squidfunk dbushong ftes johnhaitas w4zZz4p lakshyaranganath loklaan mbrukman clomie kaisermann zridouh-chwy AlexanderOtavka DrewML aweary chiragmongia conorhastings developerdizzle probablyup fdaciuk silverlight513 pekala cedmax kozak freeman conceptualitis linde12 MobiusHorizons icewind1991 lsroman shiftyp sjchmiela IrregularShed Stuk ReDrUm tomascasas rokoroku chrishinrichs evandeininger lili21 ustccjw david-nordvall hikouki adriantoine cmaster11 sync ashsearle bnolan Davetherave2010 webyom hiteshjoshi lionralfs LukvonStrom nhubaotruong nicolasparada olpeh pshev pspeter3 robinvdvleuten samccone neonwarp vitormalencar lcxfs1991 joaolucasl rosskhanas huruji pazguille addyosmani helloworld-hellohyeon tao1991123 blenderskool ArsProgramma David-zzg sapegin dandv Marabyte shaedrich rykdesjardins whitebackdoor alexkrolick Otto-AA alex-page BartWaardenburg guaiamum belohlavek Duske montogeek Jinex2012 joeldenning Khaledgarbaya mozmorris pradeepb6 yhau1989 darvishzadeh Vrq kuldeepkeshwar mikaturk malcolmyu 0xflotus akush a-xin adem ajainvivek aganglada thatoddmailbox Alexandrshy allison-strandberg jt3k aotarola newyork-anthonyng antoniogarcia78 arthurpf avindra azizhk hartshorne benhalpern bernardop johnstonbl01 caiogondim charlier cgarg coliff Perni1984 PandaWhisperer chung-leong SuperC03 craigdanj cristiand391 d2s sgtpep bruderstein davi-mbatista Dorumin erasmo-marin eschaefer erickpatrick insekticid FND FRosner Remeic carusog gledi Go7hic guido4000 jackofseattle janmarkuslanger jeanbauer jescalan malchata bingocaller jesseskinner zeroidentidad nmussy Kanaye JoshuaDraxten juanmaia nerdbeere kaycebasques SouzaTeles LukasDrgon Macavirus manpreetbhasin marzepani flosse molily ascorbic ShalokShalom maxrugen mehmetkose MicahZoltu minevala mhartington Mohamed3on nikolaystrikhar NiciusB nuwanc lexey111 oscarsaraza phanshiwen reneviering RickyHan ritz078 pomber rubencodes msynk skvale samsel doubleswirve leggsimon Sexual sohaibalam67 sbesh91 thysultan sylvainpolletvillard tomasswood timdorr tobiasweibel tony areai51 vivekAppscrip vandrijevik walmik wreiske wilsonpage pastelmind kolbma duzliang nuel-ikwuoma enure guillaumervls jakub-g katopz zikeng mopduan rumesh simonjoom thib-rdr yahtnif bspaulding ffriedl89 filipbech tyom ooade moiseyev molefrog z-vr bmitchinson DenysVuika haensl jordic jmaicher kolodziejczakM mjanssen matteobruni BurntCaramel svapreddy sobstel SafdarJamal timarney redstrike code2k therealparmesh rkostrzewski jgierer12 psabharwal123 jonathantneal StephanBijzitter harshitkumar31 thangngoc89 SaraVieira knight-bubble jamesgeorge007 framp VanTanev lwakefield TheElegantDev AEnterprise andreek BenoitZugmeyer briangonzalez cj nahoc-petal danalloway DemianD dkundel douggr gaetanmaisse harshzalavadiya iiegor jesstelford wulfmann imagentleman aMollusk Kokanm krawaller iepsen maoberlehner matthewlynch milesthedisch minhchu NicolaiSchmid p-adams filoozom ralphsmith80 KadoBOT robdodson RoiEf schalkventer 1000ch fivetanley diagramatics xtuc vivlim wilcoverhoeven WillsB3 anantoghosh dignifiedquire ethanroday matthewharwood razdvapoka stefanpl hesselbom xyyjk d3x7r0 wnayes Akiyamka heithemmoumni NJalal7 AlexMunoz danieldiekmeier sean0x42 yu-kgr bartlomiejzuber fisker sasurau4 dstaley gavinsharp MaxDesiatov VikingTristan Turbo87 seroy zgoda EmilTholin AjayPoshak dbetteridge jstans'.split(
	' '
);

/**
 * Display a random contributor of the list above.
 * @param {any[]} deps
 */
export function useContributors(deps) {
	const [value, setValue] = useState(CONTRIBS[new Date().getMonth()]);
	useEffect(() => {
		setValue(CONTRIBS[(Math.random() * (CONTRIBS.length - 1)) | 0]);
	}, deps);
	return value;
}

export default function Footer() {
	const { url } = useStore(['url']).state;
	const contrib = useContributors([url]);
	const [lang, setLang] = useLanguage();

	const onSelect = useCallback(e => setLang(e.target.value), [setLang]);

	return (
		<footer class={style.footer}>
			<div class={style.inner}>
				<p>
					<label class={style.lang}>
						Language:{' '}
						<select value={lang || 'en'} onInput={onSelect}>
							{Object.keys(config.languages).map(id => (
								<option selected={id == lang} value={id}>
									{config.languages[id]}
								</option>
							))}
						</select>
						{lang && <code>?lang={lang}</code>}
					</label>
				</p>
				<p style="line-height: 1">
					Built by a bunch of{' '}
					<a
						href="https://github.com/preactjs/preact/graphs/contributors"
						target="_blank"
						rel="noopener noreferrer"
					>
						lovely people
					</a>{' '}
					like{' '}
					<a
						href={'https://github.com/' + contrib}
						target="_blank"
						rel="noopener noreferrer"
					>
						@{contrib}
					</a>
					.
				</p>
			</div>
		</footer>
	);
}
