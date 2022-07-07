// const { resolve } = require('path');

// module.exports = {
//     entry: './src/main.js',
//     output: {
//         filename: 'prod.js',
//         path: resolve( __dirname, 'dist' )
//     },
//     devServer: {
//         static: {
//             directory: resolve( __dirname, '' )
//         }
//     },
//     target: 'node',
//     mode: 'production'
// }

// /* webpack.config.js */
// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

// module.exports = {
//     entry: './main.js',
//     plugins: [
//         new HtmlWebpackPlugin({
//           title: 'Output Management',
//         }),
//     ],
//     output: {
//         path: path.resolve(__dirname, 'dist'),
//         filename: 'bundle.js',
//     },
// };

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.ts',
	watch: true,
    mode: 'development',
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		new HtmlWebpackPlugin({
            hash: true,
            title: 'My Awesome application',
            myPageHeader: 'Hello World',
            template: './src/index.html'
        })
	],
    devServer: {
        static: "./dist",
        hot: true,
		port: 7001
    }
};