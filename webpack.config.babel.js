import fs from 'fs';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import OfflinePlugin from 'offline-plugin';
import autoprefixer from 'autoprefixer';
import rreaddir from 'recursive-readdir-sync';
import minimatch from 'minimatch';
import config from './src/config.json';

const CONTENT = rreaddir('content').filter(minimatch.filter('**/*.md')).map( s => '/'+s );

const ENV = process.env.NODE_ENV || 'development';

const CSS_MAPS = false;

const VENDORS = /\bbabel\-standalone\b/;

module.exports = {
	context: `${__dirname}/src`,
	entry: './index.js',

	output: {
		path: `${__dirname}/build`,
		publicPath: '/',
		// filename: 'bundle.js'
		filename: 'bundle.[hash].js',
		chunkFilename: '[name].[chunkhash].chunk.js'
	},

	resolve: {
		extensions: ['.jsx', '.js', '.json', '.less'],
		modules: [
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

	module: {
		noParse: [VENDORS],
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					sourceMaps: true,
					presets: [
						['es2015', { loose:true, modules:false }],
						'stage-0'
					],
					plugins: [
						['transform-decorators-legacy'],
						['transform-react-jsx', { pragma: 'h' }]
					]
				}
			},
			{
				test: /\.(less|css)$/,
				include: /src\/components\//,
				loader: ExtractTextPlugin.extract({
					fallbackLoader: 'style',
					loader: [
						`css?sourceMap=${CSS_MAPS}&modules&importLoaders=1&localIdentName=[local]${process.env.CSS_MODULES_IDENT || '_[hash:base64:5]'}`,
						'postcss',
						`less?sourceMap=${CSS_MAPS}`
					].join('!')
				})
			},
			{
				test: /\.(less|css)$/,
				exclude: [/src\/components\//, VENDORS],
				loader: ExtractTextPlugin.extract({
					fallbackLoader: 'style',
					loader: [
						`css?sourceMap=${CSS_MAPS}`,
						`postcss`,
						`less?sourceMap=${CSS_MAPS}`
					].join('!')
				})
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
				loader: ENV==='production' ? 'file' : 'url',
				query: {
					name: '[path][name]_[hash:base64:5].[ext]'
				}
			}
		]
	},

	plugins: ([
		new webpack.LoaderOptionsPlugin({
			minimize: ENV==='production',
			debug: ENV!=='production',
			options: {
				postcss: () => [
					autoprefixer({ browsers: 'last 2 versions' })
				]
			}
		}),
		new ProgressBarPlugin(),
		new webpack.NoErrorsPlugin(),
		new ExtractTextPlugin({
			filename: 'style.[chunkhash].css',
			allChunks: false,
			disable: ENV!=='production'
		}),
		new webpack.DefinePlugin({
			process: {},
			'process.env': {},
			'process.env.NODE_ENV': JSON.stringify(ENV)
		}),
		new HtmlWebpackPlugin({
			template: './index.html',
			minify: {
				collapseWhitespace: true,
				removeComments: true
			},
			favicon: `${__dirname}/src/assets/favicon.ico`,
			title: config.title,
			config
		})
	]).concat(ENV==='production' ? [
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
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
			version: 'hash',
			preferOnline: true,
			// updateStrategy: 'changed',
			safeToUseOptionalCaches: true,
			caches: {
				main: ['index.html', 'bundle.*.js', 'style.*.css'],
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
			// rewrite /urls/without/extensions to /index.html
			//, rewrites(url) {
			// 	// if (!url.match(/\.[a-z0-9]{2,}(\?.*)?$/)) url = '/index.html';
			// 	if (!url.match(/\.[a-z0-9]{2,}(\?.*)?$/)) url = '/';
			// 	return url;
			// }
		})
	] : []),

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
		// quiet: true,
		compress: true,
		contentBase: `${__dirname}/src`,
		historyApiFallback: true,
		setup(app) {
			app.use('/content/**', (req, res) => {
				fs.createReadStream(`content/${req.params[0]}`).pipe(res);
			});
		}
	}
};
