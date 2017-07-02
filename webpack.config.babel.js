import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import OfflinePlugin from 'offline-plugin';
import autoprefixer from 'autoprefixer';
import rreaddir from 'recursive-readdir-sync';
import minimatch from 'minimatch';
import ssr from './src/ssr';
import config from './src/config.json';

const CONTENT = rreaddir('content').filter(minimatch.filter('**/*.md')).filter(minimatch.filter('!content/lang/**')).map( s => '/'+s );

const ENV = process.env.NODE_ENV || 'development';

const CSS_MAPS = ENV!=='production';

const VENDORS = /\bbabel\-standalone\b/;

module.exports = {
	context: path.resolve(__dirname, 'src'),
	entry: './index.js',

	output: {
		path: path.resolve(__dirname, 'build'),
		publicPath: '/',
		// filename: 'bundle.js'
		filename: 'bundle.js',
		chunkFilename: '[name].[chunkhash].chunk.js'
	},

	resolve: {
		extensions: ['', '.jsx', '.js', '.json', '.less'],
		modulesDirectories: [
			path.resolve(__dirname, 'src/lib'),
			path.resolve(__dirname, 'node_modules'),
			'node_modules'
		],
		alias: {
			components: path.resolve(__dirname, 'src/components'),
			style: path.resolve(__dirname, 'src/style'),
			'react': 'preact-compat',
			'react-dom': 'preact-compat'
		}
	},

	module: {
		noParse: [VENDORS],
		preLoaders: [
			{
				test: /\.jsx?$/,
				exclude: [path.resolve(__dirname, 'src'), VENDORS],
				loader: 'source-map'
			}
		],
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel'
			},
			{
				test: /\.(less|css)$/,
				include: [path.resolve(__dirname, 'src/components')],
				loader: ExtractTextPlugin.extract('style', [
					`css?sourceMap=${CSS_MAPS}&modules&importLoaders=1&localIdentName=[local]${process.env.CSS_MODULES_IDENT || '_[hash:base64:5]'}`,
					'postcss',
					`less?sourceMap=${CSS_MAPS}`
				].join('!'))
			},
			{
				test: /\.(less|css)$/,
				exclude: [path.resolve(__dirname, 'src/components'), VENDORS],
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
			'process.env.NODE_ENV': JSON.stringify(ENV)
		}),
		new HtmlWebpackPlugin({
			template: "!!ejs-loader!"+path.resolve(__dirname, 'src/index.html'),
			inject: false,
			minify: {
				collapseWhitespace: true,
				removeComments: true
			},
			favicon: path.resolve(__dirname, 'src/assets/favicon.ico'),
			title: config.title,
			config,
			render: () => ssr({ url:'/' })
		})
	]).concat(ENV==='production' ? [
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			mangle: true,
			compress: {
				warnings: false,
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
		// ncp src/manifest.json build/manifest.json && ncp src/assets build/assets && ncp content build/content
		new CopyWebpackPlugin([
			{ from: 'manifest.json' },
			{ from: 'assets', to: 'assets' },
			{ from: path.join(__dirname, 'content'), to: 'content' }
		]),
		new OfflinePlugin({
			version: '[hash]',
			responseStrategy: 'cache-first',
			safeToUseOptionalCaches: true,
			caches: {
				main: ['index.html', 'bundle.js', 'style.css'],
				additional: ['*.chunk.js', '*.worker.js', ':externals:'],
				optional: [':rest:']
			},
			externals: [
				...CONTENT
			],
			cacheMaps: [
				{
					match: /.*/,
					to: '/',
					requestTypes: ['navigate']
				}
			],
			ServiceWorker: {
				events: true
			},
			AppCache: {
				FALLBACK: { '/': '/' }
			}
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
		outputPath: path.resolve(__dirname, 'build'),
		quiet: true,
		clientLogLevel: 'error',
		compress: true,
		contentBase: path.resolve(__dirname, 'src'),
		historyApiFallback: true,
		setup(app) {
			app.use('/content/**', (req, res) => {
				fs.createReadStream(`content/${req.params[0]}`).pipe(res);
			});
		}
	}
};
