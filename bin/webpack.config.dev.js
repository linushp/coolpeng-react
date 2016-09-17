var webpackConfig = require("./webpack.config");
var createWebpackConfig = webpackConfig.createWebpackConfig;
module.exports = createWebpackConfig("src/index.js", 'index.dev.html', "main");