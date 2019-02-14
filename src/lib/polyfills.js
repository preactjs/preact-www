//require('promise-polyfill/lib/polyfill');
//require('isomorphic-unfetch');
import Promise from 'promise-polyfill';
import fetch from 'unfetch';
const g = "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
if (!g.Promise) g.Promise = Promise;
if (!g.fetch) g.fetch = fetch;
