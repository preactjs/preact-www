if (!global.Promise) global.Promise = require('promise-polyfill');
if (!global.fetch) global.fetch = require('./fetch-polyfill').default;
// require('isomorphic-fetch');
