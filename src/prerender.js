import './lib/polyfills';
import './style';
import { h } from 'preact';
import renderToString from 'preact-render-to-string';
import App from './components/app';
import tpl from 'raw!./index.html';

export default ({ path, webpackStats }, callback) => {
	let assets = Object.keys(webpackStats.compilation.assets);

	location.pathname = path;
	location.href = 'https://preactjs.com'+path;

	let app = renderToString(<App url={path} />);

	let head = assets.filter( f => f.match(/\.css$/) ).reduce( (t, f) => `${t}<link rel="stylesheet" href="/${f}">`, '');
	let body = `<script src="/bundle.js" async></script>`;
	app += body;
	// let body = assets.filter( f => f.match(/\.js/) ).reduce( (t, f) => `${t}<script src="${f}" async></script>`, '');

	let html = tpl
		.replace(/<body(\s.*)?>/, s => s+app )
		.replace(/<\/head>/, s => head+s );
		// .replace(/<\/body>/, s => body+s );

	callback(null, html);
};
