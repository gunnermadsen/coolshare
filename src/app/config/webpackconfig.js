const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: {
        // vendor: './src/vendor.ts',
        polyfills: './src/polyfills.ts',
        main: './src/main.ts'
    },
    loaders: [
        {
            test: /\.html$/,
            loader: 'html-loader'
        },
        {
            test: /\.(scss|sass)$/,
            use: [
                'to-string-loader',
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true
                    }
                }
            ],
            include: helpers.root('src', 'app')
        },
        {
            test: /\.ts$/,
            loaders: [
                'babel-loader',
                {
                    loader: 'awesome-typescript-loader',
                    options: {
                        configFileName: helpers.root('tsconfig.json')
                    }
                },
                'angular2-template-loader',
                'angular-router-loader'
            ],
            exclude: [/node_modules/]
        }
    ],
    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    },
    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    },
    optimization: {
        noEmitOnErrors: true
    },
    devtool: false,
    plugins: [
        new CleanWebpackPlugin(
            helpers.root('dist'),
            {
                root: helpers.root(),
                verbose: true
            }
        ),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        // new MomentLocalesPlugin({
        //     localesToKeep: ['fr']
        // }),
        //new WriteFilePlugin()
        new webpack.SourceMapDevToolPlugin({}),
        new HtmlWebpackPlugin({ template: './src/index.html' })

    ]
};