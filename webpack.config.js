import webpack from 'webpack'
import path from 'path'
import fileSystem from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WriteFilePlugin from 'write-file-webpack-plugin'

const alias = {}

const secretsPath = path.join(__dirname, `secrets.${ process.env.NODE_ENV }.js`)

if (fileSystem.existsSync(secretsPath)) {
	alias.secrets = secretsPath
}

const port = process.env.PORT || 8080
const hotReload = [
	'react-hot-loader/patch',
	`webpack-dev-server/client?http://localhost:${ port }`,
	'webpack/hot/only-dev-server'
]
const outputPath = path.join(__dirname, 'dist')
const publicPath = '/'

export default {
	devtool: 'inline-source-map',
	entry: {
		index: hotReload.concat(path.join(__dirname, 'src', 'index', 'js', 'index.js')),
		login: hotReload.concat(path.join(__dirname, 'src', 'login', 'js', 'login.js'))
	},
	devServer: {
		outputPath,
		contentBase: outputPath,
		port,
		publicPath,
		hot: true
	},
	output: {
		path: outputPath,
		filename: '[name].bundle.js',
		publicPath
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: ['babel-loader'],
				exclude: /node_modules/,
			},
			{
				test: /\.json$/,
				use: ['json-loader']
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader?modules']
			}
		]
	},
	resolve: {
		alias
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV),
				PORT: JSON.stringify(process.env.PORT)
			}
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'index', 'index.html'),
			filename: 'index.html',
			chunks: ['index']
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'login', 'login.html'),
			filename: 'login.html',
			chunks: ['login']
		}),
		new WriteFilePlugin()
	]
}
