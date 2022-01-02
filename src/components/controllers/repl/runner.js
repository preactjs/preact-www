import { h, Component, createRef } from 'preact';
import { memoize } from 'decko';
import style from './style.module.less';
import ReplWorker from 'workerize-loader?name=repl.[hash:5]!./repl.worker';
import bundledModulesUrl from 'worker-plugin/loader?name=repl.setup&esModule!./repl.setup.js';
import { patchErrorLocation } from './errors';

let cachedFetcher = memoize(fetch);
let cachedFetch = (...args) => cachedFetcher(...args).then(r => r.clone());

const bundledModules = fetch(bundledModulesUrl).then(r => r.text());

const worker = new ReplWorker();

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
			this.running = worker
				.process(code, setup)
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
		this.settingUp = bundledModules.then(async code => {
			this.setupRealm();

			await this.realm.eval(code);
			this.require = await this.realm.eval('window._require');

			// Intercept VNodes passed to render/hydrate for automatic re-rendering:
			const preact = this.require('preact');
			let oldRoot = preact.options.__;
			preact.options.__ = function(vnode, parent) {
				if (!this.rootVNode) this.rootVNode = vnode;
				if (oldRoot) oldRoot(vnode, parent);
			};

			if (this.props.onRealm) {
				this.props.onRealm(this.realm);
			}
		});
		return this.settingUp;
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
	}

	async execute(transpiled, isFallback) {
		if (this.didError && !isFallback) {
			await this.rebuild();
		} else {
			await this.setup();
		}

		const base = this.output;
		const { render } = this.require('preact');

		if (this.didError) {
			// no need to reset, this is a fresh frame
		} else if (this.props.clear === true || isFallback === true) {
			this.root = render(null, base);
			base.innerHTML = '';
		}

		this.rootVNode = null;
		this.didError = undefined;

		let module = { exports: {} };

		let fn = await this.realm.eval(transpiled);

		try {
			fn(module, module.exports, this.require, cachedFetch);
		} catch (error) {
			// try once more without DOM reuse:
			if (isFallback !== true) {
				return await this.execute(transpiled, true);
			}
			throw error;
		}

		let exported =
			module.exports &&
			(module.exports.default ||
				module.exports[Object.keys(module.exports)[0]] ||
				module.exports);

		if (!this.rootVNode && typeof exported === 'function') {
			this.rootVNode = h(exported, null);
		}
		if (this.rootVNode) {
			this.root = render(this.rootVNode, base);
		}

		return { vnode: this.rootVNode };
	}

	render(props) {
		return (
			<iframe
				class={style.runner + ' ' + (props.class || '')}
				style={props.style}
				ref={this.frame}
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
