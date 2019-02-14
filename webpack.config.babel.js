import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import OfflinePlugin from 'offline-plugin';
import SizePlugin from 'size-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import CrittersPlugin from 'critters-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CleanPlugin from 'clean-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import autoprefixer from 'autoprefixer';
import rreaddir from 'recursive-readdir-sync';
import minimatch from 'minimatch';
// import ssr from './src/ssr';
import config from './src/config.json';

// global.fetch = require('isomorphic-fetch');
// import 'isomorphic-fetch';
// import './src/lib/polyfills';

const CONTENT = rreaddir('content').filter(minimatch.filter('**/*.md')).filter(minimatch.filter('!content/lang/**')).map( s => '/'+s );

const ENV = process.env.NODE_ENV || 'development';

const CSS_MAPS = ENV!=='production';

const VENDORS = /\bbabel\-standalone\b/;

const babelConfig = JSON.parse(fs.readFileSync('./.babelrc', 'utf-8'));
babelConfig.presets[0][1].modules = false;

module.exports = {
	context: path.resolve(__dirname, 'src'),
	// entry: {
	// 	polyfills: path.resolve(__dirname, 'src/lib/polyfills.js'),
	// 	main: path.resolve(__dirname, 'src/index.js')
	// },
	entry: {
		main: path.resolve(__dirname, 'src/index.js')
	},

	mode: ENV,

	output: {
		path: path.resolve(__dirname, 'build'),
		publicPath: '/',
		filename: '[name].js',
		chunkFilename: '[name].[chunkhash:5].chunk.js'
	},

	resolve: {
		extensions: ['.js', '.json', '.less'],
		modules: [
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
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					babelrc: false,
					...babelConfig
				}
			},

			{
				test: /\.(less|css)$/,
				enforce: 'pre',
				use: [
					{
						loader: 'postcss-loader',
						options: {
							plugins: [
								autoprefixer({
									browsers: '> 2%'
								})
							]
						}
					},
					{
						loader: 'less-loader',
						options: {
							sourceMap: CSS_MAPS
						}
					}
				]
			},

			{
				test: /\.(less|css)$/,
				include: [path.resolve(__dirname, 'src/components')],
				use: [
					ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: CSS_MAPS,
							modules: true,
							importLoaders: 1,
							localIdentName: `[local]${process.env.CSS_MODULES_IDENT || '_[hash:base64:5]'}`
						}
					}
				]
			},
			{
				test: /\.(less|css)$/,
				exclude: [path.resolve(__dirname, 'src/components')],
				use: [
					ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: CSS_MAPS
						}
					}
				]
			},
			{
				test: /\.(xml|html|txt|md)$/,
				exclude: [/src\/index\.html$/],
				loader: 'raw-loader'
			},
			{
				test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
				loader: ENV==='production' ? 'file-loader?name=[path][name]_[hash:base64:5].[ext]' : 'url-loader'
			}
		]
	},

	plugins: ([
		new webpack.NoEmitOnErrorsPlugin(),

		new ProgressBarPlugin({
			summary: true,
			clear: true
		}),

		new CleanPlugin(['dist/*'], {
			beforeEmit: true,
			verbose: false
		}),

		new webpack.DefinePlugin({
			process: {},
			'process.env': {},
			'process.env.NODE_ENV': JSON.stringify(ENV)
		}),

		new CopyWebpackPlugin([
			{ from: 'manifest.json' },
			{ from: 'assets', to: 'assets' },
			{ from: path.join(__dirname, 'content'), to: 'content' }
		]),

		new HtmlWebpackPlugin({
			// template: "!!ejs-loader!"+path.resolve(__dirname, 'src/index.html'),
			// template: "!!prerender-loader?url="+encodeURIComponent('https://preactjs.com')+"!ejs-loader!"+path.resolve(__dirname, 'src/index.html'),
			template: "!!prerender-loader?string&url="+encodeURIComponent('https://preactjs.com')+"!"+path.resolve(__dirname, 'src/index.html'),
			// inject: false,
			inject: true,
			minify: {
				collapseWhitespace: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				removeRedundantAttributes: true,
				removeComments: true
			},
			favicon: path.resolve(__dirname, 'src/assets/favicon.ico'),
			title: config.title,
			// render: () => ssr({ url:'/' }),
			config
		}),

		new SizePlugin()
	]).concat(ENV==='production' ? [
		// new webpack.optimize.SplitChunksPlugin({}),

		new MiniCssExtractPlugin({
			filename: '[name].[contenthash:5].css',
			chunkFilename: '[name].[contenthash:5].css'
		}),

		new OptimizeCssAssetsPlugin({
			cssProcessorOptions: {
				postcssReduceIdents: {
					counterStyle: false,
					gridTemplate: false,
					keyframes: false
				}
			}
		}),

		new CrittersPlugin({
			preload: 'media',
			noscriptFallback: false,
			compress: true,
			mergeStylesheets: false
			// inlineThreshold: 1000,
			// minimumExternalSize: 1000
		}),

		// ncp src/manifest.json build/manifest.json && ncp src/assets build/assets && ncp content build/content
		new OfflinePlugin({
			version: '[hash]',
			responseStrategy: 'cache-first',
			safeToUseOptionalCaches: true,
			caches: {
				main: ['index.html', 'main.js', 'main.*.css'],
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
		}),

		new BundleAnalyzerPlugin({
			analyzerMode: 'static',
			openAnalyzer: false
		})
	] : []),

	optimization: {
		splitChunks: {
			minSize: 1500,
			minChunks: 2
		},
		minimizer: [
			new TerserPlugin({
				sourceMap: ENV === 'production',
				extractComments: 'build/licenses.txt',
				terserOptions: {
					compress: {
						inline: 1,
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
					mangle: {
						safari10: true
					},
					output: {
						safari10: true,
						comments: false
					}
				}
			})
		]
	},

	stats: "errors-only",

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
