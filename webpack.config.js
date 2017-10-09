const webpack = require("webpack");

module.exports = {
    entry: {
        filename: "./index.js"
    },
    output: {
        filename: "./dist/markpad.js"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
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