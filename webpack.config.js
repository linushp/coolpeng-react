var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

function isDevelopment() {
    return true;
}

//new webpack.optimize.OccurenceOrderPlugin(),
var p1=new webpack.HotModuleReplacementPlugin();
var p2=new webpack.NoErrorsPlugin();
var p3=new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(isDevelopment()?'development':"production")});
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

var plugins = [p1,p2,p3];
if(!isDevelopment()){
    plugins = [p2,p3,p4,p5];
}


module.exports = {
    devtool: isDevelopment()? 'eval-source-map':"",
    watch: isDevelopment(),
    entry: [
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/dist'
    },
    externals: {
        'react': 'window.React',
        "react-dom":"window.ReactDOM",
        "react-router":"window.ReactRouter"
    },
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
            },
            (isDevelopment()?
            {
                test: /\.less?$/,
                loaders : [ 'style-loader','css-loader','less-loader?{"sourceMap":true}' ],
                include: __dirname
            }:{
                test: /\.less?$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader"),
                include: __dirname
            }),
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                loader: 'url',
                query: {limit: 10240}
            }
        ]
    }
};
