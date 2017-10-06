const webpack = require("webpack");

module.exports = {
    entry: {
        filename: "./index.js"
    },
    output: {
        filename: "./build.js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: [
                    ["es2015", {modules: false}]
                ]
            }
        }]
    }
};