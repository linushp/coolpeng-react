var webpackConfig = require("./webpack.config");
var createWebpackConfig = webpackConfig.createWebpackConfig;
module.exports = createWebpackConfig("framework/example/views/index.js", 'framework/example/index.html', "main");