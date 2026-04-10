var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry:{
        // 'entrance/index': './src/entrance/index.tsx',
        'settings/index': './src/settings/index.tsx',
        // 'usersetting/index': './src/usersetting/index.tsx',
        // 'customermgmt/index': './src/customermgmt/index.tsx',
        // 'usermgmt/index': './src/usermgmt/index.tsx',
        // 'taskmgmt/index': './src/taskmgmt/index.tsx',
        // 'accountmgmt/index': './src/accountmgmt/index.tsx',
        // 'resetpassword/index': './src/resetpassword/index.tsx',
        // 'mailbind/index': './src/mailbind/index.tsx',
        'message/index': './src/message/index.tsx',
        // 'tausermgmt/index': './src/tausermgmt/index.tsx',
        // 'index': './src/index.tsx' //for SPA
    },
    output:{
        path: path.resolve('./dev/dist'),
        filename: '[name].js'
    },
    resolve:{
        extensions: ["", ".ts", ".tsx", ".js"]
    },
    module:{
        loaders:[
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loaders: ['babel?presets[]=react,presets[]=es2015']

            },
            {
                test: /\.tsx?$/,
                exclude: /(node_modules|bower_components)/,
                loaders: ['ts-loader']
            }
        ]
    },
    // devtool: '#source-map',
    plugins:[
        new webpack.ProvidePlugin({
            "fetch": "imports?this=>global!exports?global.fetch!whatwg-fetch"
        })
        //new webpack.HotModuleReplacementPlugin(),
        //new webpack.NoErrorsPlugin()
        //,new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
    ],
    externals:{
        'jquery': 'jQuery',
        'moment': 'moment',
        'react': 'React',
        'react-dom': 'ReactDOM'
    }
}