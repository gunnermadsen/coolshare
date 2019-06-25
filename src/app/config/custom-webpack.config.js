const MomentLocalesPlugin = require('moment-locales-webpack-plugin');


module.exports = {
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [ 'sass-loader' ],
            }
        ]
    },
    plugins: [
        new MomentLocalesPlugin({
            localesToKeep: ['fr']
        })
    ]
};