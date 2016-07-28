var webpackConfig = require("./webpack.config");
var createWebpackConfig = webpackConfig.createWebpackConfig;
module.exports = createWebpackConfig("test/reply/index.js","test/reply/index.html","replay");