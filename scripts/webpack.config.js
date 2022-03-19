const { resolve } = require('path');
const { HotModuleReplacementPlugin } = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const devServerClientOptions = {
    hot: true,
    // !: 指定构造 WebSocket 的协议是 ws
    protocol: 'ws',
    hostname: 'localhost',
    port: 3000,
    path: 'ws',
};
const devServerClientQuery = Object.entries(devServerClientOptions)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
    
const webpackHotDevServer = resolve(__dirname, './webpack-hot-dev-server.js');
const devEntries = [
    webpackHotDevServer,
    `webpack-dev-server/client/index.js?${devServerClientQuery}`,
];

/**@type {import('webpack').Configuration}*/
module.exports = {
    mode: 'development',
    entry: [
        ...devEntries,
        resolve(__dirname, '../web/index.tsx'),
    ],
    output: {
        publicPath: 'http://localhost:3000/',
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
        new HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin(),
    ],
};
