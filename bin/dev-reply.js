var webpackConfig = require("./webpack.config");
var createWebpackConfig = webpackConfig.createWebpackConfig;
module.exports = createWebpackConfig("test/reply/index.js","index.html","replay");