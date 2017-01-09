export default function fetch(url, options) {
	options = options || {};
	return new Promise( (resolve, reject) => {
		let request = new XMLHttpRequest();
		let h = options.headers;
		if (h) for (let i in h) if (h.hasOwnProperty(i)) {
			request.setRequestHeader(i, h[i]);
		}
		request.open(options.method || 'GET', url, true);
		request.onreadystatechange = () => {
			if (request.readyState!==4) return;
			if (!request.status) {
				reject(Error('Network Error'));
			}
			else {
				resolve(new Response(request));
			}
		};
		request.send(options.body || null);
	});
}

function Response(xhr) {
	this.type = 'cors';
	this.headers = new Headers(xhr.getAllResponseHeaders());
	this.status = xhr.status;
	this.statusText = xhr.statusText;
	this.ok = xhr.status>=200 && xhr.status<400;
	this.url = xhr.responseURL;
	this.clone = () => new Response(xhr);
	this.text = () => Promise.resolve(xhr.responseText);
	this.json = () => this.text().then(JSON.parse);
	// this.xml = () => Promise.resolve(xhr.responseXML);
	// this.blob = () => Promise.resolve( typeof xhr.response==='string' ? new Blob([xhr.response]) : xhr.response );
}

function Headers(text) {
	let keys = [],
		headers = {},
		all = [],
		lines = text && text.split('\n') || '';
	for (let i=lines.length; i--; ) {
		let match = lines[i] && lines[i].match(/^\s*(.*?)\s*\:\s*([\s\S]*?)\s*$/);
		if (match) {
			let key = match[1].toLowerCase();
			all.push([match[1], match[2]]);
			if (!headers[key]) {
				headers[key] = [];
				keys.push(match[1]);
			}
			headers[key].push(match[2]);
		}
	}
	this.keys = () => keys;
	this.getAll = n => headers[n.toLowerCase()];
	this.get = n => this.getAll(n)[0];
	this.entries = () => all;
	this.has = n => this.getAll(n).length>0;
	this.forEach = fn => all.forEach( n => fn(n[0], n[1]) );
}
