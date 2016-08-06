'use strict';

var webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    path = require('path'),
    fs = require('fs'),
    srcPath = path.join(__dirname, '../src');
var appPath = function(s){
    var x=  path.join(__dirname,"../");
    return path.join(x,s);
};

var __appPath = path.join(__dirname,"../");

var isProduction = function () {
    console.log("process.env.NODE_ENV:" + process.env.NODE_ENV);
    var env = process.env.NODE_ENV || "";
    var isRelease = env.trim() === "production";

    console.log("isRelease:", isRelease);
    return isRelease;

    //return true;
};


var ExtractTextPlugin = require("extract-text-webpack-plugin");





function createWebpackConfig(jsFile,htmlFile,mainFileName){
    var webpackConfig = {
        target: 'web',
        cache: true,
        entry: {
            main: appPath(jsFile)
        },
        /**
         *  Webpack 解析bundle 中请求的module 路径时的设置
         *  @type {Object}
         */
        resolve: {
            root: srcPath,
            extensions: ['', '.js'],
            modulesDirectories: ['node_modules', 'src'],
            alias: {}
        },
        /**
         *  Webpack bundle 的输出设置
         详情见于 https://webpack.github.io/docs/configuration.html#output-chunkfilename
         *  @type {Object}
         */
        output: {
            path: path.join(__appPath, 'dist'),
            publicPath: '/',
            filename: 'app/[name].[hash].js',
            chunkFilename: 'modules/[name].[hash].js',
            library: ['CoolpengApp', '[name]'],
            pathInfo: true
        },

        /**
         *  Webpack loaders
         *  @type {Object}
         */
        module: {
            loaders: [
                {test: /\.js?$/, exclude: /node_modules/, loader: 'babel?cacheDirectory'},
                {test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader'},
                {test: /\.scss$/, loaders: ["style", "css", "sass"]},
                {
                    test: /\.less?$/,
                    loaders: [
                        'style-loader',
                        'css-loader',
                        'less-loader?{"sourceMap":true}'
                    ],
                    include: __appPath
                },
                {
                    test: /\.css$/, loader: ExtractTextPlugin.extract(
                    "style-loader",
                    "css-loader?sourceMap",
                    {
                        publicPath: "../"
                    }
                )
                },
                {test: /\.(jpg|png|gif)$/, loader: 'url?limit=100000'},
                {test: /\.(woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000'},
            ],
            noParse: []
        },
        /**
         *  Config to node-sass
         *  @type {Object}
         */
        sassLoader: {
            includePaths: [path.resolve(__appPath, "./static")]
        },

        externals: {
            jquery: "window.jQuery",
            $: "window.jQuery",
            react:"window.React",
            ReactDOM:"window.ReactDOM",
            "react-dom":"window.ReactDOM",
            "react-router":"window.ReactRouter",
            "react-redux":"window.ReactRedux",
            "redux":"window.Redux",
            "history":"window.History",
            "lodash":"window._",
            "_":"window._",
            "underscore":"window._",
            "antd":"window.antd",
            "immutable":"window.Immutable"
        },


        plugins: [
            new HtmlWebpackPlugin({
                inject: true,
                //excludeChunks: ['tests'],
                template: appPath(htmlFile)
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            new webpack.NoErrorsPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
                }
            }),
            new ExtractTextPlugin("css/[hash]-[name].css", {
                disable: false,
                allChunks: true
            }),
            new webpack.DefinePlugin({
                __DEV__: JSON.stringify(JSON.parse(isProduction() ? 'false' : 'true'))
            })
        ],
        debug: isProduction() ? false : true,
        devtool: isProduction() ? null: 'eval-cheap-module-source-map',
        devServer: {
            port: 4000,
            host: "0.0.0.0",
            contentBase: './',
            historyApiFallback: true,
            proxy: {
                '/cloud/*': {

                    // target: 'http://www.coolpeng.cn',
                    target: 'http://127.0.0.1:10086',

                    secure: false,
                    changeOrigin: true
                },
                '/upload/*': {
                    target: 'https://www.coolpeng.cn',
                    secure: false
                }
            }
        }
    };


    if(mainFileName){
        webpackConfig.entry =  {};
        webpackConfig.entry[mainFileName] = appPath(jsFile);
    }

    return webpackConfig;
}


var webpackConfig = createWebpackConfig("src/index.js",'index.html',"main");
webpackConfig.createWebpackConfig = createWebpackConfig;
module.exports = webpackConfig;

