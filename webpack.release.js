var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');



var p2=new webpack.NoErrorsPlugin();
var p3=new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify("production"),
    "process.env.BABEL_ENV":"cjs"
});
var p4=new ExtractTextPlugin("bundle.css");
var p5= new HtmlWebpackPlugin({                        //根据模板插入css/js等生成最终HTML
    filename: './index.html',    //生成的html存放路径，相对于 path
    template: './index.html',    //html模板路径
    inject: true,    //允许插件修改哪些内容，包括head与body
    hash: true,    //为静态资源生成hash值
    minify: {    //压缩HTML文件
        removeComments: true,    //移除HTML中的注释
        collapseWhitespace: false    //删除空白符与换行符
    }
});
var p6=new webpack.optimize.MinChunkSizePlugin(10);
var p7 =new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }
});

var plugins = [p2,p3,p4,p6,p5,p7];//release



module.exports = {
    devtool: "",
    watch: false,
    entry: [
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/dist'
    },
    // externals: isDevelopment()?{}:{
    //     'react': 'window.React',
    //     "react-dom":"window.ReactDOM",
    //     "react-router":"window.ReactRouter"
    // },
    plugins: plugins,
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules/,
                include: __dirname
            },{
                test: /\.less?$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader"),
                include: __dirname
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                loader: 'url',
                query: {limit: 10240}
            }
        ]
    }
};
