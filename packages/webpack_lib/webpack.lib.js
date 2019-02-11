const path = require('path');
const fs = require('fs');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const isProd = mode === 'production';

const output_dir = path.join(__dirname, 'dist');

const PORT = 8001;

module.exports = {
    mode: mode,
    entry: {
        button: './src/component/button/index.js' //,
        // 'form': './src/component/form/index.js',
        // 'alert': './src/component/alert/index.js'
    },
    output: {
        path: output_dir,
        filename: 'UILib.[name].js',
        library: ['UILib', '[name]'],
        libraryTarget: 'umd',
        jsonpFunction: 'webpackLibJsonp'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    isProd ? MiniCssExtractPlugin.loader : 'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader'
                ]
            }
        ]
    },
    devtool: 'cheap-source-map',
    devServer: {
        contentBase: output_dir,
        port: PORT,
        hot: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
        }
    },
    resolve: {
        alias: {
            '@common': path.join(__dirname, 'src', 'common'),
            '@components': path.join(__dirname, 'src', 'components'),
            '@style': path.join(__dirname, 'src', 'style')
        }
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin()
        ],
        splitChunks: {
            chunks: 'all',
            minSize: 0,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                default: false,
                common: {
                    name: 'common',
                    test: function(module, chunks) {
                        let src = module.resource;
                        let isNodeModule = /\/node_modules\//.test(src);
                        let isCommon = /\/src\/common\//.test(src);

                        return isNodeModule || isCommon;
                    },
                    minChunks: 1,
                    priority: 1,
                    reuseExistingChunk: true
                }
            }
        }
    },
    plugins: [].concat(
        new CleanWebpackPlugin(output_dir),
        new MiniCssExtractPlugin({
            filename: isProd ? '[name]@[hash].css' : '[name].css',
            chunkFilename: isProd ? '[id]@[hash].css' : '[id].css'
        })
    )
};
