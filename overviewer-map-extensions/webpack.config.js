const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const OUTPUT_PATH = process.env.OVERVIEWER_MAP_PATH || path.resolve(__dirname, 'dist');

const files = [
    'assets/overviewer-map-extensions-config.json',
    'assets/favicon.ico',
    'assets/moving-marker.js',
    'assets/overviewer-map-extensions.css'
]

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
                ...files.map((asset) => ({from: asset, to: OUTPUT_PATH})),
                {from: 'assets/images' , to: path.join(OUTPUT_PATH, 'images')}
            ]
        })
    ],
};