const path = require("path");
const webpack_rules = [];
const webpackOption = {
    entry: './index.js',
    output: {
    	path: path.resolve(__dirname, 'dist'),
    	filename: 'js_spa_router.js',
    },
    module: {
        rules: webpack_rules
    }
};

// Refer options under .babelrc
let babelLoader = {
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
        loader: "babel-loader"
    }
};
webpack_rules.push(babelLoader);
module.exports = webpackOption;