import fs from 'fs';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import OfflinePlugin from 'offline-plugin';
import StaticSiteGeneratorPlugin from 'static-site-generator-webpack-plugin';
import autoprefixer from 'autoprefixer';
import rreaddir from 'recursive-readdir-sync';
import minimatch from 'minimatch';
import config from './src/config.json';

let window = require('undom')().defaultView;

const CONTENT = rreaddir('content').filter(minimatch.filter('**/*.md')).filter(minimatch.filter('!content/lang/**')).map( s => '/' );

const PATHS = CONTENT.map( c => c.replace(/(^\/content|(\/index)?\.md$)/g, '') || '/' );

const ENV = process.env.NODE_ENV || 'development';

const CSS_MAPS = ENV!=='production';

const VENDORS = /\bbabel\-standalone\b/;


const createConfig = (options={}) => ({
	context: `${__dirname}/src`,
	// entry: './index.js',
	entry: {
		main: options.prerender ? './prerender.js' : './index.js'
	},

	output: {
		path: `${__dirname}/build`,
		publicPath: '/',
		// filename: 'bundle.js'
		filename: options.prerender ? 'prerender.js' : 'bundle.js',
		chunkFilename: '[name].[chunkhash].chunk.js',

		...(options.prerender ? {
			// required for static-site-generator-webpack-plugin:
			libraryTarget: 'umd'
		} : {})
	},

	resolve: {
		extensions: ['', '.jsx', '.js', '.json', '.less'],
		modulesDirectories: [
			`${__dirname}/src/lib`,
			`${__dirname}/node_modules`,
			'node_modules'
		],
		alias: {
			components: `${__dirname}/src/components`,
			style: `${__dirname}/src/style`,
			'react': 'preact-compat',
			'react-dom': 'preact-compat'
		}
	},

	externals: ['fs', 'path'],

	module: {
		noParse: [VENDORS],
		// preLoaders: [
		// 	{
		// 		test: /\.jsx?$/,
		// 		exclude: [/src\//, VENDORS],
		// 		loader: 'source-map'
		// 	}
		// ],
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel'
			},
			{
				test: /\.(less|css)$/,
				include: /src\/components\//,
				loader: ExtractTextPlugin.extract('style', [
					`css?sourceMap=${CSS_MAPS}&modules&importLoaders=1`,
					'postcss',
					`less?sourceMap=${CSS_MAPS}`
				].join('!'))
			},
			{
				test: /\.(less|css)$/,
				exclude: [/src\/components\//, VENDORS],
				loader: ExtractTextPlugin.extract('style', [
					`css?sourceMap=${CSS_MAPS}`,
					`postcss`,
					`less?sourceMap=${CSS_MAPS}`
				].join('!'))
			},
			{
				test: /\.json$/,
				loader: 'json'
			},
			{
				test: /\.(xml|html|txt|md)$/,
				exclude: [/src\/index\.html$/],
				loader: 'raw'
			},
			{
				test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
				loader: ENV==='production' ? 'file?name=[path][name]_[hash:base64:5].[ext]' : 'url'
			}
		]
	},

	postcss: () => [
		autoprefixer({ browsers: 'last 2 versions' })
	],

	plugins: ([
		new ProgressBarPlugin(),
		new webpack.NoErrorsPlugin(),
		new ExtractTextPlugin('style.css', {
			allChunks: false,
			disable: ENV!=='production'
		}),
		new webpack.DefinePlugin({
			process: {},
			'process.env': {},
			'process.env.NODE_ENV': JSON.stringify(ENV),
			PRERENDER: options.prerender
		}),

		options.prerender && new StaticSiteGeneratorPlugin('main', PATHS, { }, {
			window,
			self: window,
			navigator: {},
			history: {},
			location: {
				href: '',
				pathname: '',
				search: ''
			},
			localStorage: {}
		})


		// new HtmlWebpackPlugin({
		// 	template: './index.html',
		// 	minify: {
		// 		collapseWhitespace: true,
		// 		removeComments: true
		// 	},
		// 	favicon: `${__dirname}/src/assets/favicon.ico`,
		// 	title: config.title,
		// 	config
		// })
	]).concat(!options.prerender && ENV==='production' ? [
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			mangle: true,
			compress: {
				warnings: false,
				// unsafe: true,
				// collapse_vars: true,
				// evaluate: true,
				// screw_ie8: true,
				// loops: true,
				// keep_fargs: false,
				// pure_getters: true,
				// unused: true,
				// dead_code: true,
				pure_funcs: [
					'classCallCheck',
					'_possibleConstructorReturn',
					'_classCallCheck',
					'Object.freeze',
					'invariant',
					'warning'
				]
			},
			output: { comments:false }
		}),
		new OfflinePlugin({
			relativePaths: false,
			publicPath: '/',
			updateStrategy: 'all',
			version: '[hash]',
			preferOnline: true,
			safeToUseOptionalCaches: true,
			caches: {
				main: ['index.html', 'bundle.js', 'style.css'],
				additional: ['*.chunk.js', '*.worker.js', ...CONTENT],
				optional: [':rest:']
			},
			externals: [
				...CONTENT
			],
			ServiceWorker: {
				navigateFallbackURL: '/',
				events: true
			},
			AppCache: {
				FALLBACK: { '/': '/' }
			}
		})
	] : []).filter(Boolean),

	stats: false,

	node: {
		process: false,
		Buffer: false,
		__filename: false,
		__dirname: false,
		setImmediate: false
	},

	devtool: ENV==='production' ? 'source-map' : 'cheap-module-eval-source-map',

	devServer: {
		port: process.env.PORT || 8080,
		host: '0.0.0.0',
		publicPath: '/',
		quiet: true,
		clientLogLevel: 'error',
		compress: true,
		contentBase: `${__dirname}/src`,
		historyApiFallback: true,
		setup(app) {
			app.use('/content/**', (req, res) => {
				fs.createReadStream(`content/${req.params[0]}`).pipe(res);
			});
		}
	}
});


module.exports = [
	createConfig({ prerender: true }),
	createConfig()
];
