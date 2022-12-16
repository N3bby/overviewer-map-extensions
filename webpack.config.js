const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const OUTPUT_PATH = process.env.OVERVIEWER_MAP_PATH || path.resolve(__dirname, 'dist');

module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'overviewer-map-extensions.js',
        path: OUTPUT_PATH,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'assets/index.html',
            minify: false,
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'assets/overviewer-map-extensions-config.json',
                    to: OUTPUT_PATH
                }
            ]
        })
    ],
};