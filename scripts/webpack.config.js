const { resolve } = require('path');
const { HotModuleReplacementPlugin } = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**@type {import('webpack').Configuration}*/
module.exports = {
    mode: 'development',
    entry: [
        // 'webpack/hot/dev-server.js',
        // 'webpack-dev-server/client/index.js?hot=true',
        resolve(__dirname, '../web/index.tsx'),
    ],
    output: {
        path: resolve(__dirname, '../dist/web'),
        filename: 'webview.js',
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.(js|ts|tsx)$/,
                loader: 'babel-loader',
                options: { cacheDirectory: true },
                exclude: /node_modules/,
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    },
                },
                generator: {
                    filename: 'images/[hash]-[name][ext][query]',
                },
            },
        ],
    },
    devtool: 'eval-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve(__dirname, '../web/index.html'),
        }),
        // new HotModuleReplacementPlugin(),
        // new ReactRefreshWebpackPlugin(),
    ],
};
