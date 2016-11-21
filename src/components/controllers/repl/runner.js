import { h, Component, render } from 'preact';
import { debounce, memoize } from 'decko';
import Worker from 'worker!./worker';
import regeneratorRuntime from 'babel-runtime/regenerator';

let cachedFetcher = memoize(fetch);
let cachedFetch = (...args) => cachedFetcher(...args).then( r => r.clone() );

const Empty = () => null;

let count = 0;
const worker = new Worker();
worker.call = (method, ...params) => new Promise( (resolve, reject) => {
	let id = ++count,
		msg;
	worker.addEventListener('message', msg = ({ data }) => {
		if (data.id!==id) return;
		worker.removeEventListener('message', msg);
		if (data.error) reject(data.error);
		resolve(...[].concat(data.result));
	});
	worker.postMessage({ id, method, params });
});

export default class Runner extends Component {
	static worker = worker;

	shouldComponentUpdate() {
		return false;
	}

	componentDidMount() {
		this.run();
	}

	componentWillReceiveProps({ code }) {
		if (code!==this.props.code) this.run();
	}

	run = debounce(1000, () => {
		let { code, onSuccess, onError } = this.props;

		code = code.replace(/^(\r|\n|\s)*import(?:\s.+?from\s+)?(['"])(.+?)\2\s*\;\s*(\r|\n)/g, (s, pre, q, lib) => {
			console.info(`Skipping import "${lib}": imports not supported.`);
			return pre || '';
		});

		worker.call('transform', code)
			.then( transpiled => this.execute(transpiled) )
			.then( onSuccess )
			.catch( ({ message, ...props }) => {
				let error = new Error(message);
				for (let i in props) if (props.hasOwnProperty(i)) error[i] = props[i];
				if (onError) onError({ error });
			});
	});

	execute(transpiled) {
		let { onError, onSuccess } = this.props,
			module = { exports: {} },
			fn, vnode;

		this.root = render(<Empty />, this.base, this.root);
		this.base.innerHTML = '';

		try {
			fn = eval(transpiled);  // eslint-disable-line
			fn(h, Component, v => vnode=v, module, module.exports, regeneratorRuntime, cachedFetch);
		} catch (error) {
			if (onError) onError({ error });
			return;
		}

		let exported = module.exports && (module.exports.default || module.exports[Object.keys(module.exports)[0]] || module.exports);
		if (!vnode && typeof exported==='function') {
			vnode = h(exported);
		}
		if (vnode) {
			try {
				this.root = render(vnode, this.base, this.root);
			} catch (error) {
				error.message = `[render] ${error.message}`;
				throw error;
			}
		}

		return { vnode };
	}

	render({ onError, onSuccess, code, children, ...props }) {
		return <div {...props} />;
	}
}
