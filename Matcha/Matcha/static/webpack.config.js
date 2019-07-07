var webpack = require('webpack');
const path = require( 'path' )
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const devMode = process.env.NODE_ENV !== 'production'
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let cssLoader = {loader: 'css-loader', options: {minify: true}} 

let config = {
    entry: ['babel-polyfill', path.resolve('./js/index.jsx')],
    output: {
			path: path.resolve(__dirname, 'dist'),
			filename: '[name].bundle.js',
			chunkFilename: '[name].bundle.js',
			publicPath: '/dist/'
    },
    resolve: {
			extensions: ['.js', '.jsx', '.css']
	},
	optimization: {
		// concatenateModules: false,
		// splitChunks: {
			// chunks: 'all',
			// cacheGroups: {
			// 	vendors: {
			// 		test: /[\\/]node_modules[\\/]/,
			// 		priority: -10
			// 	},
			// 	default: {
			// 	minChunks: 2,
			// 	priority: -20,
			// 	reuseExistingChunk: true
			// 	}
			// }
		// }
  },
	devtool: "cheap-module-source-map",
    module: {
			rules: [
				{
					test: /\.jsx?/,
					exclude: /node_modules/,
					use: 'babel-loader'
				},
				{
					test: /\.html?/,
					exclude: /node_modules/,
					use: 'html-loader'
				},
				{
					test: /\.css$/,
					use: [
						MiniCssExtractPlugin.loader,
						cssLoader
					]
				},
				{
					test: /\.(png|jpg|gif|svg)$/,
					use: [
						{
							loader: 'url-loader',
							options: {
								limit: 8192,
								outputPath: 'assets'
							}
						}
					],
				},
				{
					test: /\.(eot|ttf|woff|woff2)$/,
					loader: 'file-loader',
					options: {
						name: 'fonts/[name].[hash].[ext]'
					}
				},
			],
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: "style.css"
			}),
			new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /fr/),
			new HtmlWebpackPlugin({
				inject: false,
				hash: true,
				filename: './index.html',
				template: './index.html',
				title: 'Matcha',
				'meta': {
					'viewport': 'width=device-width',
				}
			}),
    ],
    target:'web'
};

module.exports = config;