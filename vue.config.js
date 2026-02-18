// vue.config.js
module.exports = {
    configureWebpack: {
        output: {
            // This replaces the long path-based names with a simpler [name] or [id]
            chunkFilename: 'js/[name].[contenthash:8].js',
            filename: 'js/[name].[contenthash:8].js',
        }
    }
}