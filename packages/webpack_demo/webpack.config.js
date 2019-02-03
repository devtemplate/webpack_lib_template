const path = require('path');
const fs = require('fs');
const App = require('./app_config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const isProd = mode === 'production';

const output_dir = path.join(__dirname, 'dist');

const PORT = 8000;

module.exports = {
    mode: mode,
    entry: App.entry,
    output: {
        path: output_dir,
        filename: isProd ? '[name]@[chunkhash].js' : '[name].js',
        publicPath: isProd ? 'https://honchy.cn/' : 'http://localhost:' + PORT + '/'
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
        hot: true
    },
    resolve: {
        alias: {
            '@common': path.join(__dirname, 'src', 'common'),
            '@components': path.join(__dirname, 'src', 'components'),
            '@style': path.join(__dirname, 'src', 'style')
        }
    },
    externals: [
        function(context, request, callback) {
            // Every module prefixed with "global-" becomes external
            // "global-abc" -> abc
            if (/^UILib\./.test(request)) {
                console.log('>>>>>  var ' + request);
                // return callback(null, "var " + request.substr(6));
                // webpack 本身并未进行 amd cmd 的polyfill，所以在浏览器中运行的时候
                // 依然是全局变量，不过还在，在webpack.lib.js中，针对各种情况都进行了导出
                // 所以这里只需要从全局返回即可
                let name = request.substr(6);
                return callback(null, `var (function() {
                        let url = 'http://localhost:8001/${name}.js';
                        function lazyLoad(url) {
                            let el = document.createElement('script');
                            el.src = url;
                            document.head.appendChild(el);
                        }
                        lazyLoad(url);
                        return window.UILib && window.UILib['${name}'.substr(6)];
                    })();
                `);
            }
            callback();
        }
    ],
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
            minChunks: 2,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                default: false,
                common: {
                    name: 'common',
                    test: /\.js$/,
                    minChunks: 2,
                    priority: 1,
                    reuseExistingChunk: true
                }
            }
        }
    },
    plugins: [].concat(
        new CleanWebpackPlugin(output_dir),
        App.html.map(item => {
            let cfg = {
                filename: item.html_out,
                chunks: [item.name],
                minify: isProd
            };

            if (item.html) {
                cfg.template = item.html;
            }

            return new HtmlWebpackPlugin(cfg);
        }),
        new MiniCssExtractPlugin({
            filename: isProd ? '[name]@[hash].css' : '[name].css',
            chunkFilename: isProd ? '[id]@[hash].css' : '[id].css'
        })
    )
};
