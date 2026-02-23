// vue.config.js
module.exports = {
    productionSourceMap: true,
    configureWebpack: {
        devtool: 'source-map',
        output: {
            // This replaces the long path-based names with a simpler [name] or [id]
            chunkFilename: 'js/[name].[contenthash:8].js',
            filename: 'js/[name].[contenthash:8].js',
        }
    }
}