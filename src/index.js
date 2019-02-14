// import './lib/polyfills';
import './style/index.less';
import 'linkstate/polyfill';
import './pwa';
import App from './components/app'
import * as preact from 'preact';

// allows users to play with preact in the browser developer console
global.preact = preact;

export default App;
