const path = require('path');
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",

    entry: [
        path.resolve(__dirname, './src/index.js'),
        path.resolve(__dirname, './src/modules/constants.js'),
        path.resolve(__dirname, './src/modules/getMetrics.js'),
        path.resolve(__dirname, './src/modules/helper.js'),
        path.resolve(__dirname, './src/assets/css/style.css')
    ],

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.bundle.js',
        assetModuleFilename: "assets/img/[name][ext]",

    },

    devtool: "source-map",

    module: {
        rules: [
            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                type: 'asset/resource'
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader'
                }
            }
        ]
    },

    plugins: [
        new Dotenv(),
        new HtmlWebpackPlugin({
            filename: "./index.html",
            template: "./src/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: './assets/css/[name].css'
        })
    ],

    experiments: {
        topLevelAwait: true
    }
};