import { h, Component, render, hydrate } from 'preact';
import * as preact from 'preact';
import { debounce, memoOne } from './utils';
import { patchErrorLocation } from './errors';
import { wrap } from 'comlink';

export const ReplWorker = wrap(
	new Worker(new URL('./repl.worker.js', import.meta.url), {
		type: 'module'
	})
);

let cachedFetcher = memoOne(fetch);
let cachedFetch = (...args) => cachedFetcher(...args).then(r => r.clone());

export default class Runner extends Component {
	// FIXME: Wait for WMR 3.7.2
	// static worker = worker;

	shouldComponentUpdate() {
		return false;
	}

	componentDidMount() {
		this.run();
	}

	componentWillReceiveProps({ code }) {
		if (code !== this.props.code) this.run();
	}

	run = debounce(1000, () => {
		let { code, onSuccess, onError } = this.props;

		ReplWorker.process(code, {})
			.then(transpiled => this.execute(transpiled))
			.then(onSuccess)
			.catch(error => {
				patchErrorLocation(error);
				if (onError) onError({ error });
			});
	});

	execute(transpiled, isFallback) {
		const PREACT = {
			...preact,
			render: (v, a, b) => {
				if (!vnode) vnode = v;
				else if (this.base.contains(a)) {
					return render(v, a, b);
				}
			},
			hydrate: (v, a) => {
				if (!vnode) vnode = v;
				else if (this.base.contains(a)) {
					return hydrate(v, a);
				}
			}
		};

		let module = { exports: {} },
			modules = {
				preact: () => PREACT,
				'preact/hooks': () => import('preact/hooks'),
				'preact/debug': () => import('preact/debug'),
				'preact/compat': () => import('preact/compat'),
				react: () => import('preact/compat'),
				'react-dom': () => import('preact/compat'),
				htm: () => import('htm'),
				'preact-custom-element': () => import('preact-custom-element')
			},
			moduleCache = {},
			fn,
			vnode;

		function _require(id) {
			// flatten unpkg
			if (typeof id === 'string') {
				id = id.replace(/(^(https?:)?\/\/unpkg\.com\/|\?module$)/gi, '');
			}
			if (id in moduleCache) {
				return moduleCache[id];
			}
			if (id in modules) {
				return (moduleCache[id] = modules[id]());
			}
			throw Error(`No module found for ${id}`);
		}

		if (isFallback === true) {
			this.root = render(null, this.base);
			this.base.innerHTML = '';
		}

		try {
			fn = eval(transpiled); // eslint-disable-line
			fn(module, module.exports, _require, cachedFetch);
		} catch (error) {
			// try once more without DOM reuse:
			if (isFallback !== true) {
				return this.execute(transpiled, true);
			}
			patchErrorLocation(error);
			throw error;
		}

		let exported =
			module.exports &&
			(module.exports.default ||
				module.exports[Object.keys(module.exports)[0]] ||
				module.exports);
		if (!vnode && typeof exported === 'function') {
			vnode = h(exported);
		}
		if (vnode) {
			try {
				this.root = render(vnode, this.base);
			} catch (error) {
				patchErrorLocation(error);
				throw error;
			}
		}

		return { vnode };
	}

	render({ onError, onSuccess, code, children, ...props }) {
		return <div {...props} />;
	}
}
