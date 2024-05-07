import { Component, createRef } from 'preact';
import { memoize } from 'decko';
import style from './style.module.css';
import * as Comlink from 'comlink';
import { patchErrorLocation } from './errors';

let cachedFetcher = memoize(fetch);
let cachedFetch = (...args) => cachedFetcher(...args).then(r => r.clone());

const worker = Comlink.wrap(
	new Worker(new URL('./repl.worker.js', import.meta.url), {
		type: 'module'
	})
);

function createRoot(doc) {
	const root = doc.createElement('div');
	root.id = 'app';
	doc.body.appendChild(root);
}

export default class Runner extends Component {
	static worker = worker;

	frame = createRef();

	shouldComponentUpdate() {
		return false;
	}

	/** The parent DOM element into which this runner is rendering results. */
	get output() {
		return this.realm.globalThis.document.body;
	}

	commitError = error => {
		if (error && typeof error === 'object') {
			patchErrorLocation(error);
		}
		this.didError = true;
		if (this.props.onError) {
			this.props.onError({ error });
		}
	};

	commitResult = result => {
		this.didError = false;
		if (this.props.onSuccess) {
			this.props.onSuccess(result);
		}
	};

	componentDidMount() {
		// Set up the realm synchronously so it's available when accessed via a ref.
		// To do that, we need to reuse then realm on the first run.
		this.setupRealm();
		this.realm.reuse = true;
		this.run();
	}

	componentWillReceiveProps({ code, setup }) {
		if (code !== this.props.code || setup !== this.props.setup) {
			this.run();
		}
	}

	run() {
		if (this.timer) return;
		this.timer = setTimeout(() => {
			let { code, setup } = this.props;
			// onRealm must be called after imports but before user code:
			const fullSetup = `if (self._onRealm) self._onRealm();${setup || ''}\n`;
			this.running = worker
				.process(code, fullSetup)
				.then(transpiled => this.execute(transpiled))
				.then(this.commitResult)
				.catch(this.commitError)
				.then(() => {
					this.running = null;
					this.timer = null;
					if (this.props.code !== code || this.props.setup !== setup) {
						this.run();
					}
				});
		}, 500);
	}

	async rebuild() {
		await new Promise((resolve, reject) => {
			let frame = this.frame.current;
			frame.onload = resolve;
			frame.onerror = reject;
			frame.src = 'about:blank';
		});
		return await this.setup(true);
	}

	setup(fresh) {
		if (this.settingUp && fresh !== true) return this.settingUp;
		this.setupRealm();
		// silly leftover promise stuff
		return (this.settingUp = Promise.resolve());
	}

	setupRealm() {
		if (this.realm) {
			if (this.realm.reuse) {
				this.realm.reuse = false;
				return;
			}
			this.realm.destroy();
		}

		this.realm = new Realm({
			frame: this.frame.current,
			onError: this.commitError
		});
		this.realm.globalThis.fetch = cachedFetch;
		let doc = this.realm.globalThis.document;
		let style = doc.createElement('style');
		style.appendChild(
			doc.createTextNode(`
				html { font: 100%/1.3 system-ui, sans-serif; background: none; }
				${this.props.css || ''}
			`)
		);
		doc.head.appendChild(style);
		createRoot(doc);
	}

	async execute(transpiled, isFallback) {
		if (this.didError && !isFallback) {
			await this.rebuild();
		} else {
			await this.setup();
		}

		const base = this.output;
		const render = this.realm?.globalThis?.$preact?.render;

		if (this.didError) {
			// no need to reset, this is a fresh frame
		} else if (render || this.props.clear === true || isFallback === true) {
			if (render) {
				try {
					this.root = render(null, base);
				} catch (e) {
					console.error('Failed to unmount previous code: ', e);
				}
			}
			base.innerHTML = '';
			createRoot(this.realm.globalThis.document);
		}

		this.didError = undefined;

		let module = { exports: {} };

		// inject onRealm so it can be called after imports but before user code:
		this.realm.globalThis._onRealm = () => {
			this.realm.globalThis._onRealm = null;
			if (this.props.onRealm) {
				this.props.onRealm(this.realm);
			}
		};

		let fn = await this.realm.eval(transpiled);

		try {
			fn(module, module.exports);
		} catch (error) {
			// try once more without DOM reuse:
			if (isFallback !== true) {
				return await this.execute(transpiled, true);
			}
			throw error;
		}
	}

	render(props) {
		return (
			<iframe
				class={style.runner + ' ' + (props.class || '')}
				style={props.style}
				ref={this.frame}
				title="REPL Result"
			/>
		);
	}
}

function Realm({ frame, onError }) {
	if (!frame) {
		frame = document.createElement('iframe');
		frame.style.cssText =
			'position:absolute; left:0; top:-999em; width:1px; height:1px; overflow:hidden; border:0;';
		document.body.appendChild(frame);
	}
	this.reuse = false;
	this.globalThis = frame.contentWindow;
	this.onError = onError || console.error;

	const catchError = (m, fileName, lineNumber, columnNumber, err) => {
		if (err) return this.onError(err);
		let e = new Error(m);
		// lineNumber -= 5;
		let stack = `${m}\n  repl.js (:${lineNumber}:${columnNumber})`;
		Object.defineProperty(e, 'fileName', { value: fileName });
		Object.defineProperty(e, 'lineNumber', { value: lineNumber });
		Object.defineProperty(e, 'columnNumber', { value: columnNumber });
		Object.defineProperty(e, 'stack', { value: stack });
		this.onError(e);
	};
	const catchRejection = e => {
		this.onError(e.reason || e);
	};
	this.globalThis.onerror = catchError;
	this.globalThis.addEventListener('unhandledrejection', catchRejection);

	this.destroy = () => {
		this.globalThis.removeEventListener('unhandledrejection', catchRejection);
		this.globalThis.onerror = null;
		this.globalThis = this.onError = frame = onError = null;
	};
	this.eval = code => frame.contentWindow.eval(code);
}
