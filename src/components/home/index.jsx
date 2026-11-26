import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { useTitle, useDescription } from '../../lib/use-content.js';
import { useLanguageContext } from '../../lib/i18n.jsx';
import {
	prefersReducedMotion,
	useReducedMotion
} from '../../lib/use-reduced-motion.js';
import { Hexagon, HexBackground, HexIcon } from '../hex/index.jsx';
import ReleaseLink from '../header/gh-version.jsx';
import Footer from '../footer/index.jsx';
import Sponsors from '../sponsors/index.jsx';
import cx from '../../lib/cx.js';
import { CODE_HTML } from './code-snippet.js';
import { useScrollableRegions } from '../../lib/use-scrollable-regions.js';
import style from './style.module.css';

const GETTING_STARTED = '/guide/v11/getting-started';

/** @typedef {keyof typeof import('../../locales/en.json')['home']} HomeKey */

/**
 * The home page copy, from the locales' `home` strings. Strings a locale
 * doesn't translate (yet) fall back to English, marked with `lang="en"`.
 */
function useHomeCopy() {
	const { translations, fallback } = useLanguageContext();
	/** @param {HomeKey} key */
	const own = (key) => /** @type {any} */ (translations)?.home?.[key];
	/** @param {HomeKey} key */
	const text = (key) => own(key) || fallback.home[key];
	/**
	 * @param {HomeKey} key
	 * @param {Record<string, import('preact').ComponentChildren>} [values]
	 *   Elements for `{name}` placeholders, like links
	 */
	const t = (key, values) => {
		const parts = values
			? text(key)
					.split(/\{(\w+)\}/)
					.map((part, i) => (i % 2 ? values[part] : part))
			: text(key);
		return own(key) ? parts : <span lang="en">{parts}</span>;
	};
	// For attributes, which can't be marked with a language
	t.text = text;
	/** @param {HomeKey} key */
	t.lang = (key) => (own(key) ? undefined : 'en');
	return t;
}

export default function Home() {
	const t = useHomeCopy();
	useTitle('Preact');
	useDescription(t.text('description'));
	const [playground, setPlayground] = useState(false);
	// Rendered twice (wide & narrow layouts), so a fresh element each time
	const sponsorsHeading = () =>
		t('sponsoredBy', {
			link: (
				<a href="https://opencollective.com/preact">{t('sponsoredByLink')}</a>
			)
		});

	return (
		<div class={style.page}>
			<div class={style.content}>
				<HexBackground />
				<Hero />
				<div class={style.sections}>
					<div class={style.grid}>
						<Card
							title={t('standardsTitle')}
							icon={<HexIcon src="/home/standards.svg" />}
							text={t('standardsText')}
						>
							<a href={GETTING_STARTED} class="btn primary">
								{t('exploreDocs')}
							</a>
						</Card>
						<Card
							title={t('stableTitle')}
							icon={<HexIcon src="/home/stable.svg" />}
							text={t('stableText')}
						>
							<ReleaseTimeline />
						</Card>
					</div>

					<div class={style.syntax}>
						<h2>{t('syntaxTitle')}</h2>
						<CodeSnippet />
					</div>

					<div class={style.grid}>
						<Card
							title={t('toolsTitle')}
							icon={<HexIcon src="/home/first-party.svg" />}
							text={t('toolsText', {
								signals: (
									<a href="/guide/v11/signals">{t('toolsSignalsLink')}</a>
								),
								hooks: <a href="/guide/v11/hooks">{t('toolsHooksLink')}</a>
							})}
						>
							<ToolsDiagram />
						</Card>
						<Card
							title={t('ecosystemTitle')}
							icon={<HexIcon src="/home/ecosystem.svg" />}
							text={t('ecosystemText', {
								compat: (
									<a href={`${GETTING_STARTED}#aliasing-react-to-preact`}>
										preact/compat
									</a>
								)
							})}
						>
							<Ecosystem />
						</Card>
					</div>

					<div class={style.sponsorsWide}>
						<Sponsors heading={sponsorsHeading()} />
					</div>

					<Card
						title={t('buildTitle')}
						icon={<HexIcon src="/home/chip.svg" />}
						iconAction={{
							label: t.text('showPlayground'),
							lang: t.lang('showPlayground'),
							// A disclosure: shows & hides the playground card below
							onClick: () => setPlayground((open) => !open),
							expanded: playground,
							controls: 'hex-playground'
						}}
						text={
							<div class={style.split}>
								<div>
									<p>
										{t('buildNoBuild', {
											link: (
												<a href="/guide/v11/no-build-workflows">
													{t('buildNoBuildLink')}
												</a>
											)
										})}
									</p>
									<p>{t('buildEmbed')}</p>
								</div>
								<div class={style.splitAside}>
									<BuildingBlocks />
								</div>
							</div>
						}
					/>

					{playground && (
						<div id="hex-playground" class={style.playgroundAppear}>
							<Card
								title={t('playgroundTitle')}
								icon={<HexIcon src="/home/playground.svg" />}
								text={t('playgroundText')}
							>
								<Playground />
							</Card>
						</div>
					)}
				</div>
				<div class={style.sponsorsNarrow}>
					<Sponsors heading={sponsorsHeading()} />
				</div>
				<Flavour />
			</div>
			<Footer />
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                                    Hero                                    */
/* -------------------------------------------------------------------------- */

function Hero() {
	const t = useHomeCopy();
	const [rotation, setRotation] = useState(0);
	const [suffix, setSuffix] = useState('a');
	const [veryFast, setVeryFast] = useState(false);

	const tagline = t.text('tagline');

	const onLogoClick = () => {
		setRotation((r) => r + 60);
		if (!veryFast) {
			setSuffix((s) => s + 'a');
			if (suffix.length > 8) {
				setVeryFast(true);
				setSuffix('a');
			}
		}
	};

	return (
		<section class={style.hero}>
			<div class={style.heroBar}>
				<ReleaseLink class={style.heroVersion} />
				<a href="/blog/preact-11" class={style.heroNews}>
					<i aria-hidden="true" />
					{t('news')} &gt;
				</a>
			</div>
			<button
				type="button"
				class={style.heroLogo}
				onClick={onLogoClick}
				aria-label={t.text('rotateLogo')}
				// An untranslated (English) name is marked as such, like other copy
				lang={t.lang('rotateLogo')}
			>
				<img
					src="/branding/symbol.svg"
					alt={t.text('logoAlt')}
					lang={t.lang('logoAlt')}
					width="256"
					height="256"
					style={{ transform: `rotate(${rotation}deg)` }}
				/>
			</button>
			<div class={style.heroText}>
				<Typewriter />
				<h1 class={style.heroTitle} lang={t.lang('title')}>
					{t
						.text('title')
						.split('\n')
						.map((line, i) => [
							i > 0 && <br />,
							line
								.split(' ')
								.map((word, j) => [j > 0 && ' ', <span>{word}</span>])
						])}
				</h1>
				<p class={style.heroTagline}>
					<span lang={t.lang('tagline')}>
						{/* Easter egg: clicking the logo makes the English copy Faaaster */}
						{tagline.startsWith('Fast') ? (
							<>
								{veryFast ? (
									<>
										<b>Very</b>&nbsp;f
									</>
								) : (
									'F'
								)}
								{suffix}
								{tagline.slice(2)}
							</>
						) : (
							tagline
						)}
					</span>
					<br /> {t('taglineEcosystem')}
				</p>
				<div class={style.heroButtons}>
					<a href={GETTING_STARTED} class="btn primary">
						{t('getStarted')}
					</a>
					<a href="/tutorial" class="btn secondary">
						{t('learnMore')}
					</a>
				</div>
			</div>
		</section>
	);
}

const ADJECTIVES = [
	'Petite',
	'Performant',
	'Purple',
	'Painless',
	'Plastic-free',
	'Pocket-sized',
	'Potato powered',
	'Proudly tiny'
].map((word) => word + 'ㅤ');
// Monospaced, so the most characters is the widest
const LONGEST_ADJECTIVE = ADJECTIVES.reduce((a, b) =>
	b.length > a.length ? b : a
);

function Typewriter() {
	const t = useHomeCopy();
	const reducedMotion = useReducedMotion();
	// It cycles indefinitely, so it can be paused (WCAG 2.2.2)
	const [paused, setPaused] = useState(false);
	const [index, setIndex] = useState(0);
	const [length, setLength] = useState(1);
	const word = ADJECTIVES[index];
	const still = reducedMotion || paused;

	useEffect(() => {
		// Without motion, settle on the first word instead of cycling forever
		if (reducedMotion) {
			setIndex(0);
			setLength(ADJECTIVES[0].length);
			return;
		}
		// Paused: show the whole current word
		if (paused) {
			setLength(word.length);
			return;
		}
		const done = length === word.length;
		const timer = setTimeout(
			() => {
				if (done) {
					setIndex((i) => (i + 1) % ADJECTIVES.length);
					setLength(1);
				} else {
					setLength((l) => l + 1);
				}
			},
			done ? 2200 : length === 1 ? 1000 : 80
		);
		return () => clearTimeout(timer);
	}, [length, word.length, reducedMotion, paused]);

	const cursor = !still && length > 1 && length !== word.length ? '█' : '';

	return (
		<div class={style.typewriter}>
			{!reducedMotion && (
				<button
					type="button"
					class={style.typewriterPause}
					aria-pressed={paused}
					aria-label={t.text('pauseAnimation')}
					lang={t.lang('pauseAnimation')}
					onClick={() => setPaused((p) => !p)}
				>
					<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
						{paused ? (
							<path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
						) : (
							<path
								d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z"
								fill="currentColor"
							/>
						)}
					</svg>
				</button>
			)}
			{/* A fixed width (that of the longest phrase), so a centred line
			    doesn't move the pause button as the text changes */}
			<span class={style.typewriterText} aria-hidden="true">
				<span class={style.typewriterSizer}>
					<span class={style.prompt}>&gt;</span>
					{LONGEST_ADJECTIVE}React
				</span>
				<span>
					<span class={style.prompt}>&gt;</span>
					<span>{word.slice(0, length)}</span>
					<span class={style.typewriterReact}>{cursor}React</span>
				</span>
			</span>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                                    Cards                                   */
/* -------------------------------------------------------------------------- */

/**
 * @param {object} props
 * @param {string} props.title
 * @param {import('preact').ComponentChildren} props.icon
 * @param {import('preact').ComponentChildren} props.text
 * @param {import('preact').ComponentChildren} [props.children]
 * @param {{ label: string, lang?: string, onClick: () => void, expanded?: boolean, controls?: string }} [props.iconAction] Makes the
 *   icon a button. It's kept outside of the heading so it isn't read as part of it.
 */
function Card({ title, icon, text, children, iconAction }) {
	return (
		<div class={style.card}>
			<div class={style.cardHeader}>
				{iconAction ? (
					<button
						type="button"
						class={style.chip}
						aria-label={iconAction.label}
						lang={iconAction.lang}
						aria-expanded={iconAction.expanded}
						aria-controls={
							iconAction.expanded ? iconAction.controls : undefined
						}
						onClick={iconAction.onClick}
					>
						{icon}
					</button>
				) : (
					icon
				)}
				<h2 class={style.cardTitle}>{title}</h2>
			</div>
			<div class={style.cardText}>{text}</div>
			{children && <div class={style.cardBody}>{children}</div>}
		</div>
	);
}

function CodeSnippet() {
	const ref = useRef(null);
	useScrollableRegions(ref, 'pre', CODE_HTML);
	return (
		<pre ref={ref} class={cx(style.code, 'language-jsx')}>
			<code
				class="language-jsx"
				dangerouslySetInnerHTML={{ __html: CODE_HTML }}
			/>
		</pre>
	);
}

/* -------------------------------------------------------------------------- */
/*                            Visual card contents                            */
/* -------------------------------------------------------------------------- */

/**
 * Flips to `true` (after a short delay) once the element scrolls into view.
 *
 * @param {import('preact').RefObject<Element>} ref
 * @param {number} [threshold]
 */
function useInView(ref, threshold = 0.25) {
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const el = ref.current;
		/** @type {ReturnType<typeof setTimeout> | undefined} */
		let timer;
		if (!el || typeof IntersectionObserver === 'undefined') {
			timer = setTimeout(() => setInView(true), 500);
			return () => clearTimeout(timer);
		}
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					observer.disconnect();
					timer = setTimeout(() => setInView(true), 500);
				}
			},
			{ threshold }
		);
		observer.observe(el);
		return () => {
			observer.disconnect();
			clearTimeout(timer);
		};
	}, [ref, threshold]);

	return inView;
}

/**
 * Entrance animations for the card diagrams. The prerendered HTML (and so
 * no-JS & reduced-motion visitors) shows a diagram's final state; only when
 * it starts out below the fold do we reset it, so it can animate in once
 * scrolled to.
 *
 * @param {import('preact').RefObject<Element>} ref
 * @param {number} [threshold]
 * @returns {boolean} Whether the diagram is waiting, off-screen, in its start state
 */
function useScrollReveal(ref, threshold) {
	const [waiting, setWaiting] = useState(false);
	const inView = useInView(ref, threshold);
	const reducedMotion = useReducedMotion();

	useEffect(() => {
		const el = ref.current;
		if (!el || prefersReducedMotion()) return;
		const rect = el.getBoundingClientRect();
		if (rect.top >= innerHeight || rect.bottom <= 0) setWaiting(true);
	}, []);

	useEffect(() => {
		if (inView || reducedMotion) setWaiting(false);
	}, [inView, reducedMotion]);

	return waiting;
}

const RELEASES = [
	{ version: 'v1', year: 2015 },
	{ version: 'v4', year: 2016 },
	{ version: 'v8', year: 2017 },
	{ version: 'v10', year: 2019 },
	{ version: 'v11', year: 2026 }
];
const TIMELINE_START = 2015;
const TIMELINE_X1 = 20;
const TIMELINE_X2 = 328;
const TIMELINE_Y = 40;
const RELEASE_HEX = 42;
const RELEASE_HEX_WIDTH = (RELEASE_HEX / 2) * Math.sqrt(3);
const yearToX = (year) => TIMELINE_X1 + ((year - TIMELINE_START) / 12) * 308;

function ReleaseTimeline() {
	const t = useHomeCopy();
	const ref = useRef(null);
	const frame = useRef(/** @type {number | null} */ (null));
	const [progress, setProgress] = useState(1);
	const waiting = useScrollReveal(ref);
	const wasWaiting = useRef(false);
	const reducedMotion = useReducedMotion();

	const play = useCallback(() => {
		if (frame.current !== null) cancelAnimationFrame(frame.current);
		if (reducedMotion) {
			setProgress(1);
			return;
		}
		setProgress(0);
		/** @type {number | undefined} */
		let start;
		/** @param {number} now */
		const tick = (now) => {
			start ??= now;
			const t = Math.min((now - start) / 700, 1);
			setProgress(1 - (1 - t) ** 3);
			frame.current = t < 1 ? requestAnimationFrame(tick) : null;
		};
		frame.current = requestAnimationFrame(tick);
	}, [reducedMotion]);

	useEffect(() => {
		if (waiting) {
			wasWaiting.current = true;
			setProgress(0);
		} else if (wasWaiting.current) {
			wasWaiting.current = false;
			play();
		}
	}, [waiting, play]);

	// Settle immediately if reduced motion gets switched on mid-animation
	useEffect(() => {
		if (reducedMotion && frame.current !== null) {
			cancelAnimationFrame(frame.current);
			frame.current = null;
			setProgress(1);
		}
	}, [reducedMotion]);

	useEffect(
		() => () => {
			if (frame.current !== null) cancelAnimationFrame(frame.current);
		},
		[]
	);

	return (
		<button
			ref={ref}
			type="button"
			class={style.diagramButton}
			onClick={play}
			// Includes the visible labels, in order, for speech input users
			lang={t.lang('timelineLabel')}
			aria-label={`${t.text('timelineLabel')} ${RELEASES.map(
				(r) => `${r.version} ${r.year}`
			).join(' ')}`}
		>
			<svg
				viewBox="0 0 348 88"
				width="100%"
				height="88"
				fill="none"
				aria-hidden="true"
			>
				<line
					x1={TIMELINE_X1}
					y1={TIMELINE_Y}
					x2={TIMELINE_X2}
					y2={TIMELINE_Y}
					stroke="var(--text)"
					stroke-opacity="0.35"
				/>
				{RELEASES.map(({ version, year }) => {
					const x = yearToX(year);
					return (
						<g key={version}>
							<Hexagon
								text={version}
								x={progress * (x - RELEASE_HEX_WIDTH / 2)}
								y={TIMELINE_Y - RELEASE_HEX / 2}
								size={RELEASE_HEX}
								hexagonProps={{ fill: 'var(--bg)' }}
							/>
							{/* Separates the labels in the button's text ("v1 2015 v4 …"),
							    which its accessible name repeats */}{' '}
							<text
								x={x}
								y={TIMELINE_Y + 40}
								text-anchor="middle"
								fill="var(--text)"
								font-size="10"
							>
								{year}
							</text>{' '}
						</g>
					);
				})}
			</svg>
		</button>
	);
}

const TOOLS = [
	{ text: '/compat', x: 63.5744, y: 0, offset: [55, 95] },
	{ text: '/hooks', x: 173.574, y: 0, offset: [-55, 95] },
	{ text: '/signals', x: 8.57438, y: 95, offset: [110, 0] },
	{ text: '/iso', x: 228.574, y: 95, offset: [-110, 0] },
	{ text: '/devtools', x: 63.5744, y: 190, offset: [55, -95] },
	{ text: '/debug', x: 173.574, y: 190, offset: [-55, -95] }
];

function ToolsDiagram() {
	const t = useHomeCopy();
	const ref = useRef(null);
	const [collapsed, setCollapsed] = useState(false);
	const waiting = useScrollReveal(ref, 0.6);

	useEffect(() => {
		setCollapsed(waiting);
	}, [waiting]);

	return (
		<button
			ref={ref}
			type="button"
			class={style.diagramButton}
			onClick={() => setCollapsed((c) => !c)}
			aria-pressed={!collapsed}
			// Includes the labels the diagram currently shows, as written
			lang={t.lang('toolsLabel')}
			aria-label={`${t.text('toolsLabel')} ${
				collapsed ? 'core' : TOOLS.map((tool) => tool.text).join(' ')
			}`}
		>
			<svg
				width="232"
				height="212"
				viewBox="0 0 348 318"
				fill="none"
				aria-hidden="true"
			>
				{TOOLS.map((tool) => (
					<Hexagon
						key={tool.text}
						text={collapsed ? '' : tool.text}
						x={tool.x + (collapsed ? tool.offset[0] : 0)}
						y={tool.y + (collapsed ? tool.offset[1] : 0)}
						fontSize={16}
						animate
					/>
				))}
				<Hexagon
					text={collapsed ? 'core' : ''}
					x={118.574}
					y={95}
					fontSize={16}
					animate
				/>
			</svg>
		</button>
	);
}

const INTEGRATIONS = [
	['TanStack Query', '@tanstack/preact-query'],
	['Storybook', '@storybook/preact-vite'],
	['Astro', '@astrojs/preact'],
	['Vite', '@preact/preset-vite'],
	['Testing Library', '@testing-library/preact']
];

function Ecosystem() {
	const t = useHomeCopy();
	return (
		<div class={style.ecosystem}>
			<ul>
				{INTEGRATIONS.map(([name, pkg]) => (
					<li key={name}>
						<span>{name}</span>
						<code>{pkg}</code>
					</li>
				))}
			</ul>
			<div class={style.ecosystemMore}>
				<span>{t('andManyMore')}</span>
				<a
					href="https://github.com/preactjs/awesome-preact"
					class="btn primary"
				>
					{t('discover')}
				</a>
			</div>
		</div>
	);
}

const BLOCKS = [
	{ id: '1', x: 128, y: 0 },
	{ id: '2', x: 128, y: 32 },
	{ id: '3', x: 128, y: 64 },
	{ id: '4', x: 73, y: 64 },
	{ id: '5', x: 73, y: 32 },
	{ id: '6', x: 45, y: 80 },
	{ id: '7', x: 100, y: 80 }
];

/** Shuffles this many times, then settles on the full set */
const BLOCK_STEPS = 2;
const BLOCK_STEP_MS = 1600;

function BuildingBlocks() {
	const ref = useRef(/** @type {SVGSVGElement | null} */ (null));
	const [visible, setVisible] = useState(() => BLOCKS.map((b) => b.id));
	const hidden = useRef(/** @type {string[]} */ ([]));
	const reducedMotion = useReducedMotion();
	const inView = useInView(ref, 0.5);

	// A short shuffle once scrolled into view (under 5s, so it needs no pause
	// control), ending with every block shown
	useEffect(() => {
		if (reducedMotion || !inView) {
			hidden.current = [];
			setVisible(BLOCKS.map((b) => b.id));
			return;
		}
		let step = 0;
		const interval = setInterval(() => {
			if (++step > BLOCK_STEPS) {
				clearInterval(interval);
				hidden.current = [];
				setVisible(BLOCKS.map((b) => b.id));
				return;
			}
			setVisible((current) => {
				const queue = hidden.current;
				const count = Math.min(
					current.length,
					queue.length || 2,
					Math.random() < 0.5 ? 1 : 2
				);
				const restore = queue.splice(0, count);
				const hide = [...current]
					.sort(() => Math.random() - 0.5)
					.slice(0, count);
				queue.push(...hide);
				const next = new Set(current);
				restore.forEach((id) => next.add(id));
				hide.forEach((id) => next.delete(id));
				return [...next];
			});
		}, BLOCK_STEP_MS);
		return () => clearInterval(interval);
	}, [reducedMotion, inView]);

	return (
		<svg
			ref={ref}
			class={style.blocks}
			viewBox="0 0 256 166"
			fill="none"
			aria-hidden="true"
		>
			{BLOCKS.map(({ id, x, y }) => (
				<g
					key={id}
					class={style.block}
					style={{ opacity: visible.includes(id) ? 1 : 0 }}
				>
					<Hexagon
						x={x}
						y={y}
						size={64}
						hexagonProps={{ 'stroke-opacity': 0.75 }}
					/>
				</g>
			))}
		</svg>
	);
}

const PLAYGROUND_W = 900;
const PLAYGROUND_H = 600;
const PLAYGROUND_HEX = 120;
const STEP = 4;
const MOVES = {
	ArrowLeft: [-STEP, 0],
	ArrowRight: [STEP, 0],
	ArrowUp: [0, -STEP],
	ArrowDown: [0, STEP]
};
// On-screen controls move further per press than an arrow key (no repeat)
const TOUCH_STEP_FACTOR = 5;
/** @type {{ key: keyof typeof MOVES, label: HomeKey, arrow: string }[]} */
const PLAYGROUND_CONTROLS = [
	{ key: 'ArrowLeft', label: 'moveLeft', arrow: '←' },
	{ key: 'ArrowUp', label: 'moveUp', arrow: '↑' },
	{ key: 'ArrowDown', label: 'moveDown', arrow: '↓' },
	{ key: 'ArrowRight', label: 'moveRight', arrow: '→' }
];
const PLAYGROUND_START = [
	{ id: 'hex-1', x: 42, y: 92 },
	{ id: 'hex-2', x: 88, y: 128 },
	{ id: 'hex-3', x: 194, y: 58 },
	{ id: 'hex-4', x: 66, y: 224 },
	{ id: 'hex-5', x: 144, y: 188 },
	{ id: 'hex-6', x: 236, y: 158 },
	{ id: 'UI', x: 128, y: 278 },
	{ id: 'DOM', x: 402, y: 72 },
	{ id: 'API', x: 586, y: 114 },
	{ id: 'JSX', x: 378, y: 292 },
	{ id: 'Hook', x: 534, y: 278 },
	{ id: 'App', x: 676, y: 386 }
];

function Playground() {
	const t = useHomeCopy();
	const [hexes, setHexes] = useState(PLAYGROUND_START);
	const [selected, setSelected] = useState(PLAYGROUND_START[0].id);
	const [moved, setMoved] = useState(false);

	/** Moves the selected hexagon, within the board */
	/** @param {number[]} move */
	const moveSelected = (move) => {
		setMoved(true);
		setHexes((list) =>
			list.map((h) =>
				h.id === selected
					? {
							...h,
							x: Math.max(15, Math.min(765, h.x + move[0])),
							y: Math.max(15, Math.min(465, h.y + move[1]))
						}
					: h
			)
		);
	};

	/** @param {KeyboardEvent} e */
	const onKeyDown = (e) => {
		const move = MOVES[e.key];
		// Leave shortcuts like Alt+← (history back) alone
		if (!move || e.altKey || e.ctrlKey || e.metaKey) return;
		e.preventDefault();
		moveSelected(move);
	};

	/** @param {{ id: string, x: number, y: number }} hex */
	const describe = ({ id, x, y }) =>
		t
			.text('hexagonLabel')
			.replace('{id}', id)
			.replace('{x}', String(x))
			.replace('{y}', String(y));
	const current = hexes.find((h) => h.id === selected);

	// Each hexagon is a tab stop: Tab picks one, the arrow keys move it. The
	// buttons below do the same for touch & pointer users.
	return (
		<div
			role="group"
			// Not `aria-label`: the label's language (`t()` marks untranslated
			// copy as English) mustn't apply to the hexagons' own labels
			aria-labelledby="playground-label"
			class={style.playground}
			onKeyDown={onKeyDown}
		>
			<span id="playground-label" hidden>
				{t('playgroundLabel')}
			</span>
			{/* Announces the selected hexagon's position as it moves */}
			<p
				class={style.visuallyHidden}
				aria-live="polite"
				lang={t.lang('hexagonLabel')}
			>
				{moved && current ? describe(current) : ''}
			</p>
			<svg viewBox={`0 0 ${PLAYGROUND_W} ${PLAYGROUND_H}`} width="100%">
				{hexes.map(({ id, x, y }) => (
					<g
						key={id}
						role="button"
						// Lowercase: SVG attributes are case-sensitive, WebKit ignores `tabIndex`
						tabindex={0}
						aria-pressed={id === selected}
						aria-label={describe({ id, x, y })}
						lang={t.lang('hexagonLabel')}
						onFocus={() => {
							setSelected(id);
							// Its label has the position; only announce moves
							setMoved(false);
						}}
						onClick={(e) => {
							setSelected(id);
							/** @type {SVGGElement} */ (e.currentTarget).focus();
						}}
						onKeyDown={(e) => {
							// Activate like a native button, without Space scrolling the page
							if (e.key !== 'Enter' && e.key !== ' ') return;
							e.preventDefault();
							setSelected(id);
						}}
					>
						<Hexagon
							x={x}
							y={y}
							size={PLAYGROUND_HEX}
							hexagonProps={{
								fill: 'transparent',
								// --accent-hover keeps 3:1 against the page background
								stroke: id === selected ? 'var(--text)' : 'var(--accent-hover)',
								'stroke-width': 4
							}}
						/>
					</g>
				))}
			</svg>
			<div class={style.playgroundControls}>
				{PLAYGROUND_CONTROLS.map(({ key, label, arrow }) => (
					<button
						key={key}
						type="button"
						aria-label={t.text(label)}
						lang={t.lang(label)}
						onClick={() =>
							moveSelected(MOVES[key].map((d) => d * TOUCH_STEP_FACTOR))
						}
					>
						<span aria-hidden="true">{arrow}</span>
					</button>
				))}
			</div>
		</div>
	);
}

const FLAVOUR = [
	{ x: 38, y: 128, size: 44 },
	{ x: 188, y: 22, size: 22 },
	{ x: 264, y: 116, size: 48 },
	{ x: 418, y: 48, size: 40 },
	{ x: 532, y: 142, size: 34 },
	{ x: 624, y: 18, size: 62 },
	{ x: 762, y: 92, size: 48 },
	{ x: 866, y: 26, size: 82 },
	{ x: 994, y: 134, size: 26 },
	{ x: 1080, y: 56, size: 26 },
	{ x: 1176, y: 120, size: 42 }
];

function Flavour() {
	return (
		<div class={style.flavour} aria-hidden="true">
			<svg viewBox="0 0 1250 220">
				{FLAVOUR.map(({ x, y, size }, i) => (
					<Hexagon
						key={i}
						x={x}
						y={y}
						size={size}
						hexagonProps={{ 'stroke-opacity': 0.55 }}
					/>
				))}
			</svg>
		</div>
	);
}
